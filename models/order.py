"""
module for SQLAlchemy model `Order` for a database table named `orders`
"""

from db import Base, Session
from sqlalchemy import (Boolean, Column, DateTime,
                        ForeignKey, Integer, String, Text)
from sqlalchemy.orm import relationship
from sqlalchemy_utils import ChoiceType
from typing import Optional


class Order(Base):
    """
    class for SQLAlchemy model `Order`
    attributes:
        id_, primary key: Column[int]
        quantity: Column[int],
        size: Column[ChoiceType],
        spicyness: Column[ChoiceType]
        status: Column[ChoiceType]
        time: Column[DateTime]
        user: relationship
        user_id: Column[int] 
    """
    ORDER_STATUSES = (('PENDING', 'pending'), ('IN-TRANSIT', 'in-transit'),
                      ('DELIVERED', 'delivered'), ('CANCELED', 'canceled'))

    WRAP_SIZES = (('SMALL', 'small'), ('MEDIUM', 'medium'),
                  ('LARGE', 'large'), ('EXTRA-LARGE', 'extra-large'))

    SPICYNESS = (('NO-SPICE', 'no-spice'), ('MILD', 'mild'),
                 ('MEDIUM', 'medium'),
                 ('SPICY', 'spicy'),
                 ('EXTRA-SPICY', 'extra-spicy'))

    __tablename__ = 'orders'

    id_ = Column(Integer, primary_key=True)
    quantity = Column(Integer, nullable=False)
    status = Column(ChoiceType(choices=ORDER_STATUSES), default='PENDING')
    size = Column(ChoiceType(choices=WRAP_SIZES), default='MEDIUM')
    spicyness = Column(ChoiceType(choices=SPICYNESS), default='MEDIUM')
    user_id = Column(Integer, ForeignKey('users.id_'))
    user = relationship('User', back_populates='orders')

    def __repr__(self) -> str:
        model: str = f'<Order {self.id_}>'
        return model
