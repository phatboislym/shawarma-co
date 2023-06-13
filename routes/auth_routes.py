from db import engine, Session
from fastapi import APIRouter, status
from fastapi.exceptions import HTTPException
from models.user import User
from schemas.signup import SignUp
from werkzeug.security import generate_password_hash

auth_router = APIRouter()
session = Session(bind=engine)


@auth_router.get("/auth")
async def auth() -> dict:
    message: dict = {"message": "base authentication endpoint"}
    return message


@auth_router.post("/auth/register", status_code=status.HTTP_201_CREATED)
async def register(user: SignUp):
    db_email = session.query(User).filter(User.email == user.email).first()
    if db_email:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                             detail='User with that email already exists')

    db_username = session.query(User).filter(
        User.username == user.username).first()
    if db_username:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                             detail='User with that username already exists')

    new_user: User = User(email=user.email, is_active=user.is_active,
                          is_staff=user.is_staff, name=user.name,
                          password=generate_password_hash(user.password),
                          username=user.username)

    session.add(new_user)
    session.commit()
    return new_user


@auth_router.get("/auth/login")
async def login() -> dict:
    message: dict = {"message": "login endpoint"}
    return message
