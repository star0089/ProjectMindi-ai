from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.database.connection import get_db
from backend.app.schemas.analytics import AnalyticsSnapshotCreate, AnalyticsSnapshotResponse
from backend.app.services import analytics_service

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("", response_model=List[AnalyticsSnapshotResponse])
def get_analytics(type: Optional[str] = None, db: Session = Depends(get_db)):
    return analytics_service.get_analytics(db, snapshot_type=type)

@router.post("", response_model=AnalyticsSnapshotResponse)
def create_snapshot(snapshot: AnalyticsSnapshotCreate, db: Session = Depends(get_db)):
    return analytics_service.create_snapshot(db, snapshot)
