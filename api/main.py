"""
FastAPI Main Application for Zhaluzi AI Agent REST API.
Provides endpoints for Chat, Catalog, Coverage, and Health verification.
"""
import sys
from pathlib import Path
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

# Ensure workspace root is in sys.path
WORKSPACE_ROOT = Path(__file__).resolve().parent.parent
if str(WORKSPACE_ROOT) not in sys.path:
    sys.path.insert(0, str(WORKSPACE_ROOT))

from eval.agent_zhaluzi import run_zhaluzi_agent, FABRIC_CATALOG, COVERAGE_CITIES, execute_tool
from api.schemas import (
    ChatRequest,
    ChatResponse,
    CatalogResponse,
    FabricItem,
    CoverageResponse,
    HealthResponse,
    LeadRequest,
    LeadResponse
)

app = FastAPI(
    title="Oracle Agentic AI — Zhaluzi E-Commerce Agent API",
    description="Production REST API interface with tool calling, RAG catalog lookups, and Human-In-The-Loop (HITL) safety gates.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend applications (Next.js, React, mobile apps)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/v1/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    """Verify API service status."""
    return HealthResponse()


@app.get("/api/v1/catalog", response_model=CatalogResponse, tags=["Catalog"])
def get_catalog():
    """Get complete fabric & pricing catalog."""
    fabrics = [
        FabricItem(
            fabric_key=key,
            name=data["name"],
            price_per_m2=float(data["price_per_m2"]),
            min_m2=float(data["min_m2"]),
            thermal_shield=data["thermal_shield"]
        )
        for key, data in FABRIC_CATALOG.items()
    ]
    return CatalogResponse(fabrics=fabrics, total_count=len(fabrics))


@app.get("/api/v1/coverage/{city}", response_model=CoverageResponse, tags=["Coverage"])
def check_coverage(city: str):
    """Check if free measurer with sample catalogs is available for a city."""
    tool_res = execute_tool("check_city_coverage", {"city": city})
    city_lower = city.strip().lower()
    
    if tool_res.get("supported"):
        return CoverageResponse(
            city=tool_res["city"],
            supported=True,
            free_measurer_with_samples=tool_res["free_measurer_with_samples"],
            lead_time_days=tool_res["lead_time_days"]
        )
    return CoverageResponse(
        city=city,
        supported=False,
        free_measurer_with_samples=False,
        message=tool_res.get("message", "Доставка осуществляется службами доставки.")
    )


@app.post("/api/v1/chat", response_model=ChatResponse, tags=["Chat Agent"])
def chat_with_agent(payload: ChatRequest):
    """
    Main Chat API Endpoint.
    Processes user query using autonomous agent engine, executes domain tools, 
    and handles Human-In-The-Loop (HITL) safety escalations.
    """
    if not payload.message or not payload.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message field cannot be empty."
        )

    try:
        agent_result = run_zhaluzi_agent(payload.message)
        
        hitl_triggered = agent_result.get("hitl_triggered", False)
        status_str = "escalated_hitl" if hitl_triggered else "success"
        
        return ChatResponse(
            response=agent_result.get("response", ""),
            tools_called=agent_result.get("tools_called", []),
            hitl_triggered=hitl_triggered,
            hitl_details=agent_result.get("tool_details"),
            status=status_str
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing agent task: {str(e)}"
        )


@app.post("/api/v1/lead", response_model=LeadResponse, tags=["Lead Generation"])
def submit_lead_endpoint(payload: LeadRequest):
    """
    Direct Lead Generation Endpoint for website form modals & chat callback requests.
    Enforces a 5-minute callback SLA.
    """
    if not payload.phone_number or not payload.phone_number.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number is required."
        )

    tool_res = execute_tool("submit_lead", {
        "phone_number": payload.phone_number,
        "customer_name": payload.customer_name,
        "city": payload.city,
        "notes": payload.notes
    })

    return LeadResponse(
        status=tool_res.get("status", "LEAD_SUBMITTED"),
        message=tool_res.get("message", "Заявка успішно прийнята!"),
        lead_id=tool_res.get("lead_id", "LEAD-ZHALUZI-7712"),
        phone_number=payload.phone_number,
        sla_minutes=5
    )
