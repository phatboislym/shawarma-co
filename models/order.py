"""
module for SQLAlchemy model `Order` for a database table named `orders`
"""

from ..db import Base, Session
from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from typing import Optional


Base = declarative_base()


class Order(Base):
    """
    class for SQLAlchemy model `Order`
    attributes:
        id_, primary key: Column[int]
        status: Column[str]
        time: Column[DateTime]
        user_id: Column[int] 
        items: Column[cheese: Column[bool],
            quantity: Column[int],
            size: Column[str],
            spicyness: Column[str]]
    """
    __tablename__ = 'users'

    id_ = Column(Integer, primary_key=True)
    email = Column(String(100), nullable=False, unique=True)
    password = Column(Text, nullable=False)
    is_active = Column(Boolean, default=False)
    is_staff = Column(Boolean, default=False)
    session_id = Column(String(250), nullable=True)
    reset_token = Column(String(250), nullable=True)
    username = Column(String(50), nullable=False, unique=True)

    def __init__(self, email: str, password: str, username: str,
                 reset_token: Optional[str] = None,
                 session_id: Optional[str] = None) -> None:
        self.email = email
        self.password = password
        self.is_active = False
        self.is_staff = False
        self.session_id = session_id
        self.reset_token = reset_token
        self.username = username

    def __repr__(self) -> str:
        model: str = f'<User {self.username}>'
        return model
