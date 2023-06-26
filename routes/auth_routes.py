"""
module for auth routes
"""
from datetime import datetime
from fastapi import APIRouter, Depends, status
from fastapi_another_jwt_auth import AuthJWT
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import HTTPException
from werkzeug.security import check_password_hash, generate_password_hash


from db import engine, Session
from models.user import User
from schemas.signup import SignUp
from schemas.login import Login

auth_router = APIRouter()
session = Session(bind=engine)


def check_token(Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_required()
        current_user_id = Authorize.get_raw_jwt()['sub']
        return current_user_id
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail='invalid token')


@auth_router.get("/auth")
async def auth(Authorize: AuthJWT = Depends(check_token)) -> dict:
    """
    base authentication endpoint

    args:

        Authorize (AuthJWT, optional): AuthJWT instance

    Returns:

        dict: Response message
    """

    message: dict = {"message": "base authentication endpoint"}
    return message


@auth_router.post("/auth/register", status_code=status.HTTP_201_CREATED)
async def register(user: SignUp):
    """
    user registration endpoint

    args:

        user (SignUp): user signup details

    Returns:

        User: created user details
    """

    db_email = session.query(User).filter(User.email == user.email).first()
    if db_email:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                             detail='user with that email already exists')

    db_username = session.query(User).filter(
        User.username == user.username).first()
    if db_username:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                             detail='user with that username already exists')

    new_user: User = User(email=user.email, is_active=user.is_active,
                          is_staff=user.is_staff, name=user.name,
                          password=generate_password_hash(user.password),
                          username=user.username,
                          created_at=datetime.utcnow(),
                          updated_at=datetime.utcnow())

    try:
        session.add(new_user)
        session.commit()
    except Exception:
        session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail='failed to create order')

    response: str = f'user {new_user.username} created'
    return response


@auth_router.post("/auth/login", status_code=status.HTTP_200_OK)
async def login(user: Login, Authorize: AuthJWT = Depends()):
    """
    user login endpoint

    args:

        user (Login): User login details

        Authorize (AuthJWT, optional): AuthJWT instance. defaults to Depends()

    Returns:

        dict: access and refresh tokens
    """

    db_user = session.query(User).filter(
        User.username == user.username).first()

    if db_user and check_password_hash(db_user.password, user.password):
        access_token = Authorize.create_access_token(subject=db_user.username)
        refresh_token = Authorize.create_refresh_token(
            subject=db_user.username)

        response = {'access': access_token, 'refresh': refresh_token}

        return jsonable_encoder(response)

    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                        detail='invalid username or password')


@auth_router.get("/auth/refresh")
async def refresh(Authorize: AuthJWT = Depends()):
    """
    token refresh endpoint

    args:

        Authorize (AuthJWT, optional): AuthJWT instance. defaults to Depends()

    Returns:

        dict: access token
    """

    try:
        Authorize.jwt_refresh_token_required()
        current_user_id = Authorize.get_raw_jwt()['sub']
        access_token = Authorize.create_access_token(subject=current_user_id)
        return jsonable_encoder({'access': access_token})
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='provide a valid refresh token')
