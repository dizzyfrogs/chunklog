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
    return crud.get_foods(db, user_id=current_user.id, skip=skip, limit=limit)


@router.get("/{food_id}", response_model=schemas.FoodRead)
def read_food(
    food_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    food = db.query(models.Food).filter(
        models.Food.id == food_id, models.Food.owner_id == current_user.id
    ).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")
    return food

@router.put("/{food_id}", response_model=schemas.FoodRead)
def update_food(
    food_id: int,
    food_update: schemas.FoodCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    food = db.query(models.Food).filter(
        models.Food.id == food_id, models.Food.owner_id == current_user.id
    ).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")

    for key, value in food_update.dict().items():
        setattr(food, key, value)

    db.commit()
    db.refresh(food)
    return food

@router.delete("/{food_id}")
def delete_food(
    food_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    food = db.query(models.Food).filter(
        models.Food.id == food_id, models.Food.owner_id == current_user.id
    ).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")

    db.delete(food)
    db.commit()
    return {"detail": "Food deleted"}
