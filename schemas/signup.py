from pydantic import BaseModel
from sqlalchemy_utils import UUIDType
from typing import Optional


class SignUp(BaseModel):
    """ schema for SignUp model """

    id_: Optional[UUIDType]
    username: str
    email: str
    name: Optional[str]
    is_active: Optional[bool]
    is_staff: Optional[bool]
    password: str

    class Config:
        orm_mode = True
        arbitrary_types_allowed = True
        schema_extra = {
            'example': {
                'id_': '3afdcf22-05e0-468d-90bd-72439971a92e',
                'username': "panenka",
                'email': 'dinktheball@example.com',
                'name': 'Antonín Panenka',
                'is_active': True,
                'is_staff': False,
                'password': "panenka1967"
            }
        }
