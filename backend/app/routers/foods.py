from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, models
from ..database import get_db
from ..core import security
from ..services.usda_api import search_usda_foods

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

@router.get("/search", response_model=List[schemas.FoodSearchResult])
async def search_foods(
    q: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    """
    Search for foods in USDA database and user's library.
    Returns USDA results first, followed by library results.
    """
    if not q or len(q.strip()) < 2:
        return []
    
    results = []
    
    # Search USDA database
    try:
        usda_foods = await search_usda_foods(q.strip(), page_size=5)
        for usda_food in usda_foods:
            results.append(schemas.FoodSearchResult(
                id=None,
                name=usda_food.name,
                calories=usda_food.calories,
                protein=usda_food.protein,
                carbs=usda_food.carbs,
                fat=usda_food.fat,
                is_from_library=False,
                external_id=usda_food.external_id
            ))
    except Exception as e:
        print(f"Error searching USDA database: {e}")
    
    # Search user's library
    library_foods = crud.get_foods(db, user_id=current_user.id, search_term=q.strip())
    for food in library_foods:
        results.append(schemas.FoodSearchResult(
            id=food.id,
            name=food.name,
            calories=food.calories,
            protein=food.protein,
            carbs=food.carbs,
            fat=food.fat,
            is_from_library=True,
            external_id=None
        ))
    
    return results

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
