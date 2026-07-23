from sqlalchemy.orm import Session
from backend.app.models.activity import ActivityLog
from backend.app.schemas.activity import ActivityLogCreate
from typing import List

def get_activities(db: Session) -> List[ActivityLog]:
    return db.query(ActivityLog).order_by(ActivityLog.timestamp.desc()).all()

def log_activity(db: Session, log_in: ActivityLogCreate) -> ActivityLog:
    db_log = ActivityLog(
        entity_type=log_in.entity_type,
        entity_id=log_in.entity_id,
        action=log_in.action,
        details=log_in.details
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log
