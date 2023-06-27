"""
module for user routes
"""
from fastapi import APIRouter, Depends, status
from fastapi_another_jwt_auth import AuthJWT
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import HTTPException
from uuid import UUID


from db import engine, Session
from models.order import Order
from models.user import User
from routes.auth_routes import check_token


user_router = APIRouter()
session = Session(bind=engine)


@user_router.get("/users", status_code=status.HTTP_200_OK)
async def users(current_user_id: str = Depends(check_token)):
    """
    get all users endpoint (admin access required)

    args:

        current_user_id: str (from AuthJWT instance)

    Returns:

        List[User]: list of user details
    """

    try:
        db_user: User = session.query(User).filter(
            User.username == current_user_id).first()
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail='user not found')
    if db_user.is_staff:
        db_users = session.query(User).all()
        if not db_users:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail='no users found')
        return db_users
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='admin access required')


@user_router.get("/users/{user_id}", status_code=status.HTTP_200_OK)
async def get_user(user_id: UUID,
                   current_user_id: str = Depends(check_token)):
    """
    get user details endpoint (admin or order owner access required)

    args:

        user_id (UUID): user ID

        current_user_id: str (from AuthJWT instance)

    Returns:

        dict: user details
    """

    db_user: User = session.query(User).filter(User.id_ == user_id).first()
    current_user: User = session.query(User).filter(
        User.username == current_user_id).first()
    admin: bool = current_user.is_staff
    if not db_user and not admin:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail='user not found')
    response: dict = {'id_': db_user.id_, 'email': db_user.email,
                      'is_active': db_user.is_active,
                      'is_staff': db_user.is_staff, 'name': db_user.name,
                      'username': db_user.username,
                      'created_at': db_user.created_at}
    return jsonable_encoder(response)


@user_router.get("/users/{user_id}/orders/", status_code=status.HTTP_200_OK)
async def get_orders(user_id: UUID,
                     current_user_id: str = Depends(check_token)):
    """
    get orders for a user endpoint (admin or order owner access required)

    args:

        user_id (UUID): user ID

        current_user_id: str (from AuthJWT instance)

    Returns:

        List[Order]: list of user orders
    """

    db_user: User = session.query(User).filter(
        User.username == current_user_id).first()
    try:
        order_user = session.query(User).filter(User.id_ == user_id).first()
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail='user not found')
    if not order_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail='admin or user access required')
    if db_user.is_staff or order_user:
        user_orders = order_user.orders
        if user_orders:
            return user_orders
        else:
            return []
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='admin or user access required')


@user_router.get("/users/user/{order_id}", status_code=status.HTTP_200_OK)
async def get_order(order_id: UUID,
                    current_user_id: str = Depends(check_token)):
    """
    get order details endpoint (admin or order owner access required)

    args:
        order_id (UUID): order ID

        current_user_id: str (from AuthJWT instance)

    Returns:

        Order: order details
    """

    db_user: User = session.query(User).filter(
        User.username == current_user_id).first()
    try:
        db_order: Order = session.query(Order).filter(
            Order.id_ == order_id).first()
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail='order not found')
    if db_user.is_staff or db_user.id_ == db_order.user_id:
        return db_order
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='admin or user access required')


@user_router.patch("/users/{user_id}/", status_code=status.HTTP_202_ACCEPTED)
async def make_admin(user_id: UUID,
                     current_user_id: str = Depends(check_token)):
    """
    add superuser permission to an account (admin access required)

    args:

        user_id (UUID): user ID

        current_user_id: str (from AuthJWT instance)

    Returns:

        response: str, confirmation message
    """

    db_user: User = session.query(User).filter(
        User.username == current_user_id).first()
    try:
        civilian: User = session.query(User).filter(
            User.id_ == user_id).first()
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail='user not found')
    if db_user.is_staff:
        if civilian.is_staff == True:
            response: str = f'user {civilian.username} is already a superuser'
            return response
        else:
            civilian.is_staff = True
            try:
                session.commit()
                response: str = f'user {civilian.username} is now a superuser'
                return response
            except Exception:
                session.rollback()
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                    detail='failed to elevate user')
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='admin or user access required')
