"""
module for auth routes
"""
from db import engine, Session
from fastapi import APIRouter, Depends, status
from fastapi_another_jwt_auth import AuthJWT
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import HTTPException
from models.user import User
from schemas.signup import SignUp
from schemas.login import Login
from werkzeug.security import check_password_hash, generate_password_hash


auth_router = APIRouter()
session = Session(bind=engine)


@auth_router.get("/auth")
async def auth(Authorize: AuthJWT = Depends()) -> dict:
    """
    base authentication endpoint

    args:

        Authorize (AuthJWT, optional): AuthJWT instance. defaults to Depends()

    Returns:

        dict: Response message
    """

    try:
        Authorize.jwt_required()
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='invalid token')

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
                          username=user.username)

    session.add(new_user)
    session.commit()
    return new_user


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
