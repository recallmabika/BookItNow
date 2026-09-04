import asyncio
from app.core.database import engine, Base
from app.models.models import *  # ensure all models are registered

async def init_tables():
    print("Creating all tables in PostgreSQL schema 'bookitnow'...")
    async with engine.begin() as conn:
        await conn.execute(sa.text("CREATE SCHEMA IF NOT EXISTS bookitnow;"))
        await conn.run_sync(Base.metadata.create_all)
    print("ALL TABLES CREATED SUCCESSFULLY IN 'bookitnow' SCHEMA!")
    await engine.dispose()

if __name__ == "__main__":
    import sqlalchemy as sa
    asyncio.run(init_tables())
