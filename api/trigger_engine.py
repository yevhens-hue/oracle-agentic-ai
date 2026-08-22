"""
Smart Assistant Trigger Engine for Zhaluzi AI Agent.
Handles proactive activation triggers: Exit-Intent, Time-on-Page, Cart Hesitation, and Keyword Intent.
"""
from typing import Dict, Any, List, Optional


TRIGGER_CONFIGS = {
    "exit_intent": {
        "should_activate": True,
        "intent_type": "EXIT_PREvention",
        "proactive_message": "Зачекайте! ✋ Зафіксуйте безкоштовний виїзд замірника з 350+ зразками тканин перед виходом?",
        "suggested_actions": ["📐 Викликати замірника", "💰 Розрахувати вартість"],
        "priority": "P1_HIGH"
    },
    "time_on_page": {
        "should_activate": True,
        "intent_type": "CATALOG_ASSIST",
        "proactive_message": "Помітив, що ви вибираєте штори! 💡 Допомогти підібрати тканину під ваш інтер'єр чи порахувати розміри?",
        "suggested_actions": ["🌞 Тканини блек аут 100%", "🦓 Штори День-Ніч"],
        "priority": "P2_MEDIUM"
    },
    "cart_hesitation": {
        "should_activate": True,
        "intent_type": "CALCULATOR_CONVERT",
        "proactive_message": "Розрахунок готовий! 📐 Бажаєте зберегти ціну та узгодити виїзд майстра з виміром у зручний час?",
        "suggested_actions": ["✅ Забронювати замір (5 хв)", "📞 Передзвонити мені"],
        "priority": "P1_HIGH"
    },
    "keyword_intent": {
        "should_activate": True,
        "intent_type": "KEYWORD_TRIGGER",
        "proactive_message": "Бачу ваш запит! Я можу проконсультувати щодо знижок, умов безкоштовного заміру та нестандартних розмірів.",
        "suggested_actions": ["🏷️ Отримати скидку", "📏 Нестандартний замер"],
        "priority": "P2_MEDIUM"
    }
}


def evaluate_trigger(trigger_type: str, user_action: Optional[str] = None, keyword: Optional[str] = None, page_url: Optional[str] = None) -> Dict[str, Any]:
    """
    Evaluate user behavioral event and return appropriate proactive trigger response payload.
    """
    t_type = trigger_type.strip().lower()

    if t_type == "keyword_intent" or keyword:
        kw = (keyword or user_action or "").lower()
        if any(term in kw for term in ["скидк", "снижк", "акци", "скидка"]):
            return {
                "should_activate": True,
                "trigger_type": "keyword_intent",
                "intent_type": "DISCOUNT_REQUEST",
                "proactive_message": "Шукаєте акції та знижки? 🎁 При замовленні від 3 вікон ви отримуєте безкоштовний замір та доставку!",
                "suggested_actions": ["🏷️ Запросити оптову знижку", "📞 Замовити дзвінок"],
                "priority": "P1_HIGH"
            }
        elif any(term in kw for term in ["замер", "заміряти", "замерщик"]):
            return {
                "should_activate": True,
                "trigger_type": "keyword_intent",
                "intent_type": "MEASUREMENT_REQUEST",
                "proactive_message": "Потрібен виїзд замірника? 📐 Мастер приїде безкоштовно з валізою зразків тканин у зручний час!",
                "suggested_actions": ["📐 Викликати майстра", "📹 Інструкція замеру"],
                "priority": "P1_HIGH"
            }
        elif any(term in kw for term in ["нестандарт", "панорам", "3800", "больш"]):
            return {
                "should_activate": True,
                "trigger_type": "keyword_intent",
                "intent_type": "CUSTOM_SIZE",
                "proactive_message": "Потрібна штора під нестандартне вікно? 🏢 Для габаритів понад 2200 мм у нас є моторизовані посилені вали Louvolite!",
                "suggested_actions": ["👨‍🔧 Консультація технолога", "📐 Розрахунок прогибу"],
                "priority": "P1_HIGH"
            }

    config = TRIGGER_CONFIGS.get(t_type, TRIGGER_CONFIGS["time_on_page"])
    res = dict(config)
    res["trigger_type"] = t_type
    return res
