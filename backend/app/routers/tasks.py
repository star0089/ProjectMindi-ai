from fastapi import APIRouter, status, Query
from typing import List, Optional
from datetime import date
from backend.app.schemas.task import TaskCreate, TaskResponse

router = APIRouter(prefix="/tasks", tags=["tasks"])

MOCK_TASKS = [
    {
        "id": 1,
        "project_id": 1,
        "title": "Establish folder structure",
        "description": "Create frontend and backend folders according to specifications.",
        "priority": "critical",
        "status": "done",
        "assignee": "Architect",
        "start_date": date(2026, 7, 21),
        "end_date": date(2026, 7, 21),
    },
    {
        "id": 2,
        "project_id": 1,
        "title": "Setup FastAPI Server",
        "description": "Create SQLite base connection, SQLAlchemy models and define modular routers.",
        "priority": "high",
        "status": "in_progress",
        "assignee": "Backend Developer",
        "start_date": date(2026, 7, 21),
        "end_date": date(2026, 7, 22),
    },
    {
        "id": 3,
        "project_id": 1,
        "title": "Design Premium React Dashboard Layout",
        "description": "Implement Sidebar, Navbar, Stat cards and routing structure.",
        "priority": "high",
        "status": "in_progress",
        "assignee": "Frontend Developer",
        "start_date": date(2026, 7, 21),
        "end_date": date(2026, 7, 24),
    },
    {
        "id": 4,
        "project_id": 1,
        "title": "Setup Automated Tests",
        "description": "Configure compilation and server checks in dev commands.",
        "priority": "medium",
        "status": "todo",
        "assignee": "QA Lead",
        "start_date": date(2026, 7, 24),
        "end_date": date(2026, 7, 25),
    }
]

@router.get("", response_model=List[TaskResponse])
def get_tasks(project_id: Optional[int] = Query(None, description="Filter tasks by project ID")):
    """
    Get all tasks, optionally filtered by project_id.
    """
    if project_id is not None:
        return [task for task in MOCK_TASKS if task["project_id"] == project_id]
    return MOCK_TASKS

@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task: TaskCreate):
    """
    Create a new task.
    """
    new_task = {
        "id": len(MOCK_TASKS) + 1,
        "project_id": task.project_id,
        "title": task.title,
        "description": task.description,
        "priority": task.priority or "medium",
        "status": task.status or "todo",
        "assignee": task.assignee,
        "start_date": task.start_date,
        "end_date": task.end_date,
    }
    MOCK_TASKS.append(new_task)
    return new_task
