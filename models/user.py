"""
module for SQLAlchemy model `User` for a database table named `users`
"""

from db import Base

from sqlalchemy import Boolean, Column, Integer, String, Text, UUID
from sqlalchemy.orm import relationship


class User(Base):
    """
    class for SQLAlchemy model `User`
    attributes:
        id_, primary key: Column[int]
        email, a non-nullable string: Column[str]
        is_active, a boolean: Column[bool]
        is_staff, a boolean: Column[bool]
        name, a non-nullable string: Column[str]
        password, a non-nullable string: Column[Text]
        reset_token, UUID string: Column[UUID], optional
        session_id, UUID string: Column[UUID], optional
    """
    __tablename__ = 'users'

    id_ = Column(Integer, primary_key=True)
    email = Column(String(100), nullable=False, unique=True)
    is_active = Column(Boolean, default=False)
    is_staff = Column(Boolean, default=False)
    name = Column(String(100), nullable=False)
    orders = relationship('Order', back_populates='users')
    password = Column(Text, nullable=False)
    reset_token = Column(UUID, nullable=True)
    session_id = Column(UUID, nullable=True)
    username = Column(String(50), nullable=False, unique=True)

    def __repr__(self) -> str:
        """ returns a string representation of the instance """
        model: str = f'<User {self.username}>'
        return model
