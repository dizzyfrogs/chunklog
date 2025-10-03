from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, models
from ..database import get_db
from ..core import security

router = APIRouter(
    prefix="/foods",
    tags=["foods"],
)

@router.post("/", response_model=schemas.FoodRead)
def create_food(
    food: schemas.FoodCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    return crud.create_food(db=db, food=food, user_id=current_user.id)

@router.get("/", response_model=List[schemas.FoodRead])
def read_foods(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    foods = db.query(models.Food).filter(models.Food.owner_id == current_user.id)
    return foods.offset(skip).limit(limit).all()
