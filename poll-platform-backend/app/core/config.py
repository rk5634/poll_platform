# app/core/config.py
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "Poll Platform MVP"
    DATABASE_URL: str = "sqlite:///./polls.db"
    DEBUG: bool = True

    class Config:
        env_file = ".env"

settings = Settings()
