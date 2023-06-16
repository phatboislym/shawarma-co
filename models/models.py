from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship


class Order(Base):
    __tablename__ = 'orders'

    order_id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey('customers.customer_id'))
    order_date = Column(DateTime)
    order_status = Column(String(10))

    order_items = relationship('OrderItem', backref='order')


class OrderItem(Base):
    __tablename__ = 'order_items'

    order_item_id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey('orders.order_id'))
    item_id = Column(Integer, ForeignKey('items.item_id'))
    item_name = Column(String(50))
    item_price = Column(Float)
    item_quantity = Column(Integer)


class Customer(Base):
    __tablename__ = 'customers'

    customer_id = Column(Integer, primary_key=True)
    name = Column(String(50))
    email = Column(String(255))
    phone_number = Column(String(10))


Base.metadata.create_all()
