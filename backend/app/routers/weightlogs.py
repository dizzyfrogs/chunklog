from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db

router = APIRouter(
    prefix="/weightlogs",
    tags=["weight_logs"],
)

@router.post("/", response_model=schemas.WeightLogRead)
def create_weight_log(log: schemas.WeightLogCreate, user_id: int, db: Session = Depends(get_db)):
    return crud.log_weight(db=db, log=log, user_id=user_id)

@router.get("/", response_model=List[schemas.WeightLogRead])
def read_weight_logs(user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_weight_logs(db, user_id=user_id, skip=skip, limit=limit)
