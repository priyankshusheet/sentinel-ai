from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Sentinel AI API",
    description="Backend for Sentinel AI - The Next Gen GEO Engine",
    version="0.1.0"
)

# CORS Setup
origins = [
    "http://localhost:5173",  # Vite default
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Sentinel AI Commander"}

from app.api.routes import analytics
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])

