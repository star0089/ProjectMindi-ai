import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union

class Settings(BaseSettings):
    PROJECT_NAME: str = "ProjectPilot AI"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./projectpilot.db")
    
    # Security & Secret Key
    SECRET_KEY: str = os.getenv("SECRET_KEY", "projectpilot-secret-key-change-in-production")
    
    # Gemini AI Key
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # CORS
    CORS_ORIGINS: Union[str, List[str]] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "https://projectpilot-ai.vercel.app",
        "https://frontend-brown-xi-96.vercel.app"
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    def get_cors_origins(self) -> List[str]:
        if isinstance(self.CORS_ORIGINS, str):
            if "," in self.CORS_ORIGINS:
                return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]
            return [self.CORS_ORIGINS.strip()]
        return self.CORS_ORIGINS

settings = Settings()
