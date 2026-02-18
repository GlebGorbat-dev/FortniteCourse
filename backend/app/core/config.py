from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Union


def _normalize_cors_origins(v: Union[str, List[str]]) -> List[str]:
    """Accept CORS_ORIGINS as comma-separated string or list (e.g. from Render env)."""
    if isinstance(v, str):
        v = [origin.strip() for origin in v.split(",") if origin.strip()]
    return v if v else ["http://localhost:3000"]


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Stripe (опционально для тестирования)
    STRIPE_SECRET_KEY: str = "sk_test_dummy"
    STRIPE_PUBLISHABLE_KEY: str = "pk_test_dummy"
    STRIPE_WEBHOOK_SECRET: str = "whsec_dummy"
    
    # ЮKassa (опционально для тестирования)
    YOOKASSA_SHOP_ID: str = "123456"
    YOOKASSA_SECRET_KEY: str = "test_dummy_key"
    
    # Frontend
    FRONTEND_URL: str = "http://localhost:3000"
    
    # Google OAuth (опционально)
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    
    # Email SMTP (для сброса пароля)
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = ""
    SMTP_FROM_NAME: str = "Fortnite Course"
    
    # Environment
    ENVIRONMENT: str = "development"
    
    # CORS — can be comma-separated string (e.g. from Render) or list
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:3001"]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def normalize_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        return _normalize_cors_origins(v)

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

