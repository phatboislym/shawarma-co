from pydantic import BaseModel
from typing import Optional


class OrderModel(BaseModel):
    """ schema for order model """
    id_: Optional[int]
    quantity: int
    status: Optional[str] = 'PENDING'
    size: Optional[str] = 'MEDIUM'
    spicyness: Optional[str] = 'ORIGINAL'
    user_id: Optional[int]

    class Config:
        orm_mode = True
        schema_extra = {
            'example': {
                'id_': 12,
                'quantity': 5,
                'status': 'PENDING',
                'size': 'MEDIUM',
                'spicyness': 'ORIGINAL',
                'user_id': 2
            }
        }
