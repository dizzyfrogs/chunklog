from fastapi import FastAPI
from .database import Base, engine
from .routers import users, foods, logs

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ChunkLog API")

app.include_router(users.router)
app.include_router(foods.router)
app.include_router(logs.router)

@app.get("/")
def root():
    return {"message":"Okay!"}
