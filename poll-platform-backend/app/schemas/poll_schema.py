# app/schemas/poll_schema.py
from typing import List, Optional
from pydantic import BaseModel

class OptionCreate(BaseModel):
    text: str

class PollCreate(BaseModel):
    question: str
    options: List[OptionCreate]
    created_by: Optional[str] = None

class OptionOut(BaseModel):
    id: int
    text: str
    votes_count: int

    class Config:
        orm_mode = True

class PollOut(BaseModel):
    id: int
    question: str
    created_by: Optional[str]
    options: List[OptionOut]
    likes_count: int = 0

    class Config:
        orm_mode = True

class VoteCreate(BaseModel):
    option_id: int
    voter: Optional[str] = None

class LikeToggle(BaseModel):
    user_identifier: Optional[str] = None
