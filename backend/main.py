from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove
from PIL import Image
import io
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Background Removal API",
    description="API for removing backgrounds from images using ML segmentation",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Background Removal API",
        "status": "running",
        "endpoints": {
            "/remove-background": "POST - Upload an image to remove its background"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/remove-background")
async def remove_background(file: UploadFile = File(...)):
    """
    Remove background from an uploaded image.
    
    Args:
        file: Image file (PNG, JPEG, JPG, WebP)
    
    Returns:
        PNG image with transparent background
    """
    try:
        # Validate file type
        allowed_types = ["image/png", "image/jpeg", "image/jpg", "image/webp"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed types: {', '.join(allowed_types)}"
            )
        
        logger.info(f"Processing image: {file.filename}, type: {file.content_type}")
        
        # Read the uploaded file
        contents = await file.read()
        
        # Open image with PIL
        input_image = Image.open(io.BytesIO(contents))
        
        # Remove background using rembg (uses U2-Net model)
        output_image = remove(input_image)
        
        # Convert to PNG with alpha channel
        if output_image.mode != 'RGBA':
            output_image = output_image.convert('RGBA')
        
        # Save to bytes
        img_byte_arr = io.BytesIO()
        output_image.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        
        logger.info(f"Successfully processed image: {file.filename}")
        
        # Return the image as PNG
        return Response(
            content=img_byte_arr.getvalue(),
            media_type="image/png",
            headers={
                "Content-Disposition": f"attachment; filename=no_bg_{file.filename.rsplit('.', 1)[0]}.png"
            }
        )
        
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
