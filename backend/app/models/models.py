from datetime import datetime, date
import uuid
import enum
from typing import List, Optional
from sqlalchemy import (
    String, Text, Boolean, Integer, Numeric, Date, DateTime, 
    ForeignKey, Enum, Index, CheckConstraint
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class UserRole(str, enum.Enum):
    GUEST = "guest"
    HOST = "host"
    STAFF = "staff"
    ADMIN = "admin"


class PropertyStatus(str, enum.Enum):
    PENDING_APPROVAL = "pending_approval"
    ACTIVE = "active"
    SUSPENDED = "suspended"


class BookingStatus(str, enum.Enum):
    PENDING_PAYMENT = "pending_payment"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"
    REFUNDED = "refunded"


# -------------------------------------------------------------
# 1. Real Users Model
# -------------------------------------------------------------
class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "bookitnow"}

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone_number: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole, name="user_role", schema="bookitnow"), default=UserRole.GUEST, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    properties: Mapped[List["Property"]] = relationship("Property", back_populates="host", cascade="all, delete-orphan")
    bookings: Mapped[List["Booking"]] = relationship("Booking", back_populates="guest", cascade="all, delete-orphan")
    reviews: Mapped[List["Review"]] = relationship("Review", back_populates="guest")


# -------------------------------------------------------------
# 2. Real Properties Model
# -------------------------------------------------------------
class Property(Base):
    __tablename__ = "properties"
    __table_args__ = {"schema": "bookitnow"}

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    host_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("bookitnow.users.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    property_type: Mapped[str] = mapped_column(String(50), nullable=False)  # hotel, lodge, guesthouse, apartment
    
    # Location
    address_line: Mapped[str] = mapped_column(String(255), nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    state_province: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    country: Mapped[str] = mapped_column(String(100), default="Zimbabwe", nullable=False)
    latitude: Mapped[Optional[float]] = mapped_column(Numeric(10, 7), nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Numeric(10, 7), nullable=True)
    
    # Rules & Policies
    check_in_time: Mapped[str] = mapped_column(String(10), default="14:00", nullable=False)
    check_out_time: Mapped[str] = mapped_column(String(10), default="10:00", nullable=False)
    house_rules: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    cancellation_policy: Mapped[str] = mapped_column(String(50), default="flexible", nullable=False)
    
    # Media & Amenities
    amenities: Mapped[dict] = mapped_column(JSONB, default=list, nullable=False)
    photos: Mapped[dict] = mapped_column(JSONB, default=list, nullable=False)
    
    status: Mapped[PropertyStatus] = mapped_column(
        Enum(PropertyStatus, name="property_status", schema="bookitnow"), 
        default=PropertyStatus.PENDING_APPROVAL, 
        nullable=False,
        index=True
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    host: Mapped["User"] = relationship("User", back_populates="properties")
    room_types: Mapped[List["RoomType"]] = relationship("RoomType", back_populates="property", cascade="all, delete-orphan")
    reviews: Mapped[List["Review"]] = relationship("Review", back_populates="property")


# -------------------------------------------------------------
# 3. Real Room Types & Inventory
# -------------------------------------------------------------
class RoomType(Base):
    __tablename__ = "room_types"
    __table_args__ = {"schema": "bookitnow"}

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("bookitnow.properties.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)  # Deluxe King, Standard Double, Safari Suite
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    max_adults: Mapped[int] = mapped_column(Integer, default=2, nullable=False)
    max_children: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_rooms: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    base_price_per_night: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="USD", nullable=False)
    amenities: Mapped[dict] = mapped_column(JSONB, default=list, nullable=False)
    photos: Mapped[dict] = mapped_column(JSONB, default=list, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    property: Mapped["Property"] = relationship("Property", back_populates="room_types")
    rate_plans: Mapped[List["RatePlan"]] = relationship("RatePlan", back_populates="room_type", cascade="all, delete-orphan")
    availabilities: Mapped[List["RoomAvailability"]] = relationship("RoomAvailability", back_populates="room_type", cascade="all, delete-orphan")
    bookings: Mapped[List["Booking"]] = relationship("Booking", back_populates="room_type")


# -------------------------------------------------------------
# 4. Real Rate Plans
# -------------------------------------------------------------
class RatePlan(Base):
    __tablename__ = "rate_plans"
    __table_args__ = {"schema": "bookitnow"}

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    room_type_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("bookitnow.room_types.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)  # Room Only, Bed & Breakfast, All Inclusive
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    price_modifier_type: Mapped[str] = mapped_column(String(20), default="fixed")  # fixed, percentage
    price_modifier_amount: Mapped[float] = mapped_column(Numeric(10, 2), default=0.00, nullable=False)
    includes_breakfast: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_non_refundable: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    room_type: Mapped["RoomType"] = relationship("RoomType", back_populates="rate_plans")


# -------------------------------------------------------------
# 5. Real Room Availability (Date-Specific with Row Locking)
# -------------------------------------------------------------
class RoomAvailability(Base):
    __tablename__ = "room_availabilities"
    __table_args__ = (
        Index("idx_room_avail_date", "room_type_id", "date", unique=True),
        CheckConstraint("available_count >= 0", name="chk_positive_available_count"),
        {"schema": "bookitnow"}
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    room_type_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("bookitnow.room_types.id", ondelete="CASCADE"), nullable=False, index=True)
    date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    available_count: Mapped[int] = mapped_column(Integer, nullable=False)
    price_override: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), nullable=True)
    is_blocked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    room_type: Mapped["RoomType"] = relationship("RoomType", back_populates="availabilities")


# -------------------------------------------------------------
# 6. Real Bookings & Invoicing
# -------------------------------------------------------------
class Booking(Base):
    __tablename__ = "bookings"
    __table_args__ = {"schema": "bookitnow"}

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_reference: Mapped[str] = mapped_column(String(30), unique=True, index=True, nullable=False)  # e.g. BIN-873912
    guest_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("bookitnow.users.id", ondelete="RESTRICT"), nullable=False, index=True)
    room_type_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("bookitnow.room_types.id", ondelete="RESTRICT"), nullable=False, index=True)
    rate_plan_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("bookitnow.rate_plans.id", ondelete="SET NULL"), nullable=True)
    
    check_in_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    check_out_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    rooms_count: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    adults_count: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    children_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    # Financial breakdown (Strictly accurate calculation)
    room_subtotal: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    taxes_amount: Mapped[float] = mapped_column(Numeric(10, 2), default=0.00, nullable=False)
    platform_fee: Mapped[float] = mapped_column(Numeric(10, 2), default=0.00, nullable=False)
    total_amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="USD", nullable=False)
    
    status: Mapped[BookingStatus] = mapped_column(
        Enum(BookingStatus, name="booking_status", schema="bookitnow"), 
        default=BookingStatus.PENDING_PAYMENT, 
        nullable=False,
        index=True
    )
    special_requests: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    qr_code_data: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    guest: Mapped["User"] = relationship("User", back_populates="bookings")
    room_type: Mapped["RoomType"] = relationship("RoomType", back_populates="bookings")
    payment: Mapped[Optional["Payment"]] = relationship("Payment", back_populates="booking", uselist=False)
    review: Mapped[Optional["Review"]] = relationship("Review", back_populates="booking", uselist=False)


