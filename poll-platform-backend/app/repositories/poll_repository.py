from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Optional, Union
from app.models.poll import Poll, Option, Vote, Like


class PollRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_poll(self, question: str, options: List[str], created_by: str) -> Union[Poll, dict]:
        try:
            poll = Poll(question=question, created_by=created_by)
            self.db.add(poll)
            self.db.flush()  # assign id before adding options
            for opt_text in options:
                opt = Option(text=opt_text, poll_id=poll.id)
                self.db.add(opt)
            self.db.commit()
            self.db.refresh(poll)
            return poll
        except SQLAlchemyError:
            self.db.rollback()
            return {"error": "Something went wrong while creating the poll. Please try again."}

    def get_all_polls(self) -> Union[List[Poll], dict]:
        try:
            return self.db.query(Poll).all()
        except SQLAlchemyError:
            return {"error": "Unable to fetch polls at the moment. Please refresh or try again later."}

    def get_poll(self, poll_id: int) -> Union[Optional[Poll], dict]:
        try:
            return self.db.query(Poll).filter(Poll.id == poll_id).first()
        except SQLAlchemyError:
            return {"error": "Unable to fetch this poll. Please try again later."}



    def increment_vote(self, poll_id: int, option_id: int, voter: str) -> Union[dict, Option]:
        try:
            existing_vote = (
                self.db.query(Vote)
                .filter(Vote.poll_id == poll_id, Vote.voter == voter)
                .first()
            )

            new_option = (
                self.db.query(Option)
                .filter(Option.id == option_id, Option.poll_id == poll_id)
                .first()
            )
            if not new_option:
                return {"error": "The selected option does not exist."}

            old_option = None

            if existing_vote:
                if existing_vote.option_id == option_id:
                    return {"error": "You have already voted for this option."}

                # Fetch old option to decrement vote
                old_option = self.db.query(Option).filter(Option.id == existing_vote.option_id).first()
                if old_option and old_option.votes_count > 0:
                    old_option.votes_count -= 1
                    self.db.add(old_option)

                # Update existing vote
                existing_vote.option_id = option_id
                new_option.votes_count = (new_option.votes_count or 0) + 1
                self.db.add(existing_vote)
                self.db.add(new_option)

            else:
                # First-time vote
                vote = Vote(poll_id=poll_id, option_id=option_id, voter=voter)
                new_option.votes_count = (new_option.votes_count or 0) + 1
                self.db.add(vote)
                self.db.add(new_option)

            self.db.commit()
            self.db.refresh(new_option)
            if old_option:
                self.db.refresh(old_option)
                return {"new_option": new_option, "old_option": old_option}
            else:
                return {"new_option": new_option}

        except SQLAlchemyError:
            self.db.rollback()
            return {"error": "Database error occurred."}


    def toggle_like(self, poll_id: int, user_identifier: str) -> Union[int, dict]:
        try:
            existing = (
                self.db.query(Like)
                .filter(Like.poll_id == poll_id, Like.user_identifier == user_identifier)
                .first()
            )
            if existing:
                self.db.delete(existing)
                self.db.commit()
            else:
                like = Like(poll_id=poll_id, user_identifier=user_identifier)
                self.db.add(like)
                self.db.commit()

            count = self.db.query(Like).filter(Like.poll_id == poll_id).count()
            return count
        except SQLAlchemyError:
            self.db.rollback()
            return {"error": "Something went wrong while updating the like. Please try again."}
