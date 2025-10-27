from backend.app.models import ActivityLevel, Gender, GoalType
from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime
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

class FoodSearchResult(BaseModel):
    id: Optional[int] = None
    name: str
    calories: float
    protein: float
    carbs: float
    fat: float
    is_from_library: bool
    external_id: Optional[str] = None

# Log schemas
class FoodLogBase(BaseModel):
    log_date: date = Field(default_factory=date.today)
    servings: float = 1.0

class FoodLogCreate(FoodLogBase):
    food_id: Optional[int] = None
    external_food: Optional[FoodCreate] = None

class FoodLogRead(FoodLogBase):
    id: int
    user_id: int
    food_id: int
    food: FoodRead
    timestamp: int

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
    timestamp: int

    class Config:
        orm_mode = True

# Goal schemas
class GoalBase(BaseModel):
    goal_type: Optional[GoalType] = None
    target_weight: Optional[float] = None
    target_calories: Optional[float] = None
    target_protein: Optional[float] = None
    target_carbs: Optional[float] = None
    target_fat: Optional[float] = None

class GoalCalculationRequest(BaseModel):
    goal_type: GoalType

class GoalCreate(GoalBase):
    pass

class GoalRead(GoalBase):
    user_id: int

    class Config:
        orm_mode = True