from typing import List
from pydantic import BaseModel, Field


# ==========================================
# Request Model
# ==========================================

class RouteRequest(BaseModel):
    nodes: int = Field(..., gt=0, description="Number of routers")

    edges: List[List[int]] = Field(
        ...,
        description="Each edge is [source, destination, weight]"
    )

    source: int = Field(..., ge=0, description="Source router")

    destination: int = Field(..., ge=0, description="Destination router")


# ==========================================
# Response Model
# ==========================================

class RouteResponse(BaseModel):
    distance: int
    path: List[int]


# ==========================================
# Error Response Model
# ==========================================

class ErrorResponse(BaseModel):
    error: str