from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
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