# app/schemas/poll_schema.py

from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr  # ensures valid email format
    name: Optional[str] = None