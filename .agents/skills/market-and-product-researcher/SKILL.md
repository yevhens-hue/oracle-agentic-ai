---
name: market-and-product-researcher
description: Autonomous Market & Product Research Engine using GPT Researcher, Python 3.11, DuckDuckGo retrieval, and Mermaid architectural diagrams. Use when conducting competitive analysis, benchmarking MarTech/SaaS products (like Adsy/MarketZen), analyzing GEO/AIO trends, or generating R&D strategic roadmaps.
---

# Market & Product Research Engine

## Overview
This skill provides an automated, end-to-end framework for conducting deep-dive market research, competitive benchmarking, GEO (Generative Engine Optimization) analysis, and strategic product R&D roadmaps using `gpt-researcher` and Python 3.11.

## Key Capabilities
- **Autonomous Multi-Source Web Scanning**: Executes 30+ web search queries via DuckDuckGo without requiring paid search API keys.
- **Competitor Benchmarking Matrix**: Scores platforms across Inventory Scale, Data Transparency, Pricing Models, and AI Maturity.
- **Visual Mermaid Architecture Diagrams**: Automatically generates Quadrant Charts, Flowcharts, and Monetization Funnels.
- **Timestamped Archiving**: Saves both main report (`marketzen_rd_report.md`) and timestamped historical copies in `reports/`.

## Quick Start Workflow

### 1. Environment Verification
Ensure Python 3.11 `.venv` is active and `OPENAI_API_KEY` is exported:
```bash
export OPENAI_API_KEY="sk-proj-your-openai-api-key"
os.environ["RETRIEVER"] = "duckduckgo"
```

### 2. Execution
Run the automated research script:
```bash
.venv/bin/python3 .agents/skills/market-and-product-researcher/scripts/run_research.py
```

### 3. Report Output Structure
Reports are formatted in Markdown with embedded Mermaid.js diagrams:
- **Executive Summary**: Core market shifts & findings.
- **Direct Competitor Matrix**: Comparison table of key market players.
- **Next-Gen Trends (AIO & GEO)**: Visibility in ChatGPT, Perplexity, Claude, Google AI Overviews.
- **Monetization & Business Models**: Transition from Pay-per-link/Commission to Hybrid SaaS + Transaction Fees.
- **Pain Points & Bottlenecks**: Spam/PBN detection, link decay, editorial latency.
- **Strategic R&D Roadmap**: Technical recommendations & architectural diagrams.

## Customizing Research Queries
To research a new product or domain, update `RESEARCH_QUERY` in `scripts/run_research.py`:
```python
RESEARCH_QUERY = """
Conduct a comprehensive market research for [Product Name / Domain].
Focus areas:
1. Core Competitors
2. Emerging Trends
3. Monetization Models
4. Customer Pain Points
5. Strategic R&D Recommendations
"""
```
