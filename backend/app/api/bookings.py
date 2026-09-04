from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
import uuid
import random
import string
from datetime import timedelta

from app.core.database import get_db, get_redis
from app.models.models import (
    Booking, BookingStatus, Payment, PaymentStatus, 
    RoomType, RoomAvailability, RatePlan, User
)
from app.schemas.schemas import BookingCreate, BookingResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/bookings", tags=["Bookings"])


def generate_booking_reference() -> str:
    chars = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"BIN-{chars}"


@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    booking_in: BookingCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    redis = Depends(get_redis)
):
    if booking_in.check_in_date >= booking_in.check_out_date:
        raise HTTPException(status_code=400, detail="Check-out date must be after check-in date")
        
    nights = (booking_in.check_out_date - booking_in.check_in_date).days
    if nights <= 0:
        raise HTTPException(status_code=400, detail="Booking duration must be at least 1 night")

    # 1. Idempotency Check via Redis & DB
    idempotency_cache_key = f"idempotency:{booking_in.idempotency_key}"
    existing_booking_id = await redis.get(idempotency_cache_key)
    if existing_booking_id:
        existing_booking = await db.get(Booking, uuid.UUID(existing_booking_id))
        if existing_booking:
            return existing_booking

    # 2. Concurrency Control: Distributed Lock on Room Type during inventory verification
    lock_key = f"lock:room:{booking_in.room_type_id}"
    lock_acquired = await redis.set(lock_key, "locked", ex=10, nx=True)
    if not lock_acquired:
        raise HTTPException(status_code=409, detail="Room is currently being reserved by another guest. Please retry in a moment.")

    try:
        # 3. Retrieve Room Type with row lock
        room_stmt = select(RoomType).where(RoomType.id == booking_in.room_type_id).with_for_update()
        room_res = await db.execute(room_stmt)
        room = room_res.scalar_one_or_none()
        if not room:
            raise HTTPException(status_code=404, detail="Room type not found")

        # Capacity Check
        total_guests = booking_in.adults_count + booking_in.children_count
        if total_guests > (room.max_adults + room.max_children) * booking_in.rooms_count:
            raise HTTPException(status_code=400, detail=f"Guest capacity exceeded. Maximum is {(room.max_adults + room.max_children) * booking_in.rooms_count}")

        # 4. Atomic Inventory Verification & Decrement across each day
        curr_date = booking_in.check_in_date
        total_room_cost = 0.0

        avail_records_to_save = []
        while curr_date < booking_in.check_out_date:
            # Query availability record with row-level lock
            avail_stmt = (
                select(RoomAvailability)
                .where(
                    and_(
                        RoomAvailability.room_type_id == room.id,
                        RoomAvailability.date == curr_date
                    )
                )
                .with_for_update()
            )
            avail_res = await db.execute(avail_stmt)
            avail_record = avail_res.scalar_one_or_none()

            nightly_rate = float(room.base_price_per_night)
            
            if avail_record:
                if avail_record.is_blocked:
                    raise HTTPException(status_code=400, detail=f"Room is blocked on date {curr_date}")
                if avail_record.available_count < booking_in.rooms_count:
                    raise HTTPException(status_code=400, detail=f"Sold out! Only {avail_record.available_count} room(s) available on {curr_date}")
                if avail_record.price_override:
                    nightly_rate = float(avail_record.price_override)
                avail_record.available_count -= booking_in.rooms_count
                avail_records_to_save.append(avail_record)
            else:
                # Default total inventory
                if room.total_rooms < booking_in.rooms_count:
                    raise HTTPException(status_code=400, detail=f"Sold out on {curr_date}")
                new_avail = RoomAvailability(
                    room_type_id=room.id,
                    date=curr_date,
                    available_count=room.total_rooms - booking_in.rooms_count,
                    price_override=None,
                    is_blocked=False
                )
                avail_records_to_save.append(new_avail)
                db.add(new_avail)

            total_room_cost += nightly_rate * booking_in.rooms_count
            curr_date += timedelta(days=1)

        # 5. Transparent Pricing Calculation (Room Subtotal + 10% VAT/Taxes + 5% Platform Fee)
        taxes = round(total_room_cost * 0.10, 2)
        platform_fee = round(total_room_cost * 0.05, 2)
        total_amount = round(total_room_cost + taxes + platform_fee, 2)

        # 6. Create Real Booking Record
        booking = Booking(
            booking_reference=generate_booking_reference(),
            guest_id=current_user.id,
            room_type_id=room.id,
            rate_plan_id=booking_in.rate_plan_id,
            check_in_date=booking_in.check_in_date,
            check_out_date=booking_in.check_out_date,
            rooms_count=booking_in.rooms_count,
            adults_count=booking_in.adults_count,
            children_count=booking_in.children_count,
            room_subtotal=total_room_cost,
            taxes_amount=taxes,
            platform_fee=platform_fee,
            total_amount=total_amount,
            currency=room.currency,
            status=BookingStatus.CONFIRMED,  # Instant confirmation per README specification
            special_requests=booking_in.special_requests,
            qr_code_data=f"CHECKIN:{booking_in.idempotency_key[:8]}"
        )
        db.add(booking)
        await db.flush()

        # 7. Create Payment Transaction Record
        payment = Payment(
            booking_id=booking.id,
            idempotency_key=booking_in.idempotency_key,
            provider=booking_in.payment_method,
            transaction_reference=f"TXN-{uuid.uuid4().hex[:12].upper()}",
            amount=total_amount,
            currency=room.currency,
            status=PaymentStatus.SUCCESS,
            raw_response={"channel": booking_in.payment_method, "verified": True}
        )
        db.add(payment)
        
        await db.commit()
        await db.refresh(booking)

        # Cache idempotency for 24 hours
        await redis.set(idempotency_cache_key, str(booking.id), ex=86400)
        return booking

    finally:
        # Release the lock
        await redis.delete(lock_key)


@router.get("/my-bookings")
async def get_my_bookings(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(Booking)
        .where(Booking.guest_id == current_user.id)
        .order_by(Booking.created_at.desc())
    )
    result = await db.execute(stmt)
    bookings = result.scalars().all()
    return bookings
