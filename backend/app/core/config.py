from anyio.functools import lru_cache
from pydantic import Field
from pydantic_settings import SettingsConfigDict, BaseSettings


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=True, extra="ignore"
    )

    DEBUG: bool = Field(default=False)
    HOST: int = Field(default=8000)
    DATABASE_URL: str = Field(default="DATABASE_URL")

    ALLOWED_ORIGINS: list[str] = Field(default=["*"])

    BCV_URL: str = Field(default="https://www.bcv.org.ve")
    BCV_VERIFY_SSL: bool = Field(
        default=False, description="Verify BCV SSL certificate (Fail if site fails)"
    )


@lru_cache
def get_settings():
    return Settings()


settings = get_settings()
