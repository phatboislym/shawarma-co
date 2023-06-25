from pydantic import BaseModel
from sqlalchemy_utils import UUIDType
from typing import Optional


class OrderModel(BaseModel):
    """ schema for order model """
    id_: Optional[UUIDType]
    quantity: int
    status: Optional[str] = 'PENDING'
    size: Optional[str] = 'MEDIUM'
    spiciness: Optional[str] = 'MEDIUM'
    user_id: Optional[UUIDType]

    class Config:
        orm_mode = True
        arbitrary_types_allowed = True
        schema_extra = {
            'example': {
                'id_': '9c267dc4-4cf8-405a-a91a-b6577292c230',
                'quantity': 5,
                'status': 'PENDING',
                'size': 'MEDIUM',
                'spiciness': 'MEDIUM',
                'user_id': '3afdcf22-05e0-468d-90bd-72439971a92e'
            }
        }
