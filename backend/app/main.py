from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, pages, videos, metrics
from .database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(pages.router)
app.include_router(videos.router)
app.include_router(metrics.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the API"} 