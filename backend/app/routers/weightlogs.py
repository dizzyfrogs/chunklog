from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, models
from ..database import get_db
from ..core import security

router = APIRouter(
    prefix="/weightlogs",
    tags=["weight_logs"],
)

@router.post("/", response_model=schemas.WeightLogRead)
def create_weight_log(
    log: schemas.WeightLogCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    return crud.log_weight(db=db, log=log, user_id=current_user.id)

@router.get("/", response_model=List[schemas.WeightLogRead])
def read_weight_logs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    return crud.get_weight_logs(db, user_id=current_user.id, skip=skip, limit=limit)
