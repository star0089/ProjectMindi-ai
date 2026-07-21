from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.database.connection import engine, Base
from backend.app.models import *  # This registers all models with metadata
from backend.app.routers import projects, tasks, dashboard, timeline, scope, risk, chat

# Automatically create SQLAlchemy database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ProjectPilot AI API",
    description="Core backend service for ProjectPilot AI, an autonomous project manager assistant.",
    version="1.0.0",
)

# CORS configurations for local frontend development integration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register modular routes
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(dashboard.router)
app.include_router(timeline.router)
app.include_router(scope.router)
app.include_router(risk.router)
app.include_router(chat.router)

@app.get("/")
def read_root():
    """
    API Health check endpoint.
    """
    return {
        "status": "online",
        "app": "ProjectPilot AI Backend",
        "version": "1.0.0",
        "documentation": "/docs"
    }
