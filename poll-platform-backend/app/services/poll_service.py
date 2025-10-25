# app/services/poll_service.py
from sqlalchemy.orm import Session
from typing import List, Optional
from app.repositories.poll_repository import PollRepository

class PollService:
    def __init__(self, db: Session):
        self.repo = PollRepository(db)

    def create_poll(self, question: str, options: List[str], created_by: Optional[str] = None):
        return self.repo.create_poll(question=question, options=options, created_by=created_by)

    def list_polls(self):
        return self.repo.get_all_polls()

    def get_poll(self, poll_id: int):
        return self.repo.get_poll(poll_id)

    def vote(self, poll_id: int, option_id: int, voter: Optional[str] = None):
        return self.repo.increment_vote(poll_id=poll_id, option_id=option_id, voter=voter)

    def toggle_like(self, poll_id: int, user_identifier: Optional[str] = None):
        return self.repo.toggle_like(poll_id=poll_id, user_identifier=user_identifier)
