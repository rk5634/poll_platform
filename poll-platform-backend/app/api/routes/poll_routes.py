# app/api/routes/poll_routes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.poll_schema import PollCreate, PollOut, VoteCreate, LikeToggle
from app.services.poll_service import PollService
import asyncio
from app.core.websocket_manager import ws_manager

router = APIRouter(prefix="/polls", tags=["Polls"])

def get_service(db: Session = Depends(get_db)) -> PollService:
    return PollService(db)

@router.post("/create_poll", response_model=PollOut)
async def create_poll(payload: PollCreate, service: PollService = Depends(get_service)):
    poll = service.create_poll(question=payload.question, options=[o.text for o in payload.options], created_by=payload.created_by)
    # prepare broadcast message
    data = {
        "type": "poll_created",
        "payload": {
            "id": poll.id,
            "question": poll.question
        }
    }
    # broadcast asynchronously
    await ws_manager.broadcast(data)
    # compute likes_count for response
    likes_count = len(poll.likes or [])
    
    # Convert options to OptionOut schema
    options_out = [
        {
            "id": option.id,
            "text": option.text,
            "votes_count": option.votes_count
        }
        for option in poll.options
    ]
    
    return PollOut(
        id=poll.id,
        question=poll.question,
        created_by=poll.created_by,
        options=options_out,
        likes_count=likes_count
    )

@router.get("/list_polls", response_model=List[PollOut])
def list_polls(service: PollService = Depends(get_service)):
    polls = service.list_polls()
    # convert to PollOut; likes_count computed
    out = []
    for p in polls:
        likes_count = len(p.likes or [])
        # Convert options to OptionOut schema
        options_out = [
            {
                "id": option.id,
                "text": option.text,
                "votes_count": option.votes_count
            }
            for option in p.options
        ]
        out.append(PollOut(
            id=p.id,
            question=p.question,
            created_by=p.created_by,
            options=options_out,
            likes_count=likes_count
        ))
    return out

@router.post("/{poll_id}/vote", response_model=dict)
async def vote_on_poll(poll_id: int, payload: VoteCreate, service: PollService = Depends(get_service)):
    opt = service.vote(poll_id=poll_id, option_id=payload.option_id, voter=payload.voter)
    if not opt:
        raise HTTPException(status_code=404, detail="Option not found")
    data = {
        "type": "vote",
        "payload": {
            "poll_id": poll_id,
            "option_id": opt.id,
            "votes_count": opt.votes_count
        }
    }

    await ws_manager.broadcast(data)
    return {"message": "vote recorded", "option_id": opt.id, "votes_count": opt.votes_count}

@router.post("/{poll_id}/like", response_model=dict)
async def toggle_like(poll_id: int, payload: LikeToggle, service: PollService = Depends(get_service)):
    count = service.toggle_like(poll_id=poll_id, user_identifier=payload.user_identifier)
    data = {
        "type": "like",
        "payload": {
            "poll_id": poll_id,
            "likes_count": count
        }
    }
    
    await ws_manager.broadcast(data)
    return {"message": "like toggled", "likes_count": count}
