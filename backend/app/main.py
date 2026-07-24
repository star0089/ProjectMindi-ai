import logging
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.database.connection import engine, Base
from backend.app.models import *  # Registers all models with Base.metadata
from backend.app.routers import (
    projects, tasks, milestones, dashboard, timeline, scope, 
    risk, chat, planning, insights, team, notifications, 
    activity, reports, analytics, calendar, search
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("projectpilot")

# Automatically create SQLAlchemy database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Core backend API service for ProjectPilot AI, an autonomous project manager assistant.",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configurations derived from settings
origins = settings.get_cors_origins()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response

# Global Exception Handler for Unhandled Server Errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception on {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal Server Error",
            "message": "An unexpected server error occurred. Please try again later.",
            "path": request.url.path
        },
    )

# Global Exception Handler for HTTP Exceptions
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": "HTTP Error",
            "message": exc.detail,
            "path": request.url.path
        },
    )

# Register modular API routers
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(milestones.router)
app.include_router(dashboard.router)
app.include_router(timeline.router)
app.include_router(scope.router)
app.include_router(risk.router)
app.include_router(chat.router)
app.include_router(planning.router)
app.include_router(insights.router)
app.include_router(team.router)
app.include_router(notifications.router)
app.include_router(activity.router)
app.include_router(reports.router)
app.include_router(analytics.router)
app.include_router(calendar.router)
app.include_router(search.router)

@app.get("/")
def read_root():
    """
    API Health check endpoint.
    """
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "documentation": "/docs"
    }
