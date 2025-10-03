from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, models
from ..database import get_db
from ..core import security

router = APIRouter(
    prefix="/foodlogs",
    tags=["food_logs"],
)

@router.post("/", response_model=schemas.FoodLogRead)
def create_food_log(
    log: schemas.FoodLogCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    db_food = db.query(models.Food).filter(models.Food.id == log.food_id).first()
    if not db_food:
        raise HTTPException(status_code=404, detail="Food not found")
    return crud.log_food(db=db, log=log, user_id=current_user.id)

@router.get("/", response_model=List[schemas.FoodLogRead])
def read_food_logs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    return (
        db.query(models.FoodLog)
        .filter(models.FoodLog.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .all()
    )
