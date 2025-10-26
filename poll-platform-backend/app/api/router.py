# app/api/router.py
from fastapi import APIRouter
from app.api.routes import poll_routes
from app.api.routes import user_routes


router = APIRouter()
router.include_router(poll_routes.router)
router.include_router(user_routes.router)
