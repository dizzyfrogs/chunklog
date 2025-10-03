from pydantic import BaseModel
from datetime import date
from typing import List, Optional

# User schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int

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
    date: Optional[date] = None
    servings: float = 1.0

class FoodLogCreate(FoodLogBase):
    food_id: int

class FoodLogRead(FoodLogBase):
    id: int
    user_id: int
    food_id: int

    class Config:
        orm_mode = True


class WeightLogBase(BaseModel):
    date: Optional[date] = None
    weight: float

class WeightLogCreate(WeightLogBase):
    pass

class WeightLogRead(WeightLogBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True