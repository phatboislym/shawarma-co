"""
module for FastAPI app
"""

from fastapi import FastAPI
from routes.auth_routes import auth_router
from routes.order_routes import order_router
from routes.user_routes import user_router
from models.items import Item
from models.order import Order
from models.user import User

app = FastAPI()
app.include_router(auth_router)
app.include_router(order_router)
app.include_router(user_router)


@app.get("/")
def index() -> dict:
    message: dict = {"message": "Hello, world!"}
    return message
