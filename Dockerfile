# Base image
FROM ubuntu:22.10

# Install apt packages and update refs
RUN apt-get update -y && apt-get upgrade -y 

# Install Python and other requirements
RUN apt-get install -y vim nano python3.10 python3-pip python3-dev build-essential libpq-dev curl git bat

# Install PostgreSQL client
RUN apt-get install -y postgresql-client

# Set working directory
WORKDIR /app

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Install uvicorn
RUN pip install uvicorn

# Copy the application code
COPY . .

# Expose the required port (adjust if needed)
EXPOSE 8000

# Set the entrypoint command
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
