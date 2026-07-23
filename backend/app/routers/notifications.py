from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app.database.connection import get_db
from backend.app.schemas.notification import NotificationCreate, NotificationResponse
from backend.app.services import notification_service

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("", response_model=List[NotificationResponse])
def get_notifications(db: Session = Depends(get_db)):
    return notification_service.get_notifications(db)

@router.post("", response_model=NotificationResponse)
def create_notification(notif: NotificationCreate, db: Session = Depends(get_db)):
    return notification_service.create_notification(db, notif)

@router.patch("/{notif_id}/read")
def mark_read(notif_id: int, db: Session = Depends(get_db)):
    success = notification_service.mark_as_read(db, notif_id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"status": "success"}

@router.post("/read-all")
def mark_all_read(db: Session = Depends(get_db)):
    notification_service.mark_all_as_read(db)
    return {"status": "success"}
