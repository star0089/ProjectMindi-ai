from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app.database.connection import get_db
from backend.app.schemas.team import TeamMemberCreate, TeamMemberResponse
from backend.app.services import team_service

router = APIRouter(prefix="/team", tags=["team"])

@router.get("", response_model=List[TeamMemberResponse])
def get_team(db: Session = Depends(get_db)):
    return team_service.get_team_members(db)

@router.post("", response_model=TeamMemberResponse)
def create_team_member(member: TeamMemberCreate, db: Session = Depends(get_db)):
    return team_service.create_team_member(db, member)
