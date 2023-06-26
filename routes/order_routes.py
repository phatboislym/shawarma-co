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
from routes.auth_routes import check_token
from schemas.order import OrderModel


order_router = APIRouter()
session = Session(bind=engine)


@order_router.get("/orders", status_code=status.HTTP_200_OK)
async def get_orders(current_user_id: str = Depends(check_token)):
    """
    get all orders (admin access required)

    args:

        current_user_id: str (from AuthJWT instance)

    Returns:

        List[Order]: list of orders
    """

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
async def create_order(order: OrderModel,
                       current_user_id: str = Depends(check_token)):
    """
    create a new order

    args:

        order (OrderModel): order details

        current_user_id: str (from AuthJWT instance)

    Returns:

        dict: created order details
    """

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


@ order_router.get("/orders/{order_id}", status_code=status.HTTP_201_CREATED)
async def get_order(order_id: UUID,
                    current_user_id: str = Depends(check_token)):
    """
    get order by ID (admin or order owner access required)

    args:

        order_id (UUID): ID of the order

        current_user_id: str (from AuthJWT instance)

    Returns:

        Order: order details
    """

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


@ order_router.put("/orders/{order_id}/update/",
                   status_code=status.HTTP_202_ACCEPTED)
async def update_order(order_id: UUID, order: OrderModel,
                       current_user_id: str = Depends(check_token)):
    """
    update an order (admin or order owner access required)

    args:

        order_id (UUID): ID of the order

        order (OrderModel): updated order details

        current_user_id: str (from AuthJWT instance)

    Returns:

        dict: updated order details
    """

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


@ order_router.patch("/orders/{order_id}/update/",
                     status_code=status.HTTP_202_ACCEPTED)
async def update_order_status(order_id: UUID, order: OrderModel,
                              current_user_id: str = Depends(check_token)):
    """
    update the status of an order (admin access required)

    args:

        order_id (UUID): ID of the order

        order (OrderModel): updated order details

        current_user_id: str (from AuthJWT instance)

    Returns:

        dict: updated order status
    """

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


@ order_router.delete("/orders/{order_id}/delete/",
                      status_code=status.HTTP_202_ACCEPTED)
async def delete_order(order_id: UUID,
                       current_user_id: str = Depends(check_token)):
    """
    delete an order (admin or order owner access required)

    args:

        order_id (UUID): ID of the order

        current_user_id: str (from AuthJWT instance)

    Returns:

        Order: deleted order details
    """

    db_order: Order = session.query(Order).filter(
        Order.id_ == order_id).first()
    if not db_order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
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
