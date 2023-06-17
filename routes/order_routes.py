"""
module for order routes
"""
from starlette.status import HTTP_404_NOT_FOUND
from db import engine, Session
from fastapi import APIRouter, Depends, status
from fastapi_another_jwt_auth import AuthJWT
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import HTTPException
from models.order import Order
from models.user import User
from schemas.order import OrderModel


order_router = APIRouter()
session = Session(bind=engine)


@order_router.get("/orders", status_code=status.HTTP_200_OK)
async def order(Authorize: AuthJWT = Depends()) -> list:
    try:
        Authorize.jwt_required()
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='invalid token')

    db_orders: list = session.query(Order).all()
    if not db_orders:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND)
    return db_orders


@order_router.post("/orders/order", status_code=status.HTTP_201_CREATED)
async def create_order(order: OrderModel, Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_required()
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='invalid token')

    current_user_id = Authorize.get_raw_jwt()['sub']
    db_user = session.query(User).filter(
        User.username == current_user_id).first()

    new_order: Order = Order(quantity=order.quantity, size=order.size,
                             spicyness=order.spicyness, status=order.status)
    new_order.user_id = db_user.id_

    session.add(new_order)
    session.commit()

    response: dict = {'id': new_order.id_, 'size': new_order.size,
                      'quantity': new_order.quantity,
                      'spicyness': new_order.spicyness,
                      'status': new_order.status}
    return jsonable_encoder(response)


@order_router.get("/orders/order", status_code=status.HTTP_200_OK)
async def get_order(Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_required()
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='invalid token')
    db_order = session.query(Order).filter(Order.id_ == order.id_).first()

    if not db_order:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND)
    return db_order
