# app/repositories/user_repository.py
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
from app.models.user import User
from sqlalchemy.exc import SQLAlchemyError


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, email: str, name: Optional[str] = None) -> Dict[str, str]:
        try:
            # Check if user already exists
            existing_user = self.db.query(User).filter(User.email == email).first()
            if existing_user:
                return {"status": "info", "message": "User already exists", "email": existing_user.email}

            # Create new user
            user = User(email=email, name=name)
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)

            return {"status": "success", "message": "User created successfully", "user_id": user.id, "email": user.email}

        except SQLAlchemyError as e:
            self.db.rollback()
            return {"status": "error", "message": f"User not created: {str(e)}"}
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()