# 🧪 Eval Harness — Support Triage Agent

Automated evaluation suite for the **Support Triage Multi-Agent System** (see `../blueprints/SAMPLE_BLUEPRINT_SUPPORT_TRIAGE.md`).

## Architecture

```
eval/
├── eval_dataset.json       # 10 test scenarios (billing, P1, GDPR, hallucination trap)
├── agent_mock.py           # Support Triage Agent (OpenAI gpt-4o-mini wrapper)
├── test_support_triage.py  # pytest + DeepEval test suite (5 metric groups)
├── conftest.py             # pytest config + summary reporter
└── requirements.txt        # Python dependencies
```

## Metrics Measured

| Group | Metric | Threshold | Why It Matters |
|---|---|---|---|
| Answer Relevancy | DeepEval AnswerRelevancyMetric | ≥ 0.7 | Response must be on-topic |
| Faithfulness | DeepEval FaithfulnessMetric | ≥ 0.7 | No fabricated facts |
| Hallucination Guard | DeepEval HallucinationMetric | ≤ 0.2 | Trap: non-existent tier |
| HITL Accuracy | Binary pass/fail | 100% | Safety-critical escalations |
| Token Economics | Cost per ticket | ≤ $0.025 | vs $6-$15 manual baseline |
| Forbidden Phrases | String match | 0 violations | No "I don't know" on solved issues |

## Setup

```bash
# 1. Install dependencies
pip install -r eval/requirements.txt

# 2. Set your OpenAI API key
export OPENAI_API_KEY=sk-...

# 3. Run full eval suite
cd oracle-agentic-ai
pytest eval/test_support_triage.py -v --tb=short

# Run specific test group
pytest eval/test_support_triage.py -v -k "hallucination"
pytest eval/test_support_triage.py -v -k "HITL"
pytest eval/test_support_triage.py -v -k "cost"
```

## Example Output

```
AGENT EVAL HARNESS — SUMMARY
============================================================
  Total Tests : 22
  ✅ Passed   : 21
  ❌ Failed   : 1
  Pass Rate   : 95.5%
============================================================
  Blueprint: SAMPLE_BLUEPRINT_SUPPORT_TRIAGE.md
  Metrics: Relevancy | Faithfulness | Hallucination | HITL | Cost
============================================================

📊 Token Economics Report:
   Total cost (10 tickets): $0.0018
   Average cost per ticket: $0.00018
   Blueprint threshold:     $0.025
   vs Manual baseline:      $6.00-$15.00
```

## Test Scenarios

| ID | Category | Priority | HITL | Hallucination Trap |
|---|---|---|---|---|
| TC-001 | Billing (duplicate charge) | P3 | ❌ Auto | No |
| TC-002 | Technical (iOS crash) | P3 | ❌ Auto | No |
| TC-003 | Refund $599 | P2 | ✅ Finance Lead | No |
| TC-004 | P1 Enterprise Outage | P1 | ✅ On-Call | No |
| TC-005 | GDPR Account Deletion | P2 | ✅ SecOps | No |
| TC-006 | Support Hours Inquiry | P4 | ❌ Auto | No |
| TC-007 | Dark Mode Feature Request | P4 | ❌ Auto | No |
| TC-008 | Post-cancellation Charge | P3 | ❌ Auto | No |
| TC-009 | Account Compromised | P1 | ✅ SecOps | No |
| TC-010 | Non-existent Tier Query | P3 | ❌ Auto | **YES** |
