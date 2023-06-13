from pydantic import BaseModel
from typing import Optional


class SignUp(BaseModel):

    id_: Optional[int]
    email: str
    is_active: Optional[bool]
    is_staff: Optional[bool]
    name: Optional[str]
    password: bytes
    username: str

    class Config:
        orm_mode = True
        schema_extra = {
            'example': {
                'email': 'dinktheball@example.com',
                'is_active': True,
                'is_staff': False,
                'name': 'Antonín Panenka',
                'password': b'$2b$12$sReTJL8O6jpJNkBs7ZAFrOAZAvDkptgVIn.gBrxcuPJyXGkWi5SKC',
                'username': "panenka"
            }
        }
