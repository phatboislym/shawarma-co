"""
module for order routes
"""
from datetime import datetime
from fastapi import APIRouter, Depends, status
from fastapi_another_jwt_auth import AuthJWT
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session
from uuid import UUID


from db import engine, Session
from models.order import Order
from models.user import User
from schemas.order import OrderModel


order_router = APIRouter()
session = Session(bind=engine)


@order_router.get("/orders", status_code=status.HTTP_200_OK)
async def get_orders(Authorize: AuthJWT = Depends()):
    """
    get all orders (admin access required)

    args:

        Authorize (AuthJWT, optional): AuthJWT instance. defaults to Depends()

    Returns:

        List[Order]: list of orders
    """

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
            return []
        return db_orders
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail='admin access required')


@order_router.post("/orders/order", status_code=status.HTTP_201_CREATED)
async def create_order(order: OrderModel, Authorize: AuthJWT = Depends()):
    """
    create a new order

    args:

        order (OrderModel): order details

        Authorize (AuthJWT, optional): AuthJWT instance. defaults to Depends()

    Returns:

        dict: created order details
    """

    try:
        Authorize.jwt_required()
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='invalid token')

    current_user_id = Authorize.get_raw_jwt()['sub']
    db_user = session.query(User).filter(
        User.username == current_user_id).first()

    new_order: Order = Order(quantity=order.quantity, size=order.size.upper(),
                             spiciness=order.spiciness.upper(),
                             status=order.status.upper(),
                             created_at=datetime.utcnow(),
                             updated_at=datetime.utcnow())
    new_order.user_id = db_user.id_

    try:
        session.add(new_order)
        session.commit()
    except Exception:
        session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail='failed to create order')

    response: dict = {'id': new_order.id_, 'size': new_order.size,
                      'quantity': new_order.quantity,
                      'spiciness': new_order.spiciness,
                      'status': new_order.status,
                      'created_at': new_order.created_at,
                      'updated_at': new_order.updated_at}
    return jsonable_encoder(response)


@order_router.get("/orders/{order_id}", status_code=status.HTTP_201_CREATED)
async def get_order(order_id: UUID, Authorize: AuthJWT = Depends()):
    """
    get order by ID (admin or order owner access required)

    args:

        order_id (UUID): ID of the order

        Authorize (AuthJWT, optional): AuthJWT instance. defaults to Depends()

    Returns:

        Order: order details
    """

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


@order_router.put("/orders/{order_id}/update/",
                  status_code=status.HTTP_202_ACCEPTED)
async def update_order(order_id: UUID, order: OrderModel,
                       Authorize: AuthJWT = Depends()):
    """
    update an order (admin or order owner access required)

    args:

        order_id (UUID): ID of the order

        order (OrderModel): updated order details

        Authorize (AuthJWT, optional): AuthJWT instance. defaults to Depends()

    Returns:

        dict: updated order details
    """

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
        if order.spiciness:
            db_order.spiciness = order.spiciness.upper()
        db_order.updated_at = datetime.utcnow()

        try:
            session.commit()
        except Exception:
            session.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                detail='failed to update order')
        response = {"id": db_order.id_, "quantity": db_order.quantity,
                    "size": db_order.size,
                    "spiciness": db_order.spiciness,
                    "status": db_order.status}
        return jsonable_encoder(response)
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail='admin or user access required')


@order_router.patch("/orders/{order_id}/update/",
                    status_code=status.HTTP_202_ACCEPTED)
async def update_order_status(order_id: UUID, order: OrderModel,
                              Authorize: AuthJWT = Depends()):
    """
    update the status of an order (admin access required)

    args:

        order_id (UUID): ID of the order

        order (OrderModel): updated order details

        Authorize (AuthJWT, optional): AuthJWT instance. defaults to Depends()

    Returns:

        dict: updated order status
    """

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
            db_order.quantity = db_order.quantity
            db_order.size = db_order.size
            db_order.spiciness = db_order.spiciness
            db_order.status = order.status.upper()
            session.commit()
            response: dict = {"status": db_order.status}
            return jsonable_encoder(response)
        if not db_order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail='admin access required')


@order_router.delete("/orders/{order_id}/delete/",
                     status_code=status.HTTP_202_ACCEPTED)
async def delete_order(order_id: UUID, Authorize: AuthJWT = Depends()):
    """
    delete an order (admin or order owner access required)

    args:

        order_id (UUID): ID of the order
        Authorize (AuthJWT, optional): AuthJWT instance. defaults to Depends()

    Returns:

        Order: deleted order details
    """

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
        try:
            session.delete(db_order)
            session.commit()
        except Exception:
            session.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                detail='failed to delete order')
        response: str = f'order {order_id} deleted'
        return response
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail='admin or user access required')
