# app/repositories/poll_repository.py
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.poll import Poll, Option, Vote, Like

class PollRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_poll(self, question: str, options: List[str], created_by: Optional[str]=None) -> Poll:
        poll = Poll(question=question, created_by=created_by)
        self.db.add(poll)
        self.db.flush()  # assign id
        for opt_text in options:
            opt = Option(text=opt_text, poll_id=poll.id)
            self.db.add(opt)
        self.db.commit()
        self.db.refresh(poll)
        return poll

    def get_all_polls(self) -> List[Poll]:
        return self.db.query(Poll).all()

    def get_poll(self, poll_id: int) -> Optional[Poll]:
        return self.db.query(Poll).filter(Poll.id == poll_id).first()

    def increment_vote(self, poll_id: int, option_id: int, voter: Optional[str]=None) -> Optional[Option]:
        opt = self.db.query(Option).filter(Option.id == option_id, Option.poll_id == poll_id).first()
        if not opt:
            return None
        # create Vote record
        vote = Vote(poll_id=poll_id, option_id=option_id, voter=voter)
        opt.votes_count = (opt.votes_count or 0) + 1
        self.db.add(vote)
        self.db.add(opt)
        self.db.commit()
        self.db.refresh(opt)
        return opt

    def toggle_like(self, poll_id: int, user_identifier: Optional[str]=None) -> int:
        # simple toggle: if a Like with same poll_id and user_identifier exists, remove it; else add.
        if user_identifier:
            existing = self.db.query(Like).filter(Like.poll_id == poll_id, Like.user_identifier == user_identifier).first()
            if existing:
                self.db.delete(existing)
                self.db.commit()
            else:
                like = Like(poll_id=poll_id, user_identifier=user_identifier)
                self.db.add(like)
                self.db.commit()
        else:
            # anonymous like: always add (could be spammy - for MVP acceptable)
            like = Like(poll_id=poll_id, user_identifier=None)
            self.db.add(like)
            self.db.commit()
        # return likes count
        count = self.db.query(Like).filter(Like.poll_id == poll_id).count()
        return count
