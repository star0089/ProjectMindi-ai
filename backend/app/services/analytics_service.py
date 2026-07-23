from sqlalchemy.orm import Session
from backend.app.models.analytics import AnalyticsSnapshot
from backend.app.schemas.analytics import AnalyticsSnapshotCreate
from typing import List

def get_analytics(db: Session, snapshot_type: str = None) -> List[AnalyticsSnapshot]:
    query = db.query(AnalyticsSnapshot)
    if snapshot_type:
        query = query.filter(AnalyticsSnapshot.type == snapshot_type)
    return query.order_by(AnalyticsSnapshot.date.desc()).all()

def create_snapshot(db: Session, snapshot_in: AnalyticsSnapshotCreate) -> AnalyticsSnapshot:
    db_snapshot = AnalyticsSnapshot(
        type=snapshot_in.type,
        metrics=snapshot_in.metrics,
        date=snapshot_in.date
    )
    db.add(db_snapshot)
    db.commit()
    db.refresh(db_snapshot)
    return db_snapshot
