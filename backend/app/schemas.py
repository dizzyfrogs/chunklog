from backend.app.models import ActivityLevel, Gender, GoalType
from pydantic import BaseModel, EmailStr, Field
from datetime import date
from typing import List, Optional

# User schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    date_of_birth: Optional[date] = None
    gender: Optional[Gender] = None
    height_cm: Optional[float] = None
    activity_level: Optional[ActivityLevel] = None

class UserRead(UserBase):
    id: int
    date_of_birth: Optional[date] = None
    gender: Optional[Gender] = None
    height_cm: Optional[float] = None
    activity_level: Optional[ActivityLevel] = None

    class Config:
        orm_mode = True

# Food schemas
class FoodBase(BaseModel):
    name: str
    calories: float
    protein: float = 0
    carbs: float = 0
    fat: float = 0

class FoodCreate(FoodBase):
    pass

class FoodRead(FoodBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True

# Log schemas
class FoodLogBase(BaseModel):
    log_date: date = Field(default_factory=date.today)
    servings: float = 1.0

class FoodLogCreate(FoodLogBase):
    food_id: int

class FoodLogRead(FoodLogBase):
    id: int
    user_id: int
    food_id: int
    food: FoodRead

    class Config:
        orm_mode = True


class WeightLogBase(BaseModel):
    log_date: date = Field(default_factory=date.today)
    weight: float

class WeightLogCreate(WeightLogBase):
    pass

class WeightLogRead(WeightLogBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True

# Goal schemas
class GoalBase(BaseModel):
    goal_type: GoalType
    target_weight: Optional[float] = None
    target_calories: Optional[float] = None

class GoalCalculationRequest(BaseModel):
    goal_type: GoalType
    current_weight_kg: float

class GoalCreate(GoalBase):
    pass

class GoalRead(GoalBase):
    user_id: int

    class Config:
        orm_mode = True