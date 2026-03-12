from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    NEWS_API_KEY: Optional[str] = ""
    OPENAI_API_KEY: Optional[str] = ""
    SUPABASE_URL: Optional[str] = ""
    SUPABASE_KEY: Optional[str] = ""


settings = Settings()
