---
name: autonomous-agent-evals
description: Eval-Driven Development (EDD) & Continuous Evaluation for AI Agents. Framework for unit testing agent trajectories, measuring tool-calling precision/recall, evaluating hallucination rates with LLM-as-a-Judge, and benchmarking cost-per-task.
---

# 📊 Autonomous Agent Evals & Quality Benchmarking

Eval-Driven Development (EDD) replaces subjective prompt testing with automated quantitative evaluation metrics across agent execution trajectories.

---

## 📐 Core Evaluation Metrics

| Metric | Target | Formula / Scoring Method |
| :--- | :--- | :--- |
| **Goal Completion Rate (GCR)** | $> 90\%$ | $\frac{\text{Successful Trajectories}}{\text{Total Evaluation Runs}}$ |
| **Tool Selection Precision** | $> 95\%$ | $\frac{\text{Correct Tool Calls}}{\text{Total Tool Calls Initiated}}$ |
| **Hallucination Index** | $< 2\%$ | LLM-as-a-Judge binary check against reference context |
| **Mean Cost Per Goal (CPG)** | Budgeted | $\sum (\text{Input Tokens} \times C_{\text{in}} + \text{Output Tokens} \times C_{\text{out}})$ |
| **Trajectory Efficiency** | $\le 5$ turns | Number of Agent Loop steps required to resolve goal |

---

## 1. Defining Trajectory Eval Datasets

```python
from pydantic import BaseModel
from typing import List

class AgentTestCase(BaseModel):
    id: str
    user_prompt: str
    expected_tools: List[str]
    expected_sql_keywords: List[str] = []
    expected_final_contains: List[str]

eval_dataset: List[AgentTestCase] = [
    AgentTestCase(
        id="eval_001_billing",
        user_prompt="What was customer ACME Corp's total invoice spend in Q2 2026?",
        expected_tools=["execute_sql_query"],
        expected_sql_keywords=["SUM", "invoices", "ACME Corp"],
        expected_final_contains=["$"]
    )
]
```

---

## 2. LLM-as-a-Judge Auditor Pattern

Use a stronger reasoning model (e.g. Claude 3.5 Sonnet / GPT-4o) as an independent QA auditor to grade agent output against ground truth facts:

```python
def evaluate_trajectory_faithfulness(user_prompt: str, context: str, agent_answer: str) -> dict:
    judge_prompt = f"""
    You are an impartial Quality Assurance Auditor.
    Evaluate whether the Agent Answer is strictly faithful to the provided Context without introducing ungrounded facts or hallucinations.

    User Prompt: {user_prompt}
    Context: {context}
    Agent Answer: {agent_answer}

    Output JSON strictly in the following format:
    {{
        "faithful": true | false,
        "hallucination_detected": true | false,
        "reasoning": "Explanation of score"
    }}
    """
    # Execute LLM Judge call and parse JSON
    return {"faithful": True, "hallucination_detected": False, "score": 1.0}
```

---

## 3. CI/CD Integration & Regression Testing

Integrate evals into PyTest to block pull requests if agent accuracy drops below threshold:

```python
import pytest

@pytest.mark.parametrize("test_case", eval_dataset)
def test_agent_trajectory(test_case: AgentTestCase):
    agent_output = run_agent(test_case.user_prompt)
    
    # 1. Assert expected tools were called
    for tool_name in test_case.expected_tools:
        assert tool_name in agent_output.used_tools, f"Agent failed to call tool '{tool_name}'"
        
    # 2. Assert key answers contain expected terms
    for phrase in test_case.expected_final_contains:
        assert phrase in agent_output.text, f"Agent output missing expected phrase '{phrase}'"
```
