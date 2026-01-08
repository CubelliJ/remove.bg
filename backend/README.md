# Background Removal API

A FastAPI-based REST API for removing backgrounds from images using ML segmentation (U2-Net model via rembg).

## Features

- Remove backgrounds from PNG, JPEG, JPG, and WebP images
- Returns PNG images with transparent alpha channel
- Uses pretrained U2-Net model for accurate segmentation
- Dockerized for easy deployment
- CORS enabled for frontend integration

## Quick Start

### Using Docker Compose (Recommended)

```bash
cd backend
docker-compose up --build
```

The API will be available at `http://localhost:8000`

### Using Docker

```bash
cd backend
docker build -t background-removal-api .
docker run -p 8000:8000 background-removal-api
```

### Local Development

```bash
cd backend
pip install -r requirements.txt
python main.py
```

Or with uvicorn:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### GET `/`
Returns API information and available endpoints.

### GET `/health`
Health check endpoint.

### POST `/remove-background`
Remove background from an uploaded image.

**Parameters:**
- `file`: Image file (multipart/form-data)

**Supported formats:** PNG, JPEG, JPG, WebP

**Returns:** PNG image with transparent background

**Example using curl:**
```bash
curl -X POST "http://localhost:8000/remove-background" \
  -F "file=@your-image.jpg" \
  --output result.png
```

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Technology Stack

- **FastAPI**: Modern, fast web framework
- **rembg**: Background removal library using U2-Net
- **PyTorch**: Deep learning framework
- **Pillow**: Image processing
- **Docker**: Containerization

## Model Information

The API uses the U2-Net (U^2-Net) model, a state-of-the-art salient object detection model that excels at background removal. The model is automatically downloaded on first use.

## Notes

- First request may take longer as the model needs to be downloaded
- Model files are cached for subsequent requests
- Recommended to use images under 10MB for optimal performance
