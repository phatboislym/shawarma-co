"""
module for order routes
"""
from db import engine, Session
from fastapi import APIRouter, Depends, status
from fastapi_another_jwt_auth import AuthJWT
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import HTTPException
from models.order import Order
from models.user import User
from schemas.order import OrderModel
from typing import List


order_router = APIRouter()
session = Session(bind=engine)


@order_router.get("/orders", status_code=status.HTTP_200_OK)
async def get_orders(Authorize: AuthJWT = Depends()):

    try:
        Authorize.jwt_required()
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='invalid token')

    current_user_id = Authorize.get_raw_jwt()['sub']
    db_user: User = session.query(User).filter(
        User.username == current_user_id).first()
    if db_user.is_staff:
        db_orders = session.query(Order).all()
        if not db_orders:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        return db_orders
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail='admin access required')


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


@order_router.get("/orders/{order_id}", status_code=status.HTTP_200_OK)
async def get_order(order_id: int, Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_required()
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='invalid token')

    current_user_id = Authorize.get_raw_jwt()['sub']
    db_user: User = session.query(User).filter(
        User.username == current_user_id).first()
    if db_user.is_staff:
        db_order = session.query(Order).filter(Order.id_ == order_id).first()
        if not db_order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail='order not found')
        if db_order.user_id == db_user.id_:
            return db_order
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail='admin access required')


@order_router.put("/orders/order/update/{order_id}/",
                  status_code=status.HTTP_202_ACCEPTED)
async def update_order(order_id: int, order: OrderModel,
                       Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_required()
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='invalid token')

    current_user_id = Authorize.get_raw_jwt()['sub']
    db_user: User = session.query(User).filter(
        User.username == current_user_id).first()
    try:
        db_order = session.query(Order).filter(Order.id_ == order_id).first()
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    order_user: User = session.query(User).filter(
        User.id_ == db_order.user_id).first()
    is_order_user: bool = db_order.user_id == order_user.id_
    if db_user.is_staff or is_order_user:
        if order.quantity:
            db_order.quantity = order.quantity
        if order.size:
            db_order.size = order.size.upper()
        if order.spicyness:
            db_order.spicyness = order.spicyness.upper()
        session.commit()
        response = {"id": db_order.id_, "quantity": db_order.quantity,
                    "size": db_order.size,
                    "status": db_order.status}
        return jsonable_encoder(response)
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail='admin or user access required')


@order_router.patch("/orders/order/update/{order_id}/",
                    status_code=status.HTTP_202_ACCEPTED)
async def update_order_status(order_id: int, order: OrderModel,
                              Authorize: AuthJWT = Depends()):

    try:
        Authorize.jwt_required()
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='invalid token')

    current_user_id = Authorize.get_raw_jwt()['sub']
    db_user: User = session.query(User).filter(
        User.username == current_user_id).first()
    if db_user.is_staff:
        db_order: Order = session.query(Order).filter(
            Order.id_ == order_id).first()
        if order.status:
            db_order.status = order.status
            session.commit()
            response: dict = {"status": db_order.status}
            return jsonable_encoder(response)
        if not db_order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail='admin access required')


@order_router.delete("/orders/order/delete/{order_id}",
                     status_code=status.HTTP_202_ACCEPTED)
async def delete_order(order_id: int, Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_required()
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='invalid token')
    db_order: Order = session.query(Order).filter(
        Order.id_ == order_id).first()
    if not db_order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    current_user_id = Authorize.get_raw_jwt()['sub']
    db_user: User = session.query(User).filter(
        User.username == current_user_id).first()
    order_user: User = session.query(User).filter(
        User.username == current_user_id).first()
    is_order_user: bool = db_user.id_ == order_user.id_
    if db_user.is_staff or is_order_user:
        session.delete(db_order)
        session.commit()
        return db_order
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail='admin or user access required')
