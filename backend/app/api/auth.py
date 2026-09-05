from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token, decode_token
from app.models.models import User, UserRole
from app.schemas.schemas import UserRegister, UserLogin, TokenResponse, UserResponse
from app.api.deps import get_current_user, require_roles
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import uuid

router = APIRouter(prefix="/auth", tags=["Authentication"])

class AdminCreateUserRequest(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    role: str = "staff" # host, staff, admin

class UserListItem(BaseModel):
    id: uuid.UUID
    email: str
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    role: str
    is_active: bool
    is_verified: bool
    created_at: str

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserRegister, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(User).where(User.email == user_in.email.lower()))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="A user with this email address is already registered")
    
    user = User(
        email=user_in.email.lower(),
        hashed_password=get_password_hash(user_in.password),
        first_name=user_in.first_name.strip(),
        last_name=user_in.last_name.strip(),
        phone_number=user_in.phone_number,
        role=user_in.role,
        is_active=True,
        is_verified=True if user_in.role == UserRole.GUEST else False
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    access_token = create_access_token(subject=str(user.id), role=user.role.value)
    refresh_token = create_refresh_token(subject=str(user.id), role=user.role.value)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=str(user.id),
        email=user.email,
        role=user.role.value,
        first_name=user.first_name,
        last_name=user.last_name
    )

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == credentials.email.lower()))
    user = result.scalar_one_or_none()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is deactivated")
    
    access_token = create_access_token(subject=str(user.id), role=user.role.value)
    refresh_token = create_refresh_token(subject=str(user.id), role=user.role.value)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=str(user.id),
        email=user.email,
        role=user.role.value,
        first_name=user.first_name,
        last_name=user.last_name
    )

@router.get("/users", response_model=List[UserListItem])
async def list_all_users(
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).order_by(User.created_at.desc()))
    users = result.scalars().all()
    return [
        UserListItem(
            id=u.id,
            email=u.email,
            first_name=u.first_name,
            last_name=u.last_name,
            phone_number=u.phone_number,
            role=u.role.value if hasattr(u.role, 'value') else str(u.role),
            is_active=u.is_active,
            is_verified=u.is_verified,
            created_at=u.created_at.isoformat()
        )
        for u in users
    ]

@router.post("/users", status_code=status.HTTP_201_CREATED)
async def admin_create_user(
    user_in: AdminCreateUserRequest,
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    existing = await db.execute(select(User).where(User.email == user_in.email.lower()))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="A user with this email address already exists")
    
    # Map role
    try:
        role_enum = UserRole(user_in.role.lower())
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {[r.value for r in UserRole]}")

    new_user = User(
        email=user_in.email.lower(),
        hashed_password=get_password_hash(user_in.password),
        first_name=user_in.first_name.strip(),
        last_name=user_in.last_name.strip(),
        phone_number=user_in.phone_number,
        role=role_enum,
        is_active=True,
        is_verified=True
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return {
        "id": str(new_user.id),
        "email": new_user.email,
        "role": new_user.role.value if hasattr(new_user.role, 'value') else str(new_user.role),
        "first_name": new_user.first_name,
        "last_name": new_user.last_name,
        "message": f"Account for {new_user.email} successfully provisioned."
    }

@router.patch("/users/{user_id}/toggle-status")
async def toggle_user_active_status(
    user_id: uuid.UUID,
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    target = await db.get(User, user_id)
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    if target.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot deactivate your own super admin account")
    
    target.is_active = not target.is_active
    await db.commit()
    return {"id": str(target.id), "is_active": target.is_active, "email": target.email}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
