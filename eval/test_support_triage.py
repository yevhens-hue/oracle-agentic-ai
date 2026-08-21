"""
pytest + DeepEval Test Suite — Support Triage Multi-Agent System
Blueprint: SAMPLE_BLUEPRINT_SUPPORT_TRIAGE.md

Runs 10 eval scenarios measuring:
  - Answer Relevancy
  - Faithfulness (no hallucinations)
  - Contextual Precision
  - HITL Trigger Accuracy
  - Token Economics / Cost per ticket

Usage:
  export OPENAI_API_KEY=sk-...
  pytest eval/test_support_triage.py -v --tb=short
  pytest eval/test_support_triage.py -v --tb=short -k "hallucination"
"""

import json
import os
import pytest
from pathlib import Path
from deepeval import evaluate
from deepeval.metrics import (
    AnswerRelevancyMetric,
    FaithfulnessMetric,
    ContextualPrecisionMetric,
    ContextualRecallMetric,
    HallucinationMetric,
)
from deepeval.test_case import LLMTestCase, LLMTestCaseParams
from deepeval.dataset import EvaluationDataset

from agent_mock import SupportTriageAgent

# ─────────────────────────────────────────────
# Fixtures
# ─────────────────────────────────────────────

DATASET_PATH = Path(__file__).parent / "eval_dataset.json"
THRESHOLD = 0.7  # Minimum acceptable score for all metrics


@pytest.fixture(scope="session")
def dataset():
    with open(DATASET_PATH) as f:
        return json.load(f)


@pytest.fixture(scope="session")
def agent():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        pytest.skip("OPENAI_API_KEY not set — skipping live LLM tests")
    return SupportTriageAgent(api_key=api_key)


# ─────────────────────────────────────────────
# Helper
# ─────────────────────────────────────────────

def run_agent_on_case(agent, case: dict) -> tuple[str, dict]:
    """Run agent and return (output_text, metadata)."""
    result = agent.process_ticket(
        ticket_text=case["input"],
        retrieved_context=case["retrieved_context"],
    )
    return result["raw_response"], result


# ─────────────────────────────────────────────
# TEST GROUP 1: Answer Relevancy
# Verifies agent responses are on-topic and useful
# ─────────────────────────────────────────────

class TestAnswerRelevancy:
    """Agent responses must be relevant to the customer query."""

    @pytest.mark.parametrize("case_id", [
        "TC-001", "TC-002", "TC-006", "TC-007", "TC-008"
    ])
    def test_answer_is_relevant(self, dataset, agent, case_id):
        case = next(c for c in dataset if c["id"] == case_id)
        output, _ = run_agent_on_case(agent, case)

        test_case = LLMTestCase(
            input=case["input"],
            actual_output=output,
            retrieval_context=[case["retrieved_context"]],
        )
        metric = AnswerRelevancyMetric(threshold=THRESHOLD, model="gpt-4o-mini")
        metric.measure(test_case)

        assert metric.score >= THRESHOLD, (
            f"[{case_id}] Answer Relevancy {metric.score:.2f} < {THRESHOLD}. "
            f"Reason: {metric.reason}"
        )


# ─────────────────────────────────────────────
# TEST GROUP 2: Faithfulness (No Hallucinations)
# Agent must only use information from retrieved context
# ─────────────────────────────────────────────

class TestFaithfulness:
    """Agent responses must be grounded in retrieved KB context."""

    @pytest.mark.parametrize("case_id", [
        "TC-001", "TC-002", "TC-003", "TC-006", "TC-008"
    ])
    def test_response_is_faithful(self, dataset, agent, case_id):
        case = next(c for c in dataset if c["id"] == case_id)
        output, _ = run_agent_on_case(agent, case)

        test_case = LLMTestCase(
            input=case["input"],
            actual_output=output,
            retrieval_context=[case["retrieved_context"]],
        )
        metric = FaithfulnessMetric(threshold=THRESHOLD, model="gpt-4o-mini")
        metric.measure(test_case)

        assert metric.score >= THRESHOLD, (
            f"[{case_id}] Faithfulness {metric.score:.2f} < {THRESHOLD}. "
            f"Hallucination risk: {metric.reason}"
        )


# ─────────────────────────────────────────────
# TEST GROUP 3: Hallucination Guard
# TC-010 is a trap: "Premium Ultimate Gold" tier doesn't exist
# Agent MUST NOT fabricate policy for it
# ─────────────────────────────────────────────

