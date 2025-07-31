FROM python:3.10-slim

# Installera beroenden
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    libgtk-3-dev \
    git \
    wget \
    curl

# Installera python-bibliotek
RUN pip install face_recognition opencv-python-headless requests numpy

# Skapa app-folder
WORKDIR /app
COPY . /app

# Kör main.py när containern startar
CMD ["python", "main.py"]
