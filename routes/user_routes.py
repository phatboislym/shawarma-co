"""
module for user routes
"""
from db import engine, Session
from fastapi import APIRouter, Depends, status
from fastapi_another_jwt_auth import AuthJWT
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import HTTPException
from models.order import Order
from models.user import User


user_router = APIRouter()
session = Session(bind=engine)


@user_router.get("/users", status_code=status.HTTP_200_OK)
async def users(Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_required()
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='invalid token')
    current_user_id = Authorize.get_raw_jwt()['sub']
    db_user: User = session.query(User).filter(
        User.username == current_user_id).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail='user not found')
    if db_user.is_staff:
        db_users = session.query(User).all
        if not db_users:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail='no users found')
        return db_users
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='admin access required')


@user_router.get("/users/{user_id}", status_code=status.HTTP_200_OK)
async def get_user(user_id: int, Authorize: AuthJWT = Depends()) -> dict:
    try:
        Authorize.jwt_required()
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='invalid token')
    db_user: User = session.query(User).filter(User.id_ == user_id).first()
    current_user_id = Authorize.get_raw_jwt()['sub']
    current_user: User = session.query(User).filter(
        User.username == current_user_id).first()
    admin: bool = current_user.is_staff
    if not db_user and not admin:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail='user not found')
    response: dict = {'id_': db_user.id_, 'email': db_user.email,
                      'is_active': db_user.is_active,
                      'is_staff': db_user.is_staff, 'name': db_user.name,
                      'username': db_user.username}
    return jsonable_encoder(response)


@user_router.get("/users/{user}/orders}", status_code=status.HTTP_200_OK)
async def get_orders(user_id: int, Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_required()
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='invalid token')
    current_user_id = Authorize.get_raw_jwt()['sub']
    db_user: User = session.query(User).filter(
        User.username == current_user_id).first()
    order_user = session.query(User).filter(User.id_ == user_id).first()
    if not order_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    if db_user.is_staff or order_user:
        user_orders = session.query(Order).filter(
            Order.user_id == user_id).all()
        if user_orders:
            return user_orders
        else:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='admin or user access required')


@user_router.get("/users/user/{order_id}", status_code=status.HTTP_200_OK)
async def get_order(order_id: int, Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_required()
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='invalid token')
    current_user_id = Authorize.get_raw_jwt()['sub']
    db_user: User = session.query(User).filter(
        User.username == current_user_id).first()
    db_order = session.query(Order).filter(Order.id_ == order_id).first()
    if not db_order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    if db_user.id_ == db_order.user_id:
        return db_order
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='user access required')
