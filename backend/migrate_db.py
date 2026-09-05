import asyncio
import urllib.parse
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.database import Base
from app.models.models import (
    User, UserRole, Property, PropertyStatus, RoomType, RatePlan, RoomAvailability, Booking, BookingStatus, Payment, PaymentStatus, Review
)
from app.core.security import get_password_hash

async def migrate_and_seed():
    pwd_quoted = urllib.parse.quote_plus("Cyber@2029")
    url = f"postgresql+asyncpg://postgres:{pwd_quoted}@127.0.0.1:5433/bookitnow_db"
    engine = create_async_engine(
        url,
        connect_args={"server_settings": {"search_path": "bookitnow,public"}}
    )

    async with engine.begin() as conn:
        # 1. Create schema
        await conn.execute(text("CREATE SCHEMA IF NOT EXISTS bookitnow;"))
        # 2. Create tables
        await conn.run_sync(Base.metadata.create_all)
        print("Schema and tables successfully created.")

    # 3. Create Admin Account for recall.mabika@zitrac.co.zw
    from sqlalchemy.ext.asyncio import async_sessionmaker, AsyncSession
    from sqlalchemy import select

    Session = async_sessionmaker(bind=engine, class_=AsyncSession)
    async with Session() as session:
        email = "recall.mabika@zitrac.co.zw"
        res = await session.execute(select(User).where(User.email == email))
        admin_user = res.scalar_one_or_none()
        
        if not admin_user:
            admin_user = User(
                email=email,
                hashed_password=get_password_hash("Cyber@2029"),
                first_name="Recall",
                last_name="Mabika",
                phone_number="+263770000000",
                role=UserRole.ADMIN,
                is_active=True,
                is_verified=True
            )
            session.add(admin_user)
            print(f"Created Admin account for {email}")
        else:
            admin_user.role = UserRole.ADMIN
            admin_user.hashed_password = get_password_hash("Cyber@2029")
            admin_user.is_active = True
            print(f"Promoted existing user {email} to ADMIN with updated password.")

        await session.commit()

    await engine.dispose()
    print("Database migration & superuser creation complete!")

if __name__ == "__main__":
    asyncio.run(migrate_and_seed())
