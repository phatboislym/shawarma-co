"""
module for SQLAlchemy model `User` for a database table named `users`
"""

from db import Base

from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy_utils import UUIDType
from uuid import uuid4


class User(Base):
    """
    class for SQLAlchemy model `User`
    attributes:
        id_, primary key: Column[UUIDType]
        email, a non-nullable string: Column[str]
        is_active, a boolean: Column[bool]
        is_staff, a boolean: Column[bool]
        name, a non-nullable string: Column[str]
        password, a non-nullable string: Column[Text]
        created_at, a datetime object: Column[DateTime]
        updated_at, a datetime object: Column[DateTime]
    """
    __tablename__ = 'users'

    id_ = Column(UUIDType(binary=False), primary_key=True, default=uuid4)
    email = Column(String(100), nullable=False, unique=True)
    is_active = Column(Boolean, default=False)
    is_staff = Column(Boolean, default=False)
    name = Column(String(100), nullable=True)
    orders = relationship('Order', back_populates='user')
    password = Column(Text, nullable=False)
    username = Column(String(50), nullable=False, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)

    def __repr__(self) -> str:
        """ returns a string representation of the instance """
        model: str = f'<User {self.username}>'
        return model
