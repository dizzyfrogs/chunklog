from fastapi import FastAPI
from .database import engine
from .models import Base
from .routers import users, foods, foodlogs, weightlogs, goals, auth

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ChunkLog API")

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(foods.router)
app.include_router(foodlogs.router)
app.include_router(weightlogs.router)
app.include_router(goals.router)

@app.get("/")
def root():
    return {"message": "ChunkLog API running!"}
