from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.database.connection import get_db
from backend.app.schemas.task import TaskCreate, TaskUpdate, TaskStatusUpdate, TaskResponse
from backend.app.services import task_service

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("", response_model=List[TaskResponse])
def get_tasks(
    project_id: Optional[int] = Query(None, description="Filter by project ID"),
    status: Optional[str] = Query(None, description="Filter by status (todo, in_progress, review, testing, done)"),
    priority: Optional[str] = Query(None, description="Filter by priority (low, medium, high, critical)"),
    search: Optional[str] = Query(None, description="Search task title or description"),
    assignee: Optional[str] = Query(None, description="Filter by assignee name"),
    db: Session = Depends(get_db)
):
    return task_service.get_all_tasks(
        db, 
        project_id=project_id, 
        status=status, 
        priority=priority, 
        search=search, 
        assignee=assignee
    )

@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    return task_service.create_task(db, task)

@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = task_service.get_task_by_id(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_in: TaskUpdate, db: Session = Depends(get_db)):
    updated = task_service.update_task(db, task_id, task_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated

@router.patch("/{task_id}/status", response_model=TaskResponse)
def move_task_status(task_id: int, payload: TaskStatusUpdate, db: Session = Depends(get_db)):
    updated = task_service.move_task_status(db, task_id, payload.status)
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    success = task_service.delete_task(db, task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return None
