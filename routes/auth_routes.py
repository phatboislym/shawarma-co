from fastapi import APIRouter


auth_router = APIRouter()


@auth_router.get("/auth")
async def auth() -> dict:
    message: dict = {"message": "base authentication endpoint"}
    return message


@auth_router.get("/auth/register")
async def register() -> dict:
    message: dict = {"message": "registration endpoint"}
    return message


@auth_router.get("/auth/login")
async def login() -> dict:
    message: dict = {"message": "login endpoint"}
    return message
