from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Any, Dict
from backend.app.database.connection import get_db
from backend.app.services import calendar_service

router = APIRouter(prefix="/calendar", tags=["calendar"])

@router.get("")
def get_calendar_events(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    return calendar_service.get_calendar_events(db)
