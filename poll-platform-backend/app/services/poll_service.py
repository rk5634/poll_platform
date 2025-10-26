# app/services/poll_service.py
from sqlalchemy.orm import Session
from typing import List, Optional
from app.repositories.poll_repository import PollRepository
from app.services.user_service import UserService


class PollService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = PollRepository(db)
        self.user_service = UserService(db)

    def _validate_user(self, email: str):
        """Private method to ensure the user exists before proceeding."""
        if not self.user_service.user_exists(email):
            return False
        return True

    def create_poll(self, question: str, options: List[str], created_by: str):
        if(not self._validate_user(created_by)):
            return {"error": "User does not exist."}
        return self.repo.create_poll(question=question, options=options, created_by=created_by)

    def list_polls(self):
        return self.repo.get_all_polls()

    def get_poll(self, poll_id: int):
        return self.repo.get_poll(poll_id)

    def vote(self, poll_id: int, option_id: int, voter: str):
        if(not self._validate_user(voter)):
            return {"error": "User does not exist."}        
        return self.repo.increment_vote(poll_id=poll_id, option_id=option_id, voter=voter)

    def toggle_like(self, poll_id: int, user_identifier: str):
        if(not self._validate_user(user_identifier)):
            return {"error": "User does not exist."}
        return self.repo.toggle_like(poll_id=poll_id, user_identifier=user_identifier)
