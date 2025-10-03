from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from .. import crud, schemas, models
from ..database import get_db
from ..core import security

router = APIRouter(
    prefix="/goals",
    tags=["goals"],
)

@router.post("/", response_model=schemas.GoalRead)
def set_user_goal(
    goal: schemas.GoalCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    return crud.create_or_update_user_goal(db=db, goal=goal, user_id=current_user.id)

@router.get("/", response_model=schemas.GoalRead)
def read_user_goal(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    goal = crud.get_user_goal(db, user_id=current_user.id)
    if goal is None:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal

@router.post("/calculate", response_model=schemas.GoalRead)
def calculate_and_set_goal(
    calculation_input: schemas.GoalCalculationRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    #Validation
    if not all([current_user.date_of_birth, current_user.gender, current_user.height_cm]):
        raise HTTPException(status_code=400, detail="User profile is incomplete. Please provide date of birth, gender, and height.")

    age = (date.today() - current_user.date_of_birth).days // 365
    weight_kg = calculation_input.current_weight_kg

    # BMR calculation (Mifflin-St Jeor)
    if current_user.gender.value == "male":
        bmr = (10 * weight_kg) + (6.25 * current_user.height_cm) - (5 * age) + 5
    else: # FEMALE
        bmr = (10 * weight_kg) + (6.25 * current_user.height_cm) - (5 * age) - 161

    # TDEE
    activity_multipliers = {
        models.ActivityLevel.SEDENTARY: 1.2,
        models.ActivityLevel.LIGHT: 1.375,
        models.ActivityLevel.MODERATE: 1.55,
        models.ActivityLevel.ACTIVE: 1.725,
        models.ActivityLevel.VERY_ACTIVE: 1.9,
    }
    tdee = bmr * activity_multipliers[current_user.activity_level]

    goal_type = calculation_input.goal_type
    if goal_type == models.GoalType.WEIGHT_LOSS:
        target_calories = tdee - 500
    elif goal_type == models.GoalType.MUSCLE_GROWTH:
        target_calories = tdee + 300
    else: # MAINTENANCE
        target_calories = tdee

    goal_to_create = schemas.GoalCreate(
        goal_type=calculation_input.goal_type,
        target_calories=round(target_calories)
    )
    
    return crud.create_or_update_user_goal(db, goal_to_create, user_id=current_user.id)