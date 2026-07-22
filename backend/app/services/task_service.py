from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from backend.app.models.task import Task
from backend.app.models.project import Project
from backend.app.schemas.task import TaskCreate, TaskUpdate, TaskResponse

def _enrich_task_response(task: Task) -> TaskResponse:
    project_name = task.project.name if task.project else None
    return TaskResponse(
        id=task.id,
        project_id=task.project_id,
        title=task.title,
        description=task.description,
        priority=task.priority,
        status=task.status,
        assignee=task.assignee,
        start_date=task.start_date,
        end_date=task.end_date,
        project_name=project_name
    )

def create_task(db: Session, task_in: TaskCreate) -> TaskResponse:
    db_task = Task(
        project_id=task_in.project_id,
        title=task_in.title,
        description=task_in.description,
        priority=task_in.priority or "medium",
        status=task_in.status or "todo",
        assignee=task_in.assignee,
        start_date=task_in.start_date,
        end_date=task_in.end_date
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return _enrich_task_response(db_task)

def get_task_by_id(db: Session, task_id: int) -> Optional[TaskResponse]:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return None
    return _enrich_task_response(task)

def get_all_tasks(
    db: Session,
    project_id: Optional[int] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None,
    assignee: Optional[str] = None
) -> List[TaskResponse]:
    query = db.query(Task)

    if project_id is not None:
        query = query.filter(Task.project_id == project_id)

    if status and status != "all":
        query = query.filter(Task.status == status)

    if priority and priority != "all":
        query = query.filter(Task.priority == priority)

    if assignee:
        query = query.filter(Task.assignee.ilike(f"%{assignee}%"))

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Task.title.ilike(search_pattern),
                Task.description.ilike(search_pattern)
            )
        )

    tasks = query.order_by(Task.id.desc()).all()
    return [_enrich_task_response(t) for t in tasks]

def update_task(db: Session, task_id: int, task_in: TaskUpdate) -> Optional[TaskResponse]:
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        return None

    update_data = task_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)

    db.commit()
    db.refresh(db_task)
    return _enrich_task_response(db_task)

def move_task_status(db: Session, task_id: int, new_status: str) -> Optional[TaskResponse]:
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        return None

    db_task.status = new_status
    db.commit()
    db.refresh(db_task)
    return _enrich_task_response(db_task)

def delete_task(db: Session, task_id: int) -> bool:
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        return False

    db.delete(db_task)
    db.commit()
    return True
