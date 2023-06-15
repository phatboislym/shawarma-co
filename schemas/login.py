from pydantic import BaseModel


class Login(BaseModel):
    """ schema for login model """

    password: str
    username: str

    class Config:
        orm_mode = True
        schema_extra = {
            'example': {
                'password': "panenka1967",
                'username': "panenka"
            }
        }
