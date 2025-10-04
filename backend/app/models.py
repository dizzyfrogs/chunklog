from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, DateTime, Enum
from sqlalchemy.orm import relationship, declarative_base
import datetime
import enum

Base = declarative_base()

class Gender(enum.Enum):
    MALE = "male"
    FEMALE = "female"

class GoalType(enum.Enum):
    WEIGHT_LOSS = "weight_loss"
    MAINTENANCE = "maintenance"
    MUSCLE_GROWTH = "muscle_growth"

class ActivityLevel(enum.Enum):
    SEDENTARY = "sedentary" # little or no exercise
    LIGHT = "light" # 1-3 days/week
    MODERATE = "moderate" # 3-5 days/week
    ACTIVE = "active" # 6-7 days/week
    VERY_ACTIVE = "very_active" # very hard exercise & physical job

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    date_of_birth = Column(Date, nullable=True)
    gender = Column(Enum(Gender), nullable=True)
    height_cm = Column(Float, nullable=True)
    activity_level = Column(Enum(ActivityLevel), nullable=True, default=ActivityLevel.SEDENTARY)

    foods = relationship("Food", back_populates="owner", cascade="all, delete-orphan")
    food_logs = relationship("FoodLog", back_populates="user", cascade="all, delete-orphan")
    weight_logs = relationship("WeightLog", back_populates="user", cascade="all, delete-orphan")

    goal = relationship("Goal", uselist=False, back_populates="user", cascade="all, delete-orphan")

class Food(Base):
    __tablename__ = "foods"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    calories = Column(Float, nullable=False)
    protein = Column(Float, default=0)
    carbs = Column(Float, default=0)
    fat = Column(Float, default=0)

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="foods")

    logs = relationship("FoodLog", back_populates="food", cascade="all, delete-orphan")


class FoodLog(Base):
    __tablename__ = "food_logs"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, default=datetime.date.today)
    timestamp = Column(Integer)
    servings = Column(Float, default=1.0)

    user_id = Column(Integer, ForeignKey("users.id"))
    food_id = Column(Integer, ForeignKey("foods.id"))

    user = relationship("User", back_populates="food_logs")
    food = relationship("Food", back_populates="logs")


class WeightLog(Base):
    __tablename__ = "weight_logs"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, default=datetime.date.today)
    timestamp = Column(Integer)
    weight = Column(Float, nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="weight_logs")

class Goal(Base):
    __tablename__ = "goals"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    goal_type = Column(Enum(GoalType), nullable=False)
    target_weight = Column(Float, nullable=True)
    target_calories = Column(Float, nullable=True)
    target_protein = Column(Float, nullable=True)
    target_carbs = Column(Float, nullable=True)
    target_fat = Column(Float, nullable=True)

    user = relationship("User", back_populates="goal")