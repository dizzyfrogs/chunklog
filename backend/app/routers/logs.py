from fastapi import APIRouter

router = APIRouter(
    prefix = "/logs",
    tags=["logs"],
)

@router.get("/")
def get_logs():
    return {"message":"logs placeholder"}
