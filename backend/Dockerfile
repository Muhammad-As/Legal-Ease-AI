# Use a slim Python base image
FROM python:3.11-slim

# Environment: avoid writing .pyc, ensure consistent buffering
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install system packages required by pdf2image/pytesseract (optional OCR)
# Note: Tesseract itself is not installed here to keep the image small.
# If you enable OCR in production, add: tesseract-ocr
RUN apt-get update && apt-get install -y --no-install-recommends \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Set workdir
WORKDIR /app

# Copy requirements and install
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend app code (only necessary files)
COPY . .

# Expose port
EXPOSE 8000

# Command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

