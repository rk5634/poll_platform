# app/schemas/poll_schema.py
from typing import List, Optional
from pydantic import BaseModel, EmailStr

class OptionCreate(BaseModel):
    text: str

class PollCreate(BaseModel):
    question: str
    options: List[OptionCreate]
    created_by: EmailStr

class OptionOut(BaseModel):
    id: int
    text: str
    votes_count: int

    class Config:
        orm_mode = True

class PollOut(BaseModel):
    id: int
    question: str
    created_by: EmailStr
    options: List[OptionOut]
    likes_count: int = 0

    class Config:
        orm_mode = True

class VoteCreate(BaseModel):
    option_id: int
    voter: EmailStr

class LikeToggle(BaseModel):
    user_identifier: EmailStr
