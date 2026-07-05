from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.models import RouteRequest, RouteResponse
from app.service import calculate_route

app = FastAPI(
    title="Router Routing API",
    description="Backend API for Shortest Path Routing using Dijkstra's Algorithm",
    version="1.0.0"
)

# ==========================================
# CORS Configuration
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# Home Route
# ==========================================

@app.get("/")
def home():
    return {
        "message": "Router Routing Backend is Running!"
    }

# ==========================================
# Route API
# ==========================================

@app.post("/route", response_model=RouteResponse)
def find_route(request: RouteRequest):

    try:
        return calculate_route(request)

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )