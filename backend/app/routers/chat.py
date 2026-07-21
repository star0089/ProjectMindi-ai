from fastapi import APIRouter, status
from datetime import datetime
from backend.app.schemas.chat import ChatQuestion, ChatHistoryResponse

router = APIRouter(prefix="/chat", tags=["chat"])

# Mock conversations database
MOCK_CHAT_HISTORY = [
    {
        "id": 1,
        "project_id": 1,
        "question": "What is the project status?",
        "response": "Hello! ProjectPilot AI setup is currently at 68% progress. Database structures are set up, and frontend scaffolding is completed. Tasks are advancing on track.",
        "timestamp": datetime(2026, 7, 21, 10, 50, 0)
    }
]

@router.post("", response_model=ChatHistoryResponse, status_code=status.HTTP_201_CREATED)
def ask_ai_assistant(payload: ChatQuestion):
    """
    Ask the AI Assistant a question about the project.
    """
    # Context-aware mock responses for rich demo experiences
    question_lower = payload.question.lower()
    if "risk" in question_lower:
        ai_response = "We have identified 2 active risks. The highest is 'API Rate Limits with Gemini API' which is mitigated by implementing local query caching."
    elif "scope" in question_lower or "creep" in question_lower or "drift" in question_lower:
        ai_response = "The scope is 95% aligned. Out of 5 key requirements, 4 are fully implemented. There is no scope creep detected at this moment."
    elif "timeline" in question_lower or "deadline" in question_lower or "milestone" in question_lower:
        ai_response = "The next major milestone is 'Backend Base & Models Setup', set to compile on 2026-07-24. We are currently 15% ahead of our original timelines."
    else:
        ai_response = f"I received your question: '{payload.question}'. I am ProjectPilot AI, your autonomous project manager assistant. In the next phase, I will analyze repository commits, issue cards, and risk logs to provide deep architectural advice!"

    new_chat = {
        "id": len(MOCK_CHAT_HISTORY) + 1,
        "project_id": payload.project_id,
        "question": payload.question,
        "response": ai_response,
        "timestamp": datetime.utcnow()
    }
    MOCK_CHAT_HISTORY.append(new_chat)
    return new_chat
