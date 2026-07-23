from sqlalchemy.orm import Session
from backend.app.models.notification import Notification
from backend.app.schemas.notification import NotificationCreate
from typing import List

def get_notifications(db: Session) -> List[Notification]:
    return db.query(Notification).order_by(Notification.timestamp.desc()).all()

def create_notification(db: Session, notif_in: NotificationCreate) -> Notification:
    db_notif = Notification(
        title=notif_in.title,
        content=notif_in.content,
        type=notif_in.type
    )
    db.add(db_notif)
    db.commit()
    db.refresh(db_notif)
    return db_notif

def mark_as_read(db: Session, notif_id: int) -> bool:
    notif = db.query(Notification).filter(Notification.id == notif_id).first()
    if notif:
        notif.is_read = 1
        db.commit()
        return True
    return False

def mark_all_as_read(db: Session):
    db.query(Notification).update({Notification.is_read: 1})
    db.commit()
