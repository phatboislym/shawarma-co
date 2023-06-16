from fastapi import APIRouter


order_router = APIRouter()


@order_router.get("/orders")
async def order() -> dict:
    message: dict = {"message": "orders"}
    return message
