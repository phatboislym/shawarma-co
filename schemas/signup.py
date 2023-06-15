from pydantic import BaseModel
from typing import Optional


class SignUp(BaseModel):
    """ schema for SignUp model """

    id_: Optional[int]
    username: str
    email: str
    name: Optional[str]
    is_active: Optional[bool]
    is_staff: Optional[bool]
    password: str

    class Config:
        orm_mode = True
        schema_extra = {
            'example': {
                'username': "panenka",
                'email': 'dinktheball@example.com',
                'name': 'Antonín Panenka',
                'is_active': True,
                'is_staff': False,
                'password': "panenka1967"
            }
        }
