from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from sqlalchemy.orm import selectinload
from typing import List, Optional
from datetime import date, timedelta
import uuid

from app.core.database import get_db
from app.models.models import (
    Property, RoomType, RatePlan, RoomAvailability, 
    User, UserRole, PropertyStatus
)
from app.schemas.schemas import (
    PropertyCreate, PropertyUpdate, RoomTypeCreate, 
    RatePlanCreate, AvailabilitySet
)
from app.api.deps import get_current_user, require_roles

router = APIRouter(prefix="/properties", tags=["Properties"])


# ---------------- Guest Search & Discovery ----------------
@router.get("/search")
async def search_properties(
    city: Optional[str] = Query(None, description="City location name"),
    check_in: Optional[date] = Query(None, description="Check-in date"),
    check_out: Optional[date] = Query(None, description="Check-out date"),
    guests: int = Query(1, ge=1, description="Number of guests"),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    property_type: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(Property)
        .options(
            selectinload(Property.room_types).selectinload(RoomType.rate_plans),
            selectinload(Property.room_types).selectinload(RoomType.availabilities)
        )
        .where(Property.status == PropertyStatus.ACTIVE)
    )
    
    if city:
        query = query.where(func.lower(Property.city).contains(city.lower().strip()))
    if property_type:
        query = query.where(Property.property_type == property_type)
        
    result = await db.execute(query)
    properties = result.scalars().all()
    
    matched_properties = []
    for prop in properties:
        # Filter room types that accommodate guests
        valid_rooms = []
        for room in prop.room_types:
            if (room.max_adults + room.max_children) < guests:
                continue
            if min_price and float(room.base_price_per_night) < min_price:
                continue
            if max_price and float(room.base_price_per_night) > max_price:
                continue
            
            # Check availability if dates provided
            if check_in and check_out:
                curr_date = check_in
                has_availability = True
                while curr_date < check_out:
                    # Look up room_availabilities record
                    avail_record = next(
                        (a for a in room.availabilities if a.date == curr_date), 
                        None
                    )
                    avail_count = avail_record.available_count if avail_record else room.total_rooms
                    if avail_record and avail_record.is_blocked:
                        has_availability = False
                        break
                    if avail_count <= 0:
                        has_availability = False
                        break
                    curr_date += timedelta(days=1)
                
                if not has_availability:
                    continue
                    
            valid_rooms.append({
                "id": str(room.id),
                "name": room.name,
                "description": room.description,
                "max_adults": room.max_adults,
                "max_children": room.max_children,
                "base_price_per_night": float(room.base_price_per_night),
                "currency": room.currency,
                "amenities": room.amenities,
                "photos": room.photos,
                "rate_plans": [
                    {
                        "id": str(rp.id),
                        "name": rp.name,
                        "includes_breakfast": rp.includes_breakfast,
                        "is_non_refundable": rp.is_non_refundable
                    } for rp in room.rate_plans
                ]
            })
            
        if valid_rooms:
            matched_properties.append({
                "id": str(prop.id),
                "title": prop.title,
                "slug": prop.slug,
                "description": prop.description,
                "property_type": prop.property_type,
                "address_line": prop.address_line,
                "city": prop.city,
                "country": prop.country,
                "latitude": float(prop.latitude) if prop.latitude else None,
                "longitude": float(prop.longitude) if prop.longitude else None,
                "amenities": prop.amenities,
                "photos": prop.photos,
                "cancellation_policy": prop.cancellation_policy,
                "room_types": valid_rooms
            })
            
    return matched_properties


