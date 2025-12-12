from pydantic_settings import BaseSettings
from typing import List
from urllib.parse import quote_plus

class Settings(BaseSettings):
    # Database
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "health_tracker"
    
    # Security
    SECRET_KEY: str = "super-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # API
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Health Tracker API"
    DEBUG: bool = True
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = []
    
    # Anthropic AI
    GEMINI_API_KEY=your-gemini-key-here # Add this
    
    @property
    def DATABASE_URL(self) -> str:
        password = quote_plus(self.POSTGRES_PASSWORD)
        return f"postgresql://{self.POSTGRES_USER}:{password}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()