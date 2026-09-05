from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "BookItNow"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # Real PostgreSQL Connection with dedicated schema search_path
    DATABASE_URL: str = "postgresql+asyncpg://postgres:Cyber%402029@127.0.0.1:5433/bookitnow_db"
    DB_SCHEMA: str = "bookitnow"
    
    # Real Redis Connection
    REDIS_URL: str = "redis://localhost:6379/1"
    
    # Security & Auth
    SECRET_KEY: str = "bookitnow_ultra_secure_production_secret_key_2026_jwt_token_sign"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    
    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
