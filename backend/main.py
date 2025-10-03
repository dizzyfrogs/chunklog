from fastapi import FastAPI
from .routers import users, foods, logs

app = FastAPI(title="ChunkLog API")

app.include_router(users.router)
app.include_router(foods.router)
app.include_router(logs.router)

@app.get("/")
def root():
    return {"message":"Okay!"}
