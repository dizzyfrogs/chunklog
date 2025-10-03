from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, models
from ..database import get_db

router = APIRouter(
    prefix="/foodlogs",
    tags=["food_logs"],
)

@router.post("/", response_model=schemas.FoodLogRead)
def create_food_log(log: schemas.FoodLogCreate, user_id: int, db: Session = Depends(get_db)):
    # check food exists
    db_food = db.query(models.Food).filter(models.Food.id == log.food_id).first()
    if not db_food:
        raise HTTPException(status_code=404, detail="Food not found")
    return crud.log_food(db=db, log=log, user_id=user_id)

@router.get("/", response_model=List[schemas.FoodLogRead])
def read_food_logs(user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return (
        db.query(models.FoodLog)
        .filter(models.FoodLog.user_id == user_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
