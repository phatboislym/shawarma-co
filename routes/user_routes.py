"""
module for user routes
"""
from fastapi import APIRouter


user_router = APIRouter()


@user_router.get("/users")
async def users() -> dict:
    message: dict = {"message": "Get all users"}
    return message


@user_router.get("/users/{user_id}")
async def get_user(user_id: int) -> dict:
    message: dict = {"message": f"Get user with ID: {user_id}"}
    return message


@user_router.get("/user/orders")
async def user() -> dict:
    message: dict = {"message": "user orders"}
    return message
