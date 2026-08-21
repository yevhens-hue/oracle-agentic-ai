"""
Support Triage Agent Mock
Симулирует работу агента из SAMPLE_BLUEPRINT_SUPPORT_TRIAGE.md.
В production заменяется на реальный LLM pipeline.
"""

import json
import os
from typing import Optional
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

SYSTEM_PROMPT = """You are a Support Triage Agent for an enterprise SaaS company.

Your responsibilities:
1. Classify incoming support tickets by category and priority (P1-P4).
2. Resolve issues automatically using the knowledge base context provided.
3. Escalate to human agents (HITL) when required by policy:
   - P1 emergencies → escalate immediately
   - Financial refunds > $200 → require Finance Lead approval
   - Account deletion / GDPR requests → require SecOps review
   - Security incidents → require SecOps escalation
4. NEVER make up information not present in the knowledge base context.
5. If a product/tier/feature doesn't exist in the context, say so clearly.

Response format: Always include:
- Classification: [category] | Priority: [P1/P2/P3/P4]
- Action: [auto_resolve | escalate_hitl | escalate_p1 | escalate_secops]
- Response to customer: [your response]
"""


class SupportTriageAgent:
    def __init__(self, api_key: Optional[str] = None):
        self.client = OpenAI(api_key=api_key or os.getenv("OPENAI_API_KEY"))
        self.model = "gpt-4o-mini"
        self.token_usage = []

    def process_ticket(self, ticket_text: str, retrieved_context: str) -> dict:
        """
        Process a support ticket with retrieved knowledge base context.
        Returns structured response with action and customer message.
        """
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": f"""
KNOWLEDGE BASE CONTEXT (retrieved via Hybrid RAG):
{retrieved_context}

---
CUSTOMER TICKET:
{ticket_text}

Respond according to your role and the context provided.
""",
            },
        ]

        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.1,  # Low temperature for deterministic triage
            max_tokens=512,
        )

        output_text = response.choices[0].message.content

        # Track token usage for cost reporting
        self.token_usage.append(
            {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens,
                "cost_usd": self._calculate_cost(
                    response.usage.prompt_tokens, response.usage.completion_tokens
                ),
            }
        )

        return {
            "raw_response": output_text,
            "requires_hitl": self._detect_hitl(output_text),
            "detected_action": self._detect_action(output_text),
            "token_usage": self.token_usage[-1],
        }

    def _detect_hitl(self, response: str) -> bool:
        hitl_signals = ["escalate", "human", "approval", "review", "team"]
        response_lower = response.lower()
        return any(signal in response_lower for signal in hitl_signals)

    def _detect_action(self, response: str) -> str:
        response_lower = response.lower()
        if "p1" in response_lower and "escalat" in response_lower:
            return "escalate_p1"
        if "secops" in response_lower or "security team" in response_lower:
            return "escalate_secops"
        if "escalat" in response_lower or "hitl" in response_lower or "approval" in response_lower:
            return "escalate_hitl"
        return "auto_resolve"

    def _calculate_cost(self, prompt_tokens: int, completion_tokens: int) -> float:
        # gpt-4o-mini pricing: $0.15/1M input, $0.60/1M output
        input_cost = (prompt_tokens / 1_000_000) * 0.15
        output_cost = (completion_tokens / 1_000_000) * 0.60
        return round(input_cost + output_cost, 6)

    def get_total_cost(self) -> float:
        return round(sum(t["cost_usd"] for t in self.token_usage), 4)

    def get_avg_cost_per_ticket(self) -> float:
        if not self.token_usage:
            return 0
        return round(self.get_total_cost() / len(self.token_usage), 5)
