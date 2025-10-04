from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from .. import crud, models
from ..database import get_db
from ..core import security

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    login_identifier = form_data.username.lower()

    # Try to find by email first, then username
    user = crud.get_user_by_email(db, login_identifier)
    if not user:
        user = db.query(models.User).filter(models.User.username == login_identifier).first()

    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    access_token = security.create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}