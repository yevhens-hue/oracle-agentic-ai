"""
Smart Lead Capture & Intent Scoring Engine for Zhaluzi API.
Provides automatic intent scoring, 5-minute SLA timer calculations, and Lead routing payloads.
"""
from typing import Dict, Any, Optional
from datetime import datetime, timedelta


def calculate_intent_score(query: str, phone: str, has_dimensions: bool = False, city: Optional[str] = None) -> Dict[str, Any]:
    """
    Calculate customer purchase intent score (0-100) and 5-minute SLA expiration timestamp.
    """
    score = 30 # Base intent
    query_lower = query.lower()

    if phone and len(phone.replace(" ", "").replace("-", "")) >= 9:
        score += 40

    if has_dimensions or any(dim in query_lower for dim in ["х", "x", "120", "160", "см", "мм", "размер"]):
        score += 15

    if city:
        score += 10

    if any(urgent in query_lower for urgent in ["замер", "сегодня", "срочно", "заказ", "купить"]):
        score += 5

    score = min(score, 100)

    now = datetime.utcnow()
    sla_expires_at = now + timedelta(minutes=5)

    intent_level = "HIGH_INTENT" if score >= 70 else "MEDIUM_INTENT" if score >= 40 else "LOW_INTENT"

    return {
        "intent_score": score,
        "intent_level": intent_level,
        "sla_minutes": 5,
        "created_at": now.isoformat(),
        "sla_expires_at": sla_expires_at.isoformat(),
        "priority": "P1_IMMEDIATE_CALL" if score >= 70 else "P2_STANDARD_CALL"
    }
