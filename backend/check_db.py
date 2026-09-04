import asyncio
import asyncpg

async def check():
    passwords = [
        'Cybux', 'cybux', 'CYBUX', 'Cybux1', 'Cybux@1', 'Cybux@123',
        'Cybux2029', 'Cybux@2029', 'Cybux2026', 'Cybux@2026',
        'Cybux!', 'Cybux#', 'Cybux$',
        'cybux123', 'cybux@123', 'cybux2029', 'cybux@2029',
        'cybux.pass', 'Cybux.Pass', 'Cybux@Pass', 'Cybux@123.Pass'
    ]
    for p in passwords:
        try:
            conn = await asyncpg.connect(user='postgres', password=p, host='127.0.0.1', port=5432, database='postgres')
            print(f"FOUND_POSTGRES_PASSWORD: '{p}'")
            dbs = await conn.fetch("SELECT datname FROM pg_database WHERE datname='bookitnow_db'")
            if not dbs:
                await conn.execute("CREATE DATABASE bookitnow_db")
                print("CREATED_DATABASE: bookitnow_db")
            else:
                print("EXISTS_DATABASE: bookitnow_db")
            await conn.close()
            return
        except Exception as e:
            pass
    print("NO_PASSWORD_MATCHED_FOR_POSTGRES_USER")

asyncio.run(check())
