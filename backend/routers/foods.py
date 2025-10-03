from fastapi import APIRouter

router = APIRouter(
    prefix="/foods",
    tags=["foods"],
)

@router.get("/")
def get_foods():
    return {"message":"foods placeholder"}

