from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app.database.connection import get_db
from backend.app.schemas.report import ReportCreate, ReportResponse
from backend.app.services import reporting_service

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("", response_model=List[ReportResponse])
def get_reports(db: Session = Depends(get_db)):
    return reporting_service.get_reports(db)

@router.post("", response_model=ReportResponse)
def generate_report(report: ReportCreate, db: Session = Depends(get_db)):
    return reporting_service.generate_report(db, report)
