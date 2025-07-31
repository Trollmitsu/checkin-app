FROM python:3.10-slim

# Install system dependencies
RUN apt update && apt install -y \
    cmake \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    libgtk2.0-dev \
    libgtk-3-dev \
    libsm6 \
    libxext6 \
    libxrender-dev \
    ffmpeg \
    libatlas-base-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy application code
COPY . /app
WORKDIR /app

# Run app
CMD ["python", "main.py"]
