from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from datetime import date
from typing import List, Optional
from backend.app.models.project import Project
from backend.app.models.task import Task
from backend.app.models.milestone import Milestone
from backend.app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse

def _enrich_project_response(project: Project) -> ProjectResponse:
    tasks = project.tasks or []
    milestones = project.milestones or []
    
    total_tasks = len(tasks)
    completed_tasks = sum(1 for t in tasks if t.status == "done")
    pending_tasks = total_tasks - completed_tasks
    
    today = date.today()
    overdue_tasks = sum(
        1 for t in tasks 
        if t.status != "done" and t.end_date is not None and t.end_date < today
    )

    progress_pct = round((completed_tasks / total_tasks * 100), 1) if total_tasks > 0 else 0.0
    
    total_milestones = len(milestones)
    completed_milestones = sum(1 for m in milestones if m.completed)

    response_dict = {
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "status": project.status,
        "deadline": project.deadline,
        "created_at": project.created_at,
        "updated_at": project.updated_at,
        "progress_percentage": progress_pct,
        "completed_tasks_count": completed_tasks,
        "pending_tasks_count": pending_tasks,
        "total_tasks_count": total_tasks,
        "overdue_tasks_count": overdue_tasks,
        "milestones_count": total_milestones,
        "completed_milestones_count": completed_milestones,
    }
    return ProjectResponse(**response_dict)

def create_project(db: Session, project_in: ProjectCreate) -> ProjectResponse:
    db_project = Project(
        name=project_in.name,
        description=project_in.description,
        status=project_in.status or "active",
        deadline=project_in.deadline
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return _enrich_project_response(db_project)

def get_project_by_id(db: Session, project_id: int) -> Optional[ProjectResponse]:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        return None
    return _enrich_project_response(project)

def get_all_projects(
    db: Session, 
    search: Optional[str] = None, 
    status: Optional[str] = None,
    sort_by: Optional[str] = "created_at"
) -> List[ProjectResponse]:
    query = db.query(Project)
    
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Project.name.ilike(search_pattern),
                Project.description.ilike(search_pattern)
            )
        )
    
    if status and status != "all":
        query = query.filter(Project.status == status)

    if sort_by == "name":
        query = query.order_by(Project.name.asc())
    elif sort_by == "deadline":
        query = query.order_by(Project.deadline.asc().nulls_last())
    else:
        query = query.order_by(Project.created_at.desc())

    projects = query.all()
    results = [_enrich_project_response(p) for p in projects]

    if sort_by == "progress":
        results.sort(key=lambda x: x.progress_percentage, reverse=True)

    return results

def update_project(db: Session, project_id: int, project_in: ProjectUpdate) -> Optional[ProjectResponse]:
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        return None

    update_data = project_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_project, field, value)

    db.commit()
    db.refresh(db_project)
    return _enrich_project_response(db_project)

def delete_project(db: Session, project_id: int) -> bool:
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        return False
    
    db.delete(db_project)
    db.commit()
    return True

def get_project_context_for_ai(db: Session, project_id: int) -> dict:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        return {}
    
    tasks = [
        {"id": t.id, "title": t.title, "status": t.status, "priority": t.priority, "deadline": str(t.end_date) if t.end_date else None} 
        for t in project.tasks
    ] if project.tasks else []
    
    milestones = [
        {"id": m.id, "title": m.title, "status": "completed" if m.completed else "pending", "deadline": str(m.deadline) if m.deadline else None} 
        for m in project.milestones
    ] if project.milestones else []
    
    scopes = [
        {"requirement": s.requirement, "status": s.status, "notes": s.notes} 
        for s in project.scopes
    ] if project.scopes else []
    
    risks = [
        {"title": r.title, "severity": r.severity, "status": r.status, "description": r.description} 
        for r in project.risks
    ] if project.risks else []

    return {
        "project": {
            "name": project.name,
            "description": project.description,
            "deadline": str(project.deadline) if project.deadline else None
        },
        "tasks": tasks,
        "milestones": milestones,
        "scopes": scopes,
        "risks": risks
    }

