from sqlalchemy.orm import Session
from backend.app.models.report import Report
from backend.app.schemas.report import ReportCreate
from typing import List

def get_reports(db: Session) -> List[Report]:
    return db.query(Report).order_by(Report.generated_at.desc()).all()

def generate_report(db: Session, report_in: ReportCreate) -> Report:
    db_report = Report(
        title=report_in.title,
        type=report_in.type,
        content=report_in.content,
        format=report_in.format
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report
