from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database.connection import get_db
from backend.app.services import dashboard_service

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("")
def get_dashboard_summary(db: Session = Depends(get_db)):
    """
    Get real dashboard summary and metrics from SQLite.
    """
    return dashboard_service.get_dashboard_analytics(db)
