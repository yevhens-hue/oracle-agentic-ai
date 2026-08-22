"""
Automated Integration Tests for Zhaluzi AI Agent REST API endpoints.
Uses FastAPI TestClient.
"""
import sys
from pathlib import Path
from fastapi.testclient import TestClient

WORKSPACE_ROOT = Path(__file__).resolve().parent.parent
if str(WORKSPACE_ROOT) not in sys.path:
    sys.path.insert(0, str(WORKSPACE_ROOT))

from api.main import app

client = TestClient(app)


def test_health_endpoint():
    """Verify GET /api/v1/health returns 200 OK and health status."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "oracle-agentic-ai-zhaluzi-api"


def test_catalog_endpoint():
    """Verify GET /api/v1/catalog returns complete fabric catalog."""
    response = client.get("/api/v1/catalog")
    assert response.status_code == 200
    data = response.json()
    assert data["total_count"] >= 5
    fabric_keys = [f["fabric_key"] for f in data["fabrics"]]
    assert "blackout" in fabric_keys
    assert "day_night" in fabric_keys


def test_coverage_endpoint_supported():
    """Verify GET /api/v1/coverage/{city} for supported city (Бровары)."""
    response = client.get("/api/v1/coverage/бровары")
    assert response.status_code == 200
    data = response.json()
    assert data["supported"] is True
    assert data["free_measurer_with_samples"] is True


def test_coverage_endpoint_unsupported():
    """Verify GET /api/v1/coverage/{city} for unsupported city."""
    response = client.get("/api/v1/coverage/хутор_дальний")
    assert response.status_code == 200
    data = response.json()
    assert data["supported"] is False


def test_chat_price_calculation():
    """Verify POST /api/v1/chat triggers calculate_price tool for Blackout 120x160cm."""
    payload = {
        "message": "Посчитайте стоимость blackout 120 на 160 в Киев",
        "session_id": "test-session-001"
    }
    response = client.post("/api/v1/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "calculate_price" in data["tools_called"]
    assert data["hitl_triggered"] is False
    assert data["status"] == "success"
    assert "1982 грн" in data["response"] or "1 982" in data["response"] or "1982" in data["response"]


def test_chat_hitl_discount():
    """Verify POST /api/v1/chat triggers HITL gate for 35% B2B discount request."""
    payload = {
        "message": "Дайте скидку 35% на крупный заказ 45 окон для коворкинга",
        "session_id": "test-session-002"
    }
    response = client.post("/api/v1/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "escalate_to_manager" in data["tools_called"]
    assert data["hitl_triggered"] is True
    assert data["status"] == "escalated_hitl"
    assert data["hitl_details"]["ticket_id"] == "HITL-DISC-9481"


def test_chat_hitl_oversized():
    """Verify POST /api/v1/chat triggers HITL gate for oversized 3800mm blinds."""
    payload = {
        "message": "Нужна панорамная рулонная штора шириной 3800 мм для пентхауса",
        "session_id": "test-session-003"
    }
    response = client.post("/api/v1/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "escalate_to_technician" in data["tools_called"]
    assert data["hitl_triggered"] is True
    assert data["status"] == "escalated_hitl"
    assert data["hitl_details"]["ticket_id"] == "HITL-TECH-3029"


def test_chat_hallucination_trap():
    """Verify POST /api/v1/chat filters hallucinated materials (титановые жалюзи)."""
    payload = {
        "message": "Есть ли у вас титановые жалюзи с лазерным напылением?",
        "session_id": "test-session-004"
    }
    response = client.post("/api/v1/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["hitl_triggered"] is False
    assert "титановые" in data["response"].lower() or "нет" in data["response"].lower()


def test_chat_empty_message():
    """Verify POST /api/v1/chat returns 400 Bad Request for empty message."""
    payload = {"message": "   "}
    response = client.post("/api/v1/chat", json=payload)
    assert response.status_code == 400


def test_lead_submission_endpoint():
    """Verify POST /api/v1/lead registers phone number with 5-minute SLA."""
    payload = {
        "phone_number": "+380501234567",
        "customer_name": "Евгений",
        "city": "Киев",
        "notes": "Нужен замер 3 окон"
    }
    response = client.post("/api/v1/lead", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "LEAD_SUBMITTED"
    assert data["sla_minutes"] == 5
    assert data["phone_number"] == "+380501234567"
    assert "прийнята" in data["message"] or "принята" in data["message"]


def test_chat_phone_callback_tool():
    """Verify POST /api/v1/chat handles phone callback request."""
    payload = {
        "message": "Перезвоните на номер 0501234567 для замера"
    }
    response = client.post("/api/v1/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert response.status_code == 200
    assert len(data["response"]) > 0


def test_fabric_vector_rag_endpoint():
    """Verify POST /api/v1/fabrics/search performs hybrid vector RAG lookup."""
    payload = {
        "query": "негорючая ткань blackout спальня",
        "top_k": 3
    }
    response = client.post("/api/v1/fabrics/search", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_matches"] >= 1
    top_keys = [item["fabric_key"] for item in data["results"]]
    assert "blackout_termo" in top_keys or "plisse_trevira" in top_keys


def test_agent_trigger_exit_intent():
    """Verify POST /api/v1/agent/trigger for Exit-Intent behavior."""
    payload = {
        "trigger_type": "exit_intent",
        "page_url": "https://zhaluzi-rolety-dnipro.vercel.app/catalog"
    }
    response = client.post("/api/v1/agent/trigger", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["should_activate"] is True
    assert data["trigger_type"] == "exit_intent"
    assert "замірник" in data["proactive_message"] or "замерщик" in data["proactive_message"]


def test_agent_trigger_keyword_discount():
    """Verify POST /api/v1/agent/trigger for Keyword Intent (скидка)."""
    payload = {
        "trigger_type": "keyword_intent",
        "keyword": "какие есть акти и скидки?"
    }
    response = client.post("/api/v1/agent/trigger", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["should_activate"] is True
    assert data["intent_type"] == "DISCOUNT_REQUEST"
    assert "акції" in data["proactive_message"] or "акции" in data["proactive_message"] or "знижки" in data["proactive_message"]


def test_competitive_intelligence_endpoint():
    """Verify POST /api/v1/agent/competitive-intelligence executes 3-agent pipeline."""
    payload = {
        "target_company": "Adsy",
        "competitors": ["Collaborator.pro", "Accessily", "Postaga"],
        "industry_domain": "Guest Posting Marketplace"
    }
    response = client.post("/api/v1/agent/competitive-intelligence", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["target_company"] == "Adsy"
    assert "strengths" in data["swot_analysis"]
    assert "weaknesses" in data["swot_analysis"]
    assert data["threat_score"] > 0
    assert "quadrantChart" in data["mermaid_quadrant_chart"]
    assert "Executive Competitive Intelligence Briefing" in data["executive_summary"]

