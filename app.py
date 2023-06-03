"""
module for FastAPI app
"""

from fastapi import FastAPI


app = FastAPI()


@app.get("/")
def index() -> dict:
    message: dict = {"message": "Hello, world!"}
    return message
