from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db

router = APIRouter(
    prefix="/foods",
    tags=["foods"],
)

@router.post("/", response_model=schemas.FoodRead)
def create_food(food: schemas.FoodCreate, user_id: int, db: Session = Depends(get_db)):
    return crud.create_food(db=db, food=food, user_id=user_id)

@router.get("/", response_model=List[schemas.FoodRead])
def read_foods(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_foods(db, skip=skip, limit=limit)
