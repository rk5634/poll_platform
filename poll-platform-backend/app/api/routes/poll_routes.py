from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.poll_schema import PollCreate, PollOut, VoteCreate, LikeToggle
from app.services.poll_service import PollService
from app.core.websocket_manager import ws_manager

router = APIRouter(prefix="/polls", tags=["Polls"])

def get_service(db: Session = Depends(get_db)) -> PollService:
    return PollService(db)

@router.post("/create_poll")
async def create_poll(payload: PollCreate, service: PollService = Depends(get_service)):
    poll = service.create_poll(
        question=payload.question,
        options=[o.text for o in payload.options],
        created_by=payload.created_by
    )
    if isinstance(poll, dict) and "error" in poll:
        raise HTTPException(status_code=400, detail=poll["error"])

    # Serialize options for WS
    options_data = [
        {"id": option.id, "text": option.text, "votes_count": option.votes_count}
        for option in poll.options
    ]

    # prepare broadcast message
    data = {
        "type": "poll_created",
        "payload": {
            "id": poll.id,
            "question": poll.question,
            "created_by": poll.created_by,
            "options": options_data,
            "likes_count": len(poll.likes or [])
        }
    }
    await ws_manager.broadcast(data)

    # HTTP response
    return PollOut(
        id=poll.id,
        question=poll.question,
        created_by=poll.created_by,
        options=options_data,
        likes_count=len(poll.likes or [])
    )



@router.get("/list_polls", response_model=List[PollOut])
def list_polls(service: PollService = Depends(get_service)):
    polls = service.list_polls()
    if isinstance(polls, dict) and "error" in polls:
        raise HTTPException(status_code=400, detail=polls["error"])  # ✅ FIXED

    out = []
    for p in polls:
        likes_count = len(p.likes or [])
        options_out = [
            {"id": option.id, "text": option.text, "votes_count": option.votes_count}
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
    result = service.vote(poll_id=poll_id, option_id=payload.option_id, voter=payload.voter)
    
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    
    if not result:
        raise HTTPException(status_code=404, detail="Option not found")
    
    # Extract new_option and old_option
    new_option = result.get("new_option") if isinstance(result, dict) else result
    old_option = result.get("old_option") if isinstance(result, dict) else None

    # Broadcast old option first if it exists
    if old_option:
        data_old = {
            "type": "vote",
            "payload": {
                "poll_id": poll_id,
                "option_id": old_option.id,
                "votes_count": old_option.votes_count
            }
        }
        await ws_manager.broadcast(data_old)

    # Broadcast new option
    data_new = {
        "type": "vote",
        "payload": {
            "poll_id": poll_id,
            "option_id": new_option.id,
            "votes_count": new_option.votes_count
        }
    }
    await ws_manager.broadcast(data_new)

    # Return response with both options if applicable
    return {
        "message": "Vote recorded",
        "new_option": {
            "option_id": new_option.id,
            "votes_count": new_option.votes_count
        },
        **({"old_option": {"option_id": old_option.id, "votes_count": old_option.votes_count}} if old_option else {})
    }



@router.post("/{poll_id}/like", response_model=dict)
async def toggle_like(poll_id: int, payload: LikeToggle, service: PollService = Depends(get_service)):
    count = service.toggle_like(poll_id=poll_id, user_identifier=payload.user_identifier)
    if isinstance(count, dict) and "error" in count:
        raise HTTPException(status_code=400, detail=count["error"])  # ✅ FIXED

    data = {"type": "like", "payload": {"poll_id": poll_id, "likes_count": count}}
    await ws_manager.broadcast(data)
    return {"message": "Like toggled", "likes_count": count}
