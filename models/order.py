"""
module for SQLAlchemy model `Order` for a database table named `orders`
"""

from datetime import datetime
from db import Base
from sqlalchemy import Column, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship
from sqlalchemy_utils import ChoiceType, UUIDType
from uuid import uuid4


class Order(Base):
    """
    class for SQLAlchemy model `Order`
    attributes:
        id_, primary key: Column[UUIDType]
        quantity: Column[int],
        size: Column[ChoiceType],
        spiciness: Column[ChoiceType]
        status: Column[ChoiceType]
        time: Column[DateTime]
        user: relationship
        user_id: Column[UUIDType] 
        created_at, a datetime object: Column[DateTime]
        updated_at, a datetime object: Column[DateTime]
    """
    ORDER_STATUSES = (('PENDING', 'pending'), ('IN-TRANSIT', 'in-transit'),
                      ('DELIVERED', 'delivered'), ('CANCELED', 'canceled'))

    WRAP_SIZES = (('SMALL', 'small'), ('MEDIUM', 'medium'),
                  ('LARGE', 'large'), ('EXTRA-LARGE', 'extra-large'))

    SPICINESS = (('NO-SPICE', 'no-spice'), ('MILD', 'mild'),
                 ('MEDIUM', 'medium'),
                 ('SPICY', 'spicy'),
                 ('EXTRA-SPICY', 'extra-spicy'))

    __tablename__ = 'orders'

    id_ = Column(UUIDType(binary=False), primary_key=True, default=uuid4)
    quantity = Column(Integer, nullable=False)
    status = Column(ChoiceType(choices=ORDER_STATUSES), default='PENDING')
    size = Column(ChoiceType(choices=WRAP_SIZES), default='MEDIUM')
    spiciness = Column(ChoiceType(choices=SPICINESS), default='MEDIUM')
    user_id = Column(UUIDType, ForeignKey('users.id_'))
    user = relationship('User', back_populates='orders')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)

    def __repr__(self) -> str:
        model: str = f'<Order {self.id_}>'
        return model
