from fastapi import APIRouter


auth_router = APIRouter()


@auth_router.get("/auth")
async def register() -> dict:
    message: dict = {"message": "auth route"}
    return message
