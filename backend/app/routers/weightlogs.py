from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from .. import crud, schemas, models
from ..database import get_db
from ..core import security
from .goals import calculate_and_set_goal

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
    db_log = crud.log_weight(db=db, log=log, user_id=current_user.id)
    current_goal = crud.get_user_goal(db, user_id=current_user.id)
    
    if current_goal and current_goal.goal_type:
        calculation_input = schemas.GoalCalculationRequest(
            goal_type=current_goal.goal_type,
            current_weight_kg=log.weight
        )
        calculate_and_set_goal(calculation_input, db, current_user)
    return db_log

@router.get("/", response_model=List[schemas.WeightLogRead])
def read_weight_logs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    return crud.get_weight_logs(db, user_id=current_user.id, skip=skip, limit=limit)