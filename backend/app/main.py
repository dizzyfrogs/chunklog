from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from .models import Base
import os
from dotenv import load_dotenv
from .routers import users, foods, foodlogs, weightlogs, goals, auth

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ChunkLog API")

allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "")
origins = allowed_origins_str.split(",") if allowed_origins_str else []

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(foods.router)
app.include_router(foodlogs.router)
app.include_router(weightlogs.router)
app.include_router(goals.router)

@app.get("/")
def root():
    return {"message": "ChunkLog API running!"}
