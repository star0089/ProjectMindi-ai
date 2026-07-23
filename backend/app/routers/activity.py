from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app.database.connection import get_db
from backend.app.schemas.activity import ActivityLogCreate, ActivityLogResponse
from backend.app.services import activity_service

router = APIRouter(prefix="/activity", tags=["activity"])

@router.get("", response_model=List[ActivityLogResponse])
def get_activity(db: Session = Depends(get_db)):
    return activity_service.get_activities(db)

@router.post("", response_model=ActivityLogResponse)
def log_activity(log: ActivityLogCreate, db: Session = Depends(get_db)):
    return activity_service.log_activity(db, log)
