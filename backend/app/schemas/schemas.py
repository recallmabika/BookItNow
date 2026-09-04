from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, date
import uuid
from app.models.models import UserRole, PropertyStatus, BookingStatus, PaymentStatus


# ---------------- Auth & User Schemas ----------------
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    role: UserRole = UserRole.GUEST


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    role: str
    first_name: str
    last_name: str


class UserResponse(BaseModel):
    id: uuid.UUID
    email: str
    first_name: str
    last_name: str
    phone_number: Optional[str]
    role: str
    is_active: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------- Property & Room Schemas ----------------
class PropertyCreate(BaseModel):
    title: str
    slug: str
    description: str
    property_type: str  # hotel, lodge, guesthouse, apartment
    address_line: str
    city: str
    state_province: Optional[str] = None
    country: str = "Zimbabwe"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    check_in_time: str = "14:00"
    check_out_time: str = "10:00"
    house_rules: Optional[str] = None
    cancellation_policy: str = "flexible"
    amenities: List[str] = []
    photos: List[str] = []


class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    property_type: Optional[str] = None
    address_line: Optional[str] = None
    city: Optional[str] = None
    check_in_time: Optional[str] = None
    check_out_time: Optional[str] = None
    cancellation_policy: Optional[str] = None
    amenities: Optional[List[str]] = None
    photos: Optional[List[str]] = None
    status: Optional[PropertyStatus] = None


class RoomTypeCreate(BaseModel):
    name: str
    description: Optional[str] = None
    max_adults: int = 2
    max_children: int = 0
    total_rooms: int = 1
    base_price_per_night: float
    currency: str = "USD"
    amenities: List[str] = []
    photos: List[str] = []


class RatePlanCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price_modifier_type: str = "fixed"
    price_modifier_amount: float = 0.00
    includes_breakfast: bool = False
    is_non_refundable: bool = False


class AvailabilitySet(BaseModel):
    start_date: date
    end_date: date
    available_count: int
    price_override: Optional[float] = None
    is_blocked: bool = False


# ---------------- Booking Schemas ----------------
class BookingCreate(BaseModel):
    room_type_id: uuid.UUID
    rate_plan_id: Optional[uuid.UUID] = None
    check_in_date: date
    check_out_date: date
    rooms_count: int = 1
    adults_count: int = 1
    children_count: int = 0
    special_requests: Optional[str] = None
    idempotency_key: str
    payment_method: str = "paynow"  # paynow, ecocash, stripe, cash_on_arrival


class BookingResponse(BaseModel):
    id: uuid.UUID
    booking_reference: str
    guest_id: uuid.UUID
    room_type_id: uuid.UUID
    check_in_date: date
    check_out_date: date
    rooms_count: int
    adults_count: int
    children_count: int
    room_subtotal: float
    taxes_amount: float
    platform_fee: float
    total_amount: float
    currency: str
    status: BookingStatus
    special_requests: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------- Review Schemas ----------------
class ReviewCreate(BaseModel):
    booking_id: uuid.UUID
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None