# -------------------------------------------------------------
# 7. Real Payments with Idempotency Protection
# -------------------------------------------------------------
class Payment(Base):
    __tablename__ = "payments"
    __table_args__ = {"schema": "bookitnow"}

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("bookitnow.bookings.id", ondelete="CASCADE"), unique=True, nullable=False)
    idempotency_key: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    
    provider: Mapped[str] = mapped_column(String(50), nullable=False)  # paynow, ecocash, stripe, cash_on_arrival
    transaction_reference: Mapped[Optional[str]] = mapped_column(String(100), unique=True, nullable=True)
    amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="USD", nullable=False)
    status: Mapped[PaymentStatus] = mapped_column(
        Enum(PaymentStatus, name="payment_status", schema="bookitnow"), 
        default=PaymentStatus.PENDING, 
        nullable=False
    )
    raw_response: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    booking: Mapped["Booking"] = relationship("Booking", back_populates="payment")


# -------------------------------------------------------------
# 8. Real Verified-Stay Reviews
# -------------------------------------------------------------
class Review(Base):
    __tablename__ = "reviews"
    __table_args__ = {"schema": "bookitnow"}

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("bookitnow.bookings.id", ondelete="CASCADE"), unique=True, nullable=False)
    property_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("bookitnow.properties.id", ondelete="CASCADE"), nullable=False, index=True)
    guest_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("bookitnow.users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    rating: Mapped[int] = mapped_column(Integer, nullable=False)  # 1-5
    comment: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    host_response: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    booking: Mapped["Booking"] = relationship("Booking", back_populates="review")
    property: Mapped["Property"] = relationship("Property", back_populates="reviews")
    guest: Mapped["User"] = relationship("User", back_populates="reviews")
