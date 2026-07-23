from fastapi import APIRouter, status, Depends
from datetime import datetime
from sqlalchemy.orm import Session
from backend.app.database.connection import get_db
from backend.app.schemas.chat import ChatQuestion, ChatHistoryResponse
from backend.app.services.project_analysis_service import answer_project_question
from backend.app.models.chat import ChatHistory

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("", response_model=ChatHistoryResponse, status_code=status.HTTP_201_CREATED)
def ask_ai_assistant(payload: ChatQuestion, db: Session = Depends(get_db)):
    """
    Ask the AI Assistant a question about the project.
    """
    ai_response_data = answer_project_question(db, payload.project_id, payload.question)
    ai_response = ai_response_data.get("answer", "Failed to analyze project data.")

    # Save to db
    db_chat = ChatHistory(
        project_id=payload.project_id,
        question=payload.question,
        response=ai_response
    )
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)

    return db_chat

