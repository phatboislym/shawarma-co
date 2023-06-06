from fastapi import APIRouter


order_router = APIRouter()


@order_router.get("/order")
async def order() -> dict:
    message: dict = {"message": "orders"}
    return message
