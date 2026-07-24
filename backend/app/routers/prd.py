from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.database.connection import get_db
from backend.app.schemas.prd import PRDParseRequest, PRDAuditRequest
from backend.app.services.prd_service import parse_prd_document, run_scope_audit

router = APIRouter(prefix="/prd", tags=["prd"])

@router.post("/parse")
def parse_prd(request: PRDParseRequest):
    """
    Parses a raw PRD / Scope of Work text document and extracts a structured Project Blueprint.
    """
    if not request.document_text or len(request.document_text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Please provide a valid PRD document text (minimum 10 characters).")
    
    return parse_prd_document(request.document_text, request.document_title or "Project Specification")

@router.post("/audit")
def audit_scope(request: PRDAuditRequest, db: Session = Depends(get_db)):
    """
    Runs an AI Scope Audit comparing the Project Blueprint against database tasks, milestones, and deliverables.
    """
    return run_scope_audit(db, request.project_id, request.blueprint)

@router.get("/audit")
def get_scope_audit(project_id: int = Query(1, description="Project ID"), db: Session = Depends(get_db)):
    """
    Gets the current AI Scope Audit report for a given project ID.
    """
    return run_scope_audit(db, project_id)
