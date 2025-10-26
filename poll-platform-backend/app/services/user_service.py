# app/services/poll_service.py
from sqlalchemy.orm import Session
from typing import Optional
from app.repositories.user_repository import UserRepository


class UserService:
    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    def create_user(self, email: str, name: Optional[str] = None):
        return self.repo.create_user(email=email, name=name)
    
    def user_exists(self, email: str) -> bool:
        user = self.repo.get_user_by_email(email)
        return user is not None