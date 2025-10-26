from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user_schema import UserCreate
from app.core.database import get_db
from app.services.user_service import UserService  # service class containing create_user

router = APIRouter(prefix="/users", tags=["Users"])

def get_user_service(db: Session = Depends(get_db)) -> UserService:
    return UserService(db)

@router.post("/create_user")
async def create_user(payload: UserCreate, service: UserService = Depends(get_user_service)):
    data = service.create_user(email=payload.email, name=payload.name)
    return data