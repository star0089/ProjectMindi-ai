from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from backend.app.database.connection import get_db
from backend.app.services import search_service

router = APIRouter(prefix="/search", tags=["search"])

@router.get("")
def search(query: str = Query(..., min_length=2), db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    return search_service.global_search(db, query)
