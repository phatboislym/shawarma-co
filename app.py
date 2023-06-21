""""
module for FastAPI app
"""

from fastapi import FastAPI
from fastapi_another_jwt_auth import AuthJWT
from fastapi.middleware.cors import CORSMiddleware
from routes.auth_routes import auth_router
from routes.order_routes import order_router
from routes.user_routes import user_router
from schemas.settings import Settings


app = FastAPI()
origins = ["http://localhost:5173"]

app.add_middleware(CORSMiddleware, allow_origins=origins,
                   allow_credentials=True, allow_methods=["*"],
                   allow_headers=["*"])


@AuthJWT.load_config
def get_config():
    return Settings()


app.include_router(auth_router)
app.include_router(order_router)
app.include_router(user_router)


@app.get("/")
def index() -> dict:
    message: dict = {"message": 'Hello, world!'}
    return message
