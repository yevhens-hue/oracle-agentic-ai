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
from eval.fabric_vector_rag import vector_search_fabrics
from api.lead_engine import calculate_intent_score
from api.trigger_engine import evaluate_trigger
from api.schemas import (
    ChatRequest,
    ChatResponse,
    CatalogResponse,
    FabricItem,
    CoverageResponse,
    HealthResponse,
    LeadRequest,
    LeadResponse,
    FabricSearchRequest,
    FabricSearchResponse,
    FabricSearchResultItem,
    TriggerRequest,
    TriggerResponse
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
    Enforces a 5-minute callback SLA and calculates purchase intent score.
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

    intent_info = calculate_intent_score(
        query=payload.notes or "",
        phone=payload.phone_number,
        has_dimensions=False,
        city=payload.city
    )

    return LeadResponse(
        status=tool_res.get("status", "LEAD_SUBMITTED"),
        message=tool_res.get("message", "Заявка успішно прийнята!"),
        lead_id=tool_res.get("lead_id", "LEAD-ZHALUZI-7712"),
        phone_number=payload.phone_number,
        intent_score=intent_info["intent_score"],
        intent_level=intent_info["intent_level"],
        sla_minutes=5,
        sla_expires_at=intent_info["sla_expires_at"]
    )


@app.post("/api/v1/fabrics/search", response_model=FabricSearchResponse, tags=["Vector RAG Search"])
def search_fabrics_endpoint(payload: FabricSearchRequest):
    """
    Vector RAG Semantic Search Endpoint across 350+ fabrics.
    Finds best matching fabrics by natural language query (e.g. 'негорючая ткань blackout спальня').
    """
    if not payload.query or not payload.query.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Query field cannot be empty."
        )

    results = vector_search_fabrics(payload.query, top_k=payload.top_k)

    items = [
        FabricSearchResultItem(
            fabric_key=r["fabric_key"],
            name=r["name"],
            price_per_m2=float(r["price_per_m2"]),
            min_m2=float(r["min_m2"]),
            thermal_shield=r["thermal_shield"],
            light_block_percent=r["light_block_percent"],
            fire_resistant=r["fire_resistant"],
            relevance_score=r["relevance_score"]
        )
        for r in results
    ]

    return FabricSearchResponse(
        query=payload.query,
        total_matches=len(items),
        results=items
    )


@app.post("/api/v1/agent/trigger", response_model=TriggerResponse, tags=["Smart Agent Triggers"])
def evaluate_trigger_endpoint(payload: TriggerRequest):
    """
    Evaluates behavioral events (Exit-Intent, Time-on-Page, Cart Hesitation, Keyword Intent)
    and returns proactive agent activation payloads.
    """
    trigger_data = evaluate_trigger(
        trigger_type=payload.trigger_type,
        user_action=payload.user_action,
        keyword=payload.keyword,
        page_url=payload.page_url
    )

    return TriggerResponse(
        should_activate=trigger_data.get("should_activate", True),
        trigger_type=trigger_data.get("trigger_type", payload.trigger_type),
        intent_type=trigger_data.get("intent_type", "GENERAL_TRIGGER"),
        proactive_message=trigger_data.get("proactive_message", ""),
        suggested_actions=trigger_data.get("suggested_actions", []),
        priority=trigger_data.get("priority", "P2_MEDIUM")
    )


from api.competitive_intelligence import CompIntelRequest, CompIntelResponse, run_competitive_intelligence_pipeline

@app.post("/api/v1/agent/competitive-intelligence", response_model=CompIntelResponse, tags=["Competitive Intelligence Multi-Agent"])
async def run_competitive_intelligence_endpoint(payload: CompIntelRequest):
    """
    Multi-Agent Competitive Intelligence Workflow (BrightData Pattern).
    Executes Researcher Agent -> Analyst Agent (SWOT & Threat Score) -> Writer Agent (Mermaid & Executive Briefing).
    """
    try:
        response = await run_competitive_intelligence_pipeline(payload)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Competitive Intelligence Agent error: {str(e)}"
        )


from api.advertools_analyzer import AdvertoolsAuditRequest, AdvertoolsAuditResponse, audit_publisher_domain

@app.post("/api/v1/seo/advertools-audit", response_model=AdvertoolsAuditResponse, tags=["SEO & Advertools Audit"])
def advertools_audit_endpoint(payload: AdvertoolsAuditRequest):
    """
    Real-time Advertools SEO & AI Bot Crawler Audit.
    Verifies domain robots.txt permissions for GPTBot, PerplexityBot, ClaudeBot, and Google-Extended.
    """
    try:
        return audit_publisher_domain(payload.domain_url)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Advertools audit error: {str(e)}"
        )