@router.get("/{slug_or_id}")
async def get_property(slug_or_id: str, db: AsyncSession = Depends(get_db)):
    # Try by UUID or slug
    query = (
        select(Property)
        .options(
            selectinload(Property.room_types).selectinload(RoomType.rate_plans),
            selectinload(Property.room_types).selectinload(RoomType.availabilities),
            selectinload(Property.reviews)
        )
    )
    try:
        val_uuid = uuid.UUID(slug_or_id)
        query = query.where(Property.id == val_uuid)
    except ValueError:
        query = query.where(Property.slug == slug_or_id)
        
    result = await db.execute(query)
    prop = result.scalar_one_or_none()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
        
    return {
        "id": str(prop.id),
        "title": prop.title,
        "slug": prop.slug,
        "description": prop.description,
        "property_type": prop.property_type,
        "address_line": prop.address_line,
        "city": prop.city,
        "country": prop.country,
        "latitude": float(prop.latitude) if prop.latitude else None,
        "longitude": float(prop.longitude) if prop.longitude else None,
        "check_in_time": prop.check_in_time,
        "check_out_time": prop.check_out_time,
        "house_rules": prop.house_rules,
        "cancellation_policy": prop.cancellation_policy,
        "amenities": prop.amenities,
        "photos": prop.photos,
        "status": prop.status.value,
        "room_types": [
            {
                "id": str(r.id),
                "name": r.name,
                "description": r.description,
                "max_adults": r.max_adults,
                "max_children": r.max_children,
                "total_rooms": r.total_rooms,
                "base_price_per_night": float(r.base_price_per_night),
                "currency": r.currency,
                "amenities": r.amenities,
                "photos": r.photos,
                "rate_plans": [
                    {
                        "id": str(rp.id),
                        "name": rp.name,
                        "description": rp.description,
                        "includes_breakfast": rp.includes_breakfast,
                        "is_non_refundable": rp.is_non_refundable,
                        "price_modifier_type": rp.price_modifier_type,
                        "price_modifier_amount": float(rp.price_modifier_amount)
                    } for rp in r.rate_plans
                ]
            } for r in prop.room_types
        ],
        "reviews": [
            {
                "id": str(rv.id),
                "rating": rv.rating,
                "comment": rv.comment,
                "host_response": rv.host_response,
                "created_at": rv.created_at.isoformat()
            } for rv in prop.reviews
        ]
    }


