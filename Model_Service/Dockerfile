FROM python:3.11-slim

WORKDIR /app

# Install Dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy App Code and Model Artifacts
COPY . .

# Hugging Face Spaces Expects Port 7860
ENV PORT=7860
EXPOSE 7860

CMD ["python", "inference.py"]
