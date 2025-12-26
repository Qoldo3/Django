# syntax=docker/dockerfile:1.6
FROM python:3.11
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app

# Install system deps
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies first to cache layers
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy app source code last to maximize caching
COPY ./core /app/
