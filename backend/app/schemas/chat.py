from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ChatHistoryBase(BaseModel):
    question: str = Field(..., min_length=1)
    response: str = Field(..., min_length=1)

class ChatHistoryCreate(ChatHistoryBase):
    project_id: int

class ChatHistoryResponse(ChatHistoryBase):
    id: int
    project_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class ChatQuestion(BaseModel):
    project_id: int
    question: str = Field(..., min_length=1)