# ---------------- Host & Admin Property Management ----------------
@router.get("/manage")
async def get_managed_properties(
    current_user: User = Depends(require_roles(UserRole.HOST, UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(Property)
        .options(
            selectinload(Property.room_types).selectinload(RoomType.rate_plans),
            selectinload(Property.room_types).selectinload(RoomType.availabilities)
        )
        .order_by(Property.created_at.desc())
    )
    if current_user.role != UserRole.ADMIN:
        query = query.where(Property.host_id == current_user.id)

    result = await db.execute(query)
    properties = result.scalars().all()

    return [
        {
            "id": str(p.id),
            "title": p.title,
            "slug": p.slug,
            "property_type": p.property_type,
            "city": p.city,
            "country": p.country,
            "status": p.status.value,
            "created_at": p.created_at.isoformat(),
            "room_types": [
                {
                    "id": str(r.id),
                    "name": r.name,
                    "total_rooms": r.total_rooms,
                    "base_price_per_night": float(r.base_price_per_night),
                    "currency": r.currency
                }
                for r in p.room_types
            ]
        }
        for p in properties
    ]


@router.patch("/{property_id}/status")
async def update_property_status(
    property_id: uuid.UUID,
    status_val: str = Query(..., description="active, pending_approval, or suspended"),
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    prop = await db.get(Property, property_id)
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    try:
        prop.status = PropertyStatus(status_val.lower())
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid status value")
    await db.commit()
    return {"id": str(prop.id), "status": prop.status.value}


@router.delete("/{property_id}", status_code=status.HTTP_200_OK)
async def delete_property(
    property_id: uuid.UUID,
    current_user: User = Depends(require_roles(UserRole.HOST, UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    prop = await db.get(Property, property_id)
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    if prop.host_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized to delete this property")
    await db.delete(prop)
    await db.commit()
    return {"status": "success", "message": f"Property '{prop.title}' has been deleted."}



@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_property(
    prop_in: PropertyCreate,
    current_user: User = Depends(require_roles(UserRole.HOST, UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    # Check slug uniqueness
    existing = await db.execute(select(Property).where(Property.slug == prop_in.slug.lower()))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="A property with this URL slug already exists")
        
    prop = Property(
        host_id=current_user.id,
        title=prop_in.title,
        slug=prop_in.slug.lower(),
        description=prop_in.description,
        property_type=prop_in.property_type,
        address_line=prop_in.address_line,
        city=prop_in.city,
        state_province=prop_in.state_province,
        country=prop_in.country,
        latitude=prop_in.latitude,
        longitude=prop_in.longitude,
        check_in_time=prop_in.check_in_time,
        check_out_time=prop_in.check_out_time,
        house_rules=prop_in.house_rules,
        cancellation_policy=prop_in.cancellation_policy,
        amenities=prop_in.amenities,
        photos=prop_in.photos,
        # Admins auto-activate, hosts go to active for MVP flow or pending
        status=PropertyStatus.ACTIVE
    )
    db.add(prop)
    await db.commit()
    await db.refresh(prop)
    return {"id": str(prop.id), "slug": prop.slug, "title": prop.title, "status": prop.status.value}


@router.post("/{property_id}/room-types", status_code=status.HTTP_201_CREATED)
async def add_room_type(
    property_id: uuid.UUID,
    room_in: RoomTypeCreate,
    current_user: User = Depends(require_roles(UserRole.HOST, UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    prop = await db.get(Property, property_id)
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    if prop.host_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized to edit this property")
        
    room = RoomType(
        property_id=property_id,
        name=room_in.name,
        description=room_in.description,
        max_adults=room_in.max_adults,
        max_children=room_in.max_children,
        total_rooms=room_in.total_rooms,
        base_price_per_night=room_in.base_price_per_night,
        currency=room_in.currency,
        amenities=room_in.amenities,
        photos=room_in.photos
    )
    db.add(room)
    await db.commit()
    await db.refresh(room)
    
    # Auto create a default "Standard Rate" plan
    default_rate_plan = RatePlan(
        room_type_id=room.id,
        name="Standard Flexible Rate",
        description="Standard booking with flexible cancellation",
        includes_breakfast=False,
        is_non_refundable=False
    )
    db.add(default_rate_plan)
    await db.commit()
    
    return {"id": str(room.id), "name": room.name, "total_rooms": room.total_rooms, "base_price": float(room.base_price_per_night)}


@router.post("/rooms/{room_type_id}/rate-plans", status_code=status.HTTP_201_CREATED)
async def add_rate_plan(
    room_type_id: uuid.UUID,
    plan_in: RatePlanCreate,
    current_user: User = Depends(require_roles(UserRole.HOST, UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    room = await db.get(RoomType, room_type_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room type not found")
        
    plan = RatePlan(
        room_type_id=room_type_id,
        name=plan_in.name,
        description=plan_in.description,
        price_modifier_type=plan_in.price_modifier_type,
        price_modifier_amount=plan_in.price_modifier_amount,
        includes_breakfast=plan_in.includes_breakfast,
        is_non_refundable=plan_in.is_non_refundable
    )
    db.add(plan)
    await db.commit()
    await db.refresh(plan)
    return {"id": str(plan.id), "name": plan.name}


@router.post("/rooms/{room_type_id}/availability")
async def update_room_availability(
    room_type_id: uuid.UUID,
    avail_in: AvailabilitySet,
    current_user: User = Depends(require_roles(UserRole.HOST, UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    room = await db.get(RoomType, room_type_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room type not found")
        
    curr_date = avail_in.start_date
    updated_count = 0
    while curr_date <= avail_in.end_date:
        # Check if record exists
        result = await db.execute(
            select(RoomAvailability).where(
                and_(
                    RoomAvailability.room_type_id == room_type_id,
                    RoomAvailability.date == curr_date
                )
            )
        )
        record = result.scalar_one_or_none()
        if record:
            record.available_count = avail_in.available_count
            record.price_override = avail_in.price_override
            record.is_blocked = avail_in.is_blocked
        else:
            new_record = RoomAvailability(
                room_type_id=room_type_id,
                date=curr_date,
                available_count=avail_in.available_count,
                price_override=avail_in.price_override,
                is_blocked=avail_in.is_blocked
            )
            db.add(new_record)
        curr_date += timedelta(days=1)
        updated_count += 1
        
    await db.commit()
    return {"status": "success", "days_updated": updated_count}
