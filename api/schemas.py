"""
Pydantic API Schemas for Zhaluzi AI Agent REST API.
"""
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class ChatRequest(BaseModel):
    message: str = Field(..., description="User message / question to the agent", json_schema_extra={"example": "Сколько стоят шторы blackout 120 на 160 в Киев?"})
    session_id: Optional[str] = Field(default=None, description="Unique session UUID for conversation context tracking")
    user_location: Optional[str] = Field(default=None, description="Optional user city or region location")


class ChatResponse(BaseModel):
    response: str = Field(..., description="Agent text response")
    tools_called: List[str] = Field(default_factory=list, description="List of internal tools invoked by the agent")
    hitl_triggered: bool = Field(default=False, description="Flag indicating whether a Human-In-The-Loop gate was triggered")
    hitl_details: Optional[Dict[str, Any]] = Field(default=None, description="Details of the HITL escalation ticket if triggered")
    status: str = Field(default="success", description="Status string: 'success', 'escalated_hitl', or 'error'")
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat(), description="ISO timestamp of response")


class FabricItem(BaseModel):
    fabric_key: str
    name: str
    price_per_m2: float
    min_m2: float
    thermal_shield: bool


class CatalogResponse(BaseModel):
    fabrics: List[FabricItem]
    total_count: int


class CoverageResponse(BaseModel):
    city: str
    supported: bool
    free_measurer_with_samples: bool = False
    lead_time_days: Optional[int] = None
    message: Optional[str] = None


class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "oracle-agentic-ai-zhaluzi-api"
    version: str = "1.0.0"
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class LeadRequest(BaseModel):
    phone_number: str = Field(..., description="Customer phone number", json_schema_extra={"example": "+380501234567"})
    customer_name: Optional[str] = Field(default="Клієнт", description="Customer name")
    city: Optional[str] = Field(default="Київ", description="Delivery or measurement city")
    notes: Optional[str] = Field(default=None, description="Additional notes or product requirements")


class LeadResponse(BaseModel):
    status: str = "LEAD_SUBMITTED"
    message: str
    lead_id: str
    phone_number: str
    intent_score: int = 85
    intent_level: str = "HIGH_INTENT"
    sla_minutes: int = 5
    sla_expires_at: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class FabricSearchRequest(BaseModel):
    query: str = Field(..., description="Semantic search query (e.g. негорючая ткань blackout спальня)", json_schema_extra={"example": "негорючая ткань blackout спальня"})
    top_k: int = Field(default=3, description="Number of vector RAG results to return")


class FabricSearchResultItem(BaseModel):
    fabric_key: str
    name: str
    price_per_m2: float
    min_m2: float
    thermal_shield: bool
    light_block_percent: int
    fire_resistant: bool
    relevance_score: float


class FabricSearchResponse(BaseModel):
    query: str
    total_matches: int
    results: List[FabricSearchResultItem]
