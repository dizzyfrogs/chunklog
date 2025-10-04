from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas, models
from ..database import get_db
from ..core import security
from .goals import calculate_and_set_goal

router = APIRouter(
    prefix="/users",
    tags=["users"],
)

@router.post("/", response_model=schemas.UserRead)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    db_user = db.query(models.User).filter(models.User.username == user.username.lower()).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    # Hash password before saving
    hashed_password = security.get_password_hash(user.password)

    return crud.create_user(db=db, user=user, hashed_password=hashed_password)

@router.get("/me", response_model=schemas.UserRead)
def read_current_user(current_user: models.User = Depends(security.get_current_user)):
    return current_user

@router.put("/me", response_model=schemas.UserRead)
def update_current_user(
    user_update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
):
    user_data = user_update.dict(exclude_unset=True)
    for key, value in user_data.items():
        setattr(current_user, key, value)
    
    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    current_goal = crud.get_user_goal(db, user_id=current_user.id)
    if current_goal and current_goal.goal_type:
        latest_weight_log = db.query(models.WeightLog).filter(models.WeightLog.user_id == current_user.id).order_by(models.WeightLog.date.desc()).first()
        
        if latest_weight_log:
            calculation_input = schemas.GoalCalculationRequest(
                goal_type=current_goal.goal_type,
                current_weight_kg=latest_weight_log.weight
            )
            calculate_and_set_goal(calculation_input, db, current_user)

    db.refresh(current_user)
    return current_user