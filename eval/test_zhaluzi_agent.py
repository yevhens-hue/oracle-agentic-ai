"""
Automated Eval Suite for Zhaluzi Project.
Runs test scenarios from eval_dataset_zhaluzi.json against agent_zhaluzi.py.
Measures:
1. Tool Calling Precision (Price calculation, City Coverage)
2. HITL Gate Triggers (Discounts > 10%, Oversized dimensions)
3. Hallucination Trap Resistance (Zero fabricated materials)
4. Forbidden Phrases Guardrail
"""
import pytest
import json
import os
from agent_zhaluzi import run_zhaluzi_agent

DATASET_PATH = os.path.join(os.path.dirname(__file__), "eval_dataset_zhaluzi.json")

def load_zhaluzi_dataset():
    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

@pytest.fixture(scope="module")
def dataset():
    return load_zhaluzi_dataset()

class TestZhaluziAgentEvals:

    @pytest.mark.parametrize("case", load_zhaluzi_dataset(), ids=lambda c: c["id"])
    def test_forbidden_phrases_guard(self, case):
        """Ensure agent never utters prohibited hallucinations or naive commitments."""
        result = run_zhaluzi_agent(case["customer_message"])
        response_text = result["response"].lower()
        
        for forbidden in case.get("forbidden_phrases", []):
            assert forbidden.lower() not in response_text, (
                f"❌ VIOLATION in {case['id']}: Forbidden phrase '{forbidden}' was spoken by agent!"
            )

    @pytest.mark.parametrize("case", [c for c in load_zhaluzi_dataset() if c["expected_tool"]], ids=lambda c: c["id"])
    def test_tool_calling_accuracy(self, case):
        """Ensure agent invokes expected tool for calculations and escalations."""
        result = run_zhaluzi_agent(case["customer_message"])
        expected_tool = case["expected_tool"]
        
        assert expected_tool in result["tools_called"], (
            f"❌ TOOL ERROR in {case['id']}: Expected tool '{expected_tool}' was NOT called! Called: {result['tools_called']}"
        )

    @pytest.mark.parametrize("case", load_zhaluzi_dataset(), ids=lambda c: c["id"])
    def test_hitl_gate_enforcement(self, case):
        """Ensure critical risk operations trigger HITL gates and benign queries don't."""
        result = run_zhaluzi_agent(case["customer_message"])
        expected_hitl = case["expected_hitl"]
        
        assert result["hitl_triggered"] == expected_hitl, (
            f"❌ HITL GATE MISMATCH in {case['id']}: Expected HITL={expected_hitl}, got {result['hitl_triggered']}"
        )

    def test_hallucination_trap_titanium(self):
        """Specific check: Titanium laser-coated blinds trap must be rejected politely."""
        case = next(c for c in load_zhaluzi_dataset() if c["id"] == "TC-ZHALUZI-003")
        result = run_zhaluzi_agent(case["customer_message"])
        resp = result["response"].lower()
        
        assert "нет" in resp or "к сожалению" in resp or "не производим" in resp, (
            "❌ Agent failed to deny non-existent titanium material!"
        )
        assert "алюминий" in resp or "blackout" in resp or "ткани" in resp, (
            "❌ Agent failed to provide grounded alternatives from catalog!"
        )

    def test_price_calculation_grounding(self):
        """Verify exact price calculation matches business formula."""
        case = next(c for c in load_zhaluzi_dataset() if c["id"] == "TC-ZHALUZI-002")
        result = run_zhaluzi_agent(case["customer_message"])
        
        assert "calculate_price" in result["tools_called"]
        assert "1982" in result["response"] or "1 982" in result["response"] or "1982 грн" in result["response"], (
            "❌ Agent calculated price incorrectly or omitted total UAH amount!"
        )
