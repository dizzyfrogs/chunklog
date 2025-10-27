from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from .. import crud, schemas, models
from ..database import get_db
from ..core.security import get_current_user

router = APIRouter(
    prefix="/foodlogs",
    tags=["food_logs"],
)

@router.post("/", response_model=schemas.FoodLogRead)
def create_food_log(
    log: schemas.FoodLogCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Handle external food (from USDA database)
    if log.food_id is None and log.external_food is not None:
        # Create temporary food entry for this log
        db_food = models.Food(
            name=log.external_food.name,
            calories=log.external_food.calories,
            protein=log.external_food.protein,
            carbs=log.external_food.carbs,
            fat=log.external_food.fat,
            owner_id=current_user.id
        )
        db.add(db_food)
        db.commit()
        db.refresh(db_food)
        log.food_id = db_food.id
    
    # Validate food exists
    if log.food_id is None:
        raise HTTPException(status_code=400, detail="Either food_id or external_food must be provided")
    
    db_food = db.query(models.Food).filter(models.Food.id == log.food_id).first()
    if not db_food:
        raise HTTPException(status_code=404, detail="Food not found")
    
    return crud.log_food(db=db, log=log, user_id=current_user.id)

@router.get("/", response_model=List[schemas.FoodLogRead])
def read_food_logs(
    log_date: date = date.today(),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.get_food_logs(db, user_id=current_user.id, log_date=log_date, skip=skip, limit=limit)

@router.delete("/{log_id}")
def delete_food_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if crud.delete_food_log(db, log_id=log_id, user_id=current_user.id):
        return {"message": "Food log deleted successfully"}
    return {"message": "Food log not found"}