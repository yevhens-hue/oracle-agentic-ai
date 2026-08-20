---
name: agent-tool-governance
description: Enterprise Safety Governance for AI Agent Tool Execution. Covers strict JSON Schema validation, rate-limiting, risk scoring (Low/Medium/High/Critical), human-in-the-loop (HITL) approval gates for sensitive side-effects ($500+ transfers, DB deletes), and idempotency keys.
---

# 🛡️ Enterprise AI Agent Tool Governance & Policy Enforcement

Autonomous agents executing tools can introduce critical side-effects (database mutations, API calls, financial transfers, email dispatches). **Tool Governance** enforces runtime policy checks before tools are executed.

---

## 🚦 Tool Risk Classification Matrix

```
       ┌─────────────────────────────────────────────────────────────┐
       │                Agent Tool Call Request                      │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                                      ▼
                        [Tool Risk Classifier]
                                      │
       ┌─────────────────┬────────────┴────┬─────────────────┐
       ▼                 ▼                 ▼                 ▼
  [LOW RISK]       [MEDIUM RISK]      [HIGH RISK]       [CRITICAL RISK]
  (Read-only)      (Transient State)  (Financial/Email) (Delete/Schema)
       │                 │                 │                 │
       ▼                 ▼                 ▼                 ▼
 [AUTO-EXECUTE]    [RATE-LIMITED]   [REQUIRES HITL]   [SYSTEM BLOCKED]
```

| Risk Tier | Examples | Action Policy |
| :--- | :--- | :--- |
| **Low Risk** | `get_user_profile`, `search_knowledge_base`, `calculate_quote` | Auto-execute immediately |
| **Medium Risk** | `update_draft_notes`, `send_slack_notification` | Rate-limited (Max 10/min) |
| **High Risk** | `process_payout` ($500+), `dispatch_email_campaign` | **Human-in-the-Loop (HITL) Gate** |
| **Critical Risk** | `drop_database_table`, `revoke_iam_admin_role` | Blocked unconditionally |

---

## 1. Human-In-The-Loop (HITL) Approval Gate Architecture

```python
import uuid
import time
from pydantic import BaseModel, Field

class ToolCallRequest(BaseModel):
    call_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    tool_name: str
    args: dict
    financial_value_usd: float = 0.0

class ToolGovernanceEngine:
    def __init__(self, hitl_threshold_usd: float = 500.00):
        self.hitl_threshold_usd = hitl_threshold_usd
        self.pending_approvals = {}

    def evaluate_tool_call(self, request: ToolCallRequest) -> dict:
        # 1. Critical Blacklist Check
        if request.tool_name in ["drop_table", "delete_all_users", "format_disk"]:
            return {"status": "DENIED", "reason": "Security violation: Blacklisted critical tool."}

        # 2. Financial Approval Gate
        if request.financial_value_usd >= self.hitl_threshold_usd or request.tool_name == "process_payout":
            self.pending_approvals[request.call_id] = request
            return {
                "status": "PENDING_APPROVAL",
                "call_id": request.call_id,
                "message": f"Tool '{request.tool_name}' requires human approval (${request.financial_value_usd:.2f} >= ${self.hitl_threshold_usd:.2f})."
            }

        # 3. Approved for Auto-Execution
        return {"status": "APPROVED", "call_id": request.call_id}
```

---

## 2. Idempotency Key Enforcement

Prevent duplicate execution of non-idempotent tool calls caused by LLM retry loops:

$$\text{Idempotency Key} = \text{SHA256}(\text{Session ID} + \text{Tool Name} + \text{Canonical JSON Args})$$

```python
import hashlib
import json

def generate_tool_idempotency_key(session_id: str, tool_name: str, args: dict) -> str:
    canonical_json = json.dumps(args, sort_keys=True)
    raw_payload = f"{session_id}:{tool_name}:{canonical_json}"
    return hashlib.sha256(raw_payload.encode("utf-8")).hexdigest()
```
