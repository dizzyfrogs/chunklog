from sqlalchemy.orm import Session
from . import models, schemas
from datetime import date
import time

# --- User CRUD ---
def create_user(db: Session, user: schemas.UserCreate, hashed_password: str):
    db_user = models.User(
        username=user.username.lower(),
        email=user.email.lower(),
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email.lower()).first()


# --- Food CRUD ---
def create_food(db: Session, food: schemas.FoodCreate, user_id: int):
    db_food = models.Food(**food.dict(), owner_id=user_id)
    db.add(db_food)
    db.commit()
    db.refresh(db_food)
    return db_food

def get_food(db: Session, food_id: int, user_id: int):
    return (
        db.query(models.Food)
        .filter(models.Food.id == food_id, models.Food.owner_id == user_id)
        .first()
    )

def get_foods(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return (
        db.query(models.Food)
        .filter(models.Food.owner_id == user_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


# --- FoodLog CRUD ---
def log_food(db: Session, log: schemas.FoodLogCreate, user_id: int):
    db_log = models.FoodLog(
        date=log.log_date,
        servings=log.servings,
        food_id=log.food_id,
        user_id=user_id,
        timestamp=int(time.time())
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log


def get_food_logs(db: Session, user_id: int, log_date: date, skip: int = 0, limit: int = 100):
    return (
        db.query(models.FoodLog)
        .filter(models.FoodLog.user_id == user_id, models.FoodLog.date == log_date)
        .offset(skip)
        .limit(limit)
        .all()
    )


def delete_food_log(db: Session, log_id: int, user_id: int):
    db_log = db.query(models.FoodLog).filter(
        models.FoodLog.id == log_id,
        models.FoodLog.user_id == user_id
    ).first()
    if db_log:
        db.delete(db_log)
        db.commit()
        return True
    return False

# --- WeightLog CRUD ---
def log_weight(db: Session, log: schemas.WeightLogCreate, user_id: int):
    db_log = models.WeightLog(
        date=log.log_date,
        weight=log.weight,
        user_id=user_id,
        timestamp=int(time.time())
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log


def get_weight_logs(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return (
        db.query(models.WeightLog)
        .filter(models.WeightLog.user_id == user_id)
        .order_by(models.WeightLog.date.desc(), models.WeightLog.timestamp.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def delete_weight_log(db: Session, log_id: int, user_id: int):
    db_log = db.query(models.WeightLog).filter(
        models.WeightLog.id == log_id,
        models.WeightLog.user_id == user_id
    ).first()
    if db_log:
        db.delete(db_log)
        db.commit()
        return True
    return False

# --- Goal CRUD ---
def create_or_update_user_goal(db: Session, goal: schemas.GoalCreate, user_id: int):
    db_goal = db.query(models.Goal).filter(models.Goal.user_id == user_id).first()
    if db_goal:
        # existing goal
        for key, value in goal.dict().items():
            setattr(db_goal, key, value)
    else:
        # new goal
        db_goal = models.Goal(**goal.dict(), user_id=user_id)
        db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

def get_user_goal(db: Session, user_id: int):
    return db.query(models.Goal).filter(models.Goal.user_id == user_id).first()