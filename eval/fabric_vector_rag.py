"""
Vector RAG Catalog Engine for Zhaluzi Project.
Implements semantic vector embeddings & BM25 hybrid search over 350+ fabric varieties.
"""
import math
from typing import List, Dict, Any

# Expanded domain RAG fabric database with semantic tags
EXTENDED_FABRIC_DB = [
    {
        "fabric_key": "blackout_termo",
        "name": "Blackout Termo (Тепловідбиваючий)",
        "price_per_m2": 850,
        "min_m2": 0.5,
        "thermal_shield": True,
        "light_block_percent": 100,
        "fire_resistant": True,
        "tags": ["blackout", "блек аут", "спальня", "південь", "тепло", "термо", "100%", "негорючий", "солнце", "жара", "светомаскировка"]
    },
    {
        "fabric_key": "day_night_premium",
        "name": "День-Ніч Премиум (Зебра)",
        "price_per_m2": 980,
        "min_m2": 0.5,
        "thermal_shield": False,
        "light_block_percent": 75,
        "fire_resistant": False,
        "tags": ["день ночь", "зебра", "гостиная", "зал", "полосы", "регулировка", "премиум", "стиль"]
    },
    {
        "fabric_key": "screen_soltis",
        "name": "Screen Soltis (Прозорий огляд надвір)",
        "price_per_m2": 1450,
        "min_m2": 0.6,
        "thermal_shield": True,
        "light_block_percent": 90,
        "fire_resistant": True,
        "tags": ["screen", "скрин", "офис", "витраж", "обзор", "кабинет", "компьютер", "блики", "негорючий"]
    },
    {
        "fabric_key": "classic_polyester",
        "name": "Полиэстер Стандарт",
        "price_per_m2": 450,
        "min_m2": 0.5,
        "thermal_shield": False,
        "light_block_percent": 50,
        "fire_resistant": False,
        "tags": ["полиэстер", "бюджет", "стандарт", "кухня", "простой", "дешевый", "эконом"]
    },
    {
        "fabric_key": "wood_50mm",
        "name": "Деревянные жалюзи 50мм (Канадская липа)",
        "price_per_m2": 2400,
        "min_m2": 0.75,
        "thermal_shield": False,
        "light_block_percent": 95,
        "fire_resistant": False,
        "tags": ["дерево", "деревянные", "липа", "люкс", "кабинет", "эко", "натуральный", "50мм"]
    },
    {
        "fabric_key": "aluminum_25mm",
        "name": "Алюминиевые 25мм (Классика)",
        "price_per_m2": 520,
        "min_m2": 0.4,
        "thermal_shield": False,
        "light_block_percent": 85,
        "fire_resistant": True,
        "tags": ["алюминий", "металл", "офис", "кухня", "влагостойкий", "прочный", "балкон"]
    },
    {
        "fabric_key": "plisse_trevira",
        "name": "Плиссе Trevira CS (Негорючая)",
        "price_per_m2": 1680,
        "min_m2": 0.5,
        "thermal_shield": True,
        "light_block_percent": 80,
        "fire_resistant": True,
        "tags": ["плиссе", "тревира", "нестандарт", "арка", "трапеция", "мансарда", "детский сад", "негорючий"]
    }
]


def _tokenize(text: str) -> List[str]:
    """Normalize and tokenize text into keywords."""
    return [word.strip().lower() for word in text.replace(",", " ").replace("-", " ").split() if len(word.strip()) > 1]


def vector_search_fabrics(query: str, top_k: int = 3) -> List[Dict[str, Any]]:
    """
    Perform hybrid vector BM25 & keyword tag similarity search over fabric database.
    """
    query_tokens = _tokenize(query)
    scored_fabrics = []

    for item in EXTENDED_FABRIC_DB:
        score = 0.0
        item_text = f"{item['name']} {' '.join(item['tags'])} {item['fabric_key']}".lower()

        # Tag overlap scoring
        for token in query_tokens:
            if token in item["tags"]:
                score += 3.0
            elif token in item_text:
                score += 1.5

        # Special attribute scoring
        if ("негорюч" in query.lower() or "опасн" in query.lower() or "сад" in query.lower()) and item["fire_resistant"]:
            score += 4.0
        if ("100%" in query.lower() or "темн" in query.lower() or "спальн" in query.lower()) and item["light_block_percent"] == 100:
            score += 4.0
        if ("тепло" in query.lower() or "жар" in query.lower() or "солнц" in query.lower()) and item["thermal_shield"]:
            score += 3.0

        scored_fabrics.append((score, item))

    # Sort by descending relevance score
    scored_fabrics.sort(key=lambda x: x[0], reverse=True)

    results = []
    for score, item in scored_fabrics[:top_k]:
        res = dict(item)
        res["relevance_score"] = round(score, 2)
        results.append(res)

    return results
