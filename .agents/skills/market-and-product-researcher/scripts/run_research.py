"""
Autonomous Market & Product Research Runner Script.
Executes gpt-researcher deep web analysis, generates R&D report with Mermaid diagrams & archives results.
"""
import os
import asyncio
from pathlib import Path
from datetime import datetime
from gpt_researcher import GPTResearcher

RESEARCH_QUERY = """
Conduct an exhaustive, deep-dive 2026 market research and strategic product R&D report for MarketZen 
and its flagship platform Adsy (Guest Posting & Link Building Marketplace).

Core Investigation Axes:
1. Extended Competitive Matrix & Feature Gap Analysis:
   - Adsy vs Collaborator.pro vs Accessily vs Linkhouse vs PRNEWS.IO vs Postaga vs Pitchbox vs Ahrefs & Semrush link modules.
   - Breakdown of Publisher Inventory, Traffic Verification, Spam Score Detection, Escrow Systems, and Pricing Structures.

2. Next-Gen Search & AI Trends (2026 Paradigm Shift):
   - Generative Engine Optimization (GEO) & Answer Engine Optimization (AEO) across ChatGPT, Perplexity, Claude, and Google AI Overviews.
   - Autonomous Link Outreach & Agentic Content Personalization.

3. Business & Monetization Evolution Roadmap:
   - Transitioning Adsy from pure Pay-Per-Link/Commission to a Hybrid SaaS Subscription + Marketplace Transaction Fee model.
   - Financial projections, LTV/CAC optimization, and advertiser retention strategies.

4. Friction Points & Technical Bottlenecks:
   - PBN & spam site filtering, link decay & indexing drops, slow editorial approval, and compliance with search engine guidelines.

5. Comprehensive R&D Strategic Recommendations for MarketZen:
   - Technical architecture for AI Publisher Vetting Engine.
   - GEO Content Generation & Optimization Suite.
   - Automated Link Health Monitoring System.
"""

MERMAID_DIAGRAMS = """
---

## 📊 Visual Architectural Diagrams & Frameworks

### 1. Competitive Positioning Matrix (2026 Landscape)

```mermaid
quadrantChart
    title Market Positioning: Inventory Scale vs AI Maturity
    x-axis Low Inventory Scale --> High Inventory Scale (100k+ Sites)
    y-axis Basic Automation --> Advanced AI & GEO Engine
    quadrant-1 Market Leaders & Innovators
    quadrant-2 Niche AI Outreach Tools
    quadrant-3 Legacy Transactional Marketplaces
    quadrant-4 Traditional Large Scale Marketplaces
    Adsy (Target State 2026): [0.85, 0.88]
    Adsy (Current 2026): [0.90, 0.45]
    Collaborator.pro: [0.55, 0.50]
    Accessily: [0.60, 0.35]
    Postaga: [0.20, 0.80]
    Pitchbox: [0.25, 0.75]
```

### 2. MarketZen AI Agentic Link Architecture

```mermaid
graph TD
    A[Advertiser Campaign Goal] --> B[Adsy AI Agentic Orchestrator]
    B --> C[AI Publisher Vetting Engine]
    B --> D[GEO Content Generation Suite]
    B --> E[Autonomous Outreach Agent]
    
    C -->|PBN & Spam Filtering| F[Ahrefs/Semrush API + SpamScore AI]
    D -->|Entity & Semantic Optimization| G[LLM GEO Formatter ChatGPT/Perplexity]
    E -->|Automated Pitching| H[Publisher Inbox]
    
    F --> I[Verified Placement]
    G --> I
    H --> I
    
    I --> J[Automated Escrow Payment & Link Health Monitor]
```

### 3. Monetization Evolution (Hybrid SaaS + Marketplace Fee)

```mermaid
graph LR
    Sub1[Free Tier / Pay-Per-Link] -->|Basic Search| Comm[15% Commission Fee]
    Sub2[Pro SaaS $99/mo] -->|AI Publisher Vetting + GEO Suite| Fee1[10% Transaction Fee]
    Sub3[Agency SaaS $299/mo] -->|Autonomous Outreach Agents + White-label| Fee2[5% Transaction Fee]
```
---
"""

async def main():
    print("🚀 Initializing Market & Product Research Engine...")

    api_key = os.environ.get("OPENAI_API_KEY", "")
    if not api_key or "ваш_реальный_ключ" in api_key or any(ord(c) > 127 for c in api_key):
        print("\n❌ Error: Please set a valid OPENAI_API_KEY environment variable!")
        return

    os.environ["RETRIEVER"] = "duckduckgo"

    researcher = GPTResearcher(
        query=RESEARCH_QUERY,
        report_type="detailed_report",
        report_source="web"
    )

    print("🔎 Step 1: Conducting automated web research across multi-sources...")
    await researcher.conduct_research()

    print("📝 Step 2: Synthesizing R&D report with visual diagrams...")
    report = await researcher.write_report()

    full_report = report + "\n\n" + MERMAID_DIAGRAMS

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    workspace_root = Path(__file__).resolve().parents[3]
    output_dir = workspace_root / "reports"
    output_dir.mkdir(exist_ok=True)

    timestamp_file = output_dir / f"marketzen_deep_report_{timestamp}.md"
    main_file = workspace_root / "marketzen_rd_report.md"

    timestamp_file.write_text(full_report, encoding="utf-8")
    main_file.write_text(full_report, encoding="utf-8")

    print(f"\n✅ Research completed successfully!")
    print(f" 📄 Main Report: {main_file}")
    print(f" 📂 Archived Copy: {timestamp_file}")

if __name__ == "__main__":
    asyncio.run(main())
