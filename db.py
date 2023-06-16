from dotenv import load_dotenv
from os import environ
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


# Load the environmental variables from the .env file
load_dotenv('./.env.development.local')

# Retrieve the database connection details from environmental variables
db_host = environ.get('DB_HOST', 'localhost')
db_port = environ.get('DB_PORT', '5432')
db_name = environ.get('DB_NAME', 'shawarmaco')
db_user = environ.get('DB_USER', 'portfolio')
db_password = environ.get('DB_PASSWORD')

# Construct the database URL or connection string
db = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"

# Create the database engine
engine = create_engine(db, echo=True)

Base = declarative_base()
Session = sessionmaker(bind=engine)
