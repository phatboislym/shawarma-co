from dotenv import load_dotenv
from os import environ
from pydantic import BaseModel


# Load the environmental variables from the .env file
load_dotenv('./.env.development.local')


class Settings(BaseModel):
    """ Settings class that extends BaseModel from Pydantic """
    authjwt_secret_key = environ.get(
        'DB_SECRET', '76fc0673e8ebe931438d67d1c6b99f2d6de50bf78ff29ebf9f9291cbf4e94648')
    # Specify access token lifetime
    access_token_expire_minutes: int = 30
    # Specify refresh token lifetime
    refresh_token_expire_days: int = 15
    # Specify token location as headers and cookies
    authjwt_token_location = ['headers', 'cookies']
