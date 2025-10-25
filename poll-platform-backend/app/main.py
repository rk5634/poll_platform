# app/main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.core.config import settings
from app.core.database import init_db
from app.api.router import router as api_router
from app.core.websocket_manager import ws_manager

# -------------------------
# Lifespan for startup/shutdown
# -------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup ---
    init_db()
    print("✅ Database initialized")

    yield  # Application runs here

    # --- Shutdown ---
    print("🛑 Application shutting down")

# -------------------------
# App factory
# -------------------------
def create_app() -> FastAPI:
    app = FastAPI(title=settings.APP_NAME, lifespan=lifespan)

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # all origins
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include API routers first
    app.include_router(api_router, prefix="")

    # Health check route
    @app.get("/health")
    def health():
        return {"status": "ok", "app": settings.APP_NAME}

    # -------------------------
    # WebSocket endpoint
    # -------------------------
    @app.websocket("/ws")
    async def websocket_endpoint(ws: WebSocket):
        await ws_manager.connect(ws)
        print(f"🟢 WebSocket connected: {ws.client}")
        try:
            while True:
                msg = await ws.receive_text()
                print(f"Received: {msg}")
                # Optional: broadcast received message
                await ws_manager.broadcast({"message": msg})
        except WebSocketDisconnect:
            ws_manager.disconnect(ws)
            print(f"🔴 WebSocket disconnected: {ws.client}")
        except Exception as e:
            ws_manager.disconnect(ws)
            print(f"⚠️ WebSocket error: {e}")

    print("✅ App routes and WebSocket registered")
    return app


# -------------------------
# Create app instance
# -------------------------
app = create_app()

# -------------------------
# Uvicorn entrypoint
# -------------------------
if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