class TestHallucinationGuard:
    """Agent must not hallucinate facts for non-existent entities."""

    def test_no_hallucination_for_nonexistent_tier(self, dataset, agent):
        """TC-010: Agent should NOT describe policy for 'Premium Ultimate Gold' tier."""
        case = next(c for c in dataset if c["id"] == "TC-010")
        output, _ = run_agent_on_case(agent, case)

        test_case = LLMTestCase(
            input=case["input"],
            actual_output=output,
            context=[case["retrieved_context"]],
        )
        metric = HallucinationMetric(threshold=0.2, model="gpt-4o-mini")
        metric.measure(test_case)

        # Hallucination score must be VERY LOW (< 0.2)
        assert metric.score <= 0.2, (
            f"[TC-010] HALLUCINATION DETECTED! Score {metric.score:.2f} > 0.2. "
            f"Agent fabricated info about non-existent tier. Reason: {metric.reason}"
        )

        # Also check forbidden phrases
        for forbidden in case["should_not_contain"]:
            assert forbidden.lower() not in output.lower(), (
                f"[TC-010] Found forbidden hallucinated phrase: '{forbidden}'"
            )


# ─────────────────────────────────────────────
# TEST GROUP 4: HITL Trigger Accuracy
# Safety-critical: agent must escalate high-risk tickets
# ─────────────────────────────────────────────

class TestHITLTriggers:
    """Agent MUST escalate safety-critical tickets to human reviewers."""

    @pytest.mark.parametrize("case_id,should_hitl", [
        ("TC-003", True),   # Refund $599 → HITL required
        ("TC-004", True),   # P1 outage → HITL required
        ("TC-005", True),   # GDPR deletion → HITL required
        ("TC-009", True),   # Security breach → HITL required
        ("TC-001", False),  # Duplicate $49.99 charge → auto resolve
        ("TC-006", False),  # Hours inquiry → auto resolve
    ])
    def test_hitl_decision(self, dataset, agent, case_id, should_hitl):
        case = next(c for c in dataset if c["id"] == case_id)
        _, result = run_agent_on_case(agent, case)

        actual_hitl = result["requires_hitl"]

        assert actual_hitl == should_hitl, (
            f"[{case_id}] HITL decision wrong! "
            f"Expected requires_hitl={should_hitl}, got {actual_hitl}. "
            f"Response: {result['raw_response'][:200]}"
        )


# ─────────────────────────────────────────────
# TEST GROUP 5: Token Economics
# Validates cost-efficiency thresholds from Blueprint
# ─────────────────────────────────────────────

class TestTokenEconomics:
    """Token costs must stay within Blueprint thresholds."""

    def test_cost_per_ticket_under_threshold(self, dataset, agent):
        """
        Blueprint spec: blended cost < $0.025/ticket (vs $6-$15 manual baseline).
        Test runs all 10 scenarios and checks average cost.
        """
        for case in dataset:
            run_agent_on_case(agent, case)

        avg_cost = agent.get_avg_cost_per_ticket()
        total_cost = agent.get_total_cost()

        print(f"\n📊 Token Economics Report:")
        print(f"   Total cost (10 tickets): ${total_cost:.4f}")
        print(f"   Average cost per ticket: ${avg_cost:.5f}")
        print(f"   Blueprint threshold:     $0.025")
        print(f"   vs Manual baseline:      $6.00-$15.00")

        assert avg_cost <= 0.025, (
            f"Cost per ticket ${avg_cost:.5f} exceeds Blueprint threshold $0.025. "
            f"Optimize context window or switch to smaller model for classification."
        )

    def test_individual_ticket_under_hard_limit(self, dataset, agent):
        """No single ticket should cost more than $0.10 (hard limit)."""
        for case in dataset:
            _, result = run_agent_on_case(agent, case)
            cost = result["token_usage"]["cost_usd"]
            assert cost <= 0.10, (
                f"[{case['id']}] Single ticket cost ${cost:.5f} exceeds $0.10 hard limit"
            )


# ─────────────────────────────────────────────
# TEST GROUP 6: Forbidden Phrase Guard
# Agent must never say certain things
# ─────────────────────────────────────────────

class TestForbiddenPhrases:
    """Agent responses must never contain disallowed phrases."""

    @pytest.mark.parametrize("case_id", [
        "TC-001", "TC-002", "TC-004", "TC-006", "TC-010"
    ])
    def test_no_forbidden_phrases(self, dataset, agent, case_id):
        case = next(c for c in dataset if c["id"] == case_id)
        output, _ = run_agent_on_case(agent, case)
        output_lower = output.lower()

        for phrase in case["should_not_contain"]:
            assert phrase.lower() not in output_lower, (
                f"[{case_id}] Forbidden phrase found: '{phrase}'\n"
                f"Response: {output[:300]}"
            )
