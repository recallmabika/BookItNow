import asyncio
import urllib.parse
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

async def setup():
    pwd_quoted = urllib.parse.quote_plus("Cyber@2029")
    url = f"postgresql+asyncpg://postgres:{pwd_quoted}@127.0.0.1:5433/postgres"
    engine = create_async_engine(url, isolation_level="AUTOCOMMIT")
    async with engine.connect() as conn:
        res = await conn.execute(text("SELECT 1 FROM pg_database WHERE datname = 'bookitnow_db'"))
        if not res.scalar():
            await conn.execute(text("CREATE DATABASE bookitnow_db"))
            print("Successfully created database 'bookitnow_db'")
        else:
            print("Database 'bookitnow_db' already exists")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(setup())
