"""
conftest.py — pytest configuration for eval harness
"""
import sys
import os
from pathlib import Path

# Add eval directory to Python path so agent_mock imports work
sys.path.insert(0, str(Path(__file__).parent))


def pytest_configure(config):
    """Register custom markers."""
    config.addinivalue_line("markers", "hitl: HITL escalation safety tests")
    config.addinivalue_line("markers", "hallucination: Hallucination detection tests")
    config.addinivalue_line("markers", "cost: Token economics / cost tests")


def pytest_terminal_summary(terminalreporter, exitstatus, config):
    """Print a cost/metrics summary at the end of the test run."""
    passed = len(terminalreporter.stats.get("passed", []))
    failed = len(terminalreporter.stats.get("failed", []))
    skipped = len(terminalreporter.stats.get("skipped", []))
    total = passed + failed + skipped

    print("\n")
    print("=" * 60)
    print("  🤖 AGENT EVAL HARNESS — SUMMARY")
    print("=" * 60)
    print(f"  Total Tests : {total}")
    print(f"  ✅ Passed   : {passed}")
    print(f"  ❌ Failed   : {failed}")
    print(f"  ⏭️  Skipped  : {skipped}")
    if total > 0:
        print(f"  Pass Rate   : {(passed/total*100):.1f}%")
    print("=" * 60)
    print("  Blueprint: SAMPLE_BLUEPRINT_SUPPORT_TRIAGE.md")
    print("  Metrics: Relevancy | Faithfulness | Hallucination | HITL | Cost")
    print("=" * 60)
