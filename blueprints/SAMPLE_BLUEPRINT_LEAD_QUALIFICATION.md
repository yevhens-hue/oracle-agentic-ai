# 🏗️ Architecture Blueprint — Lead Qualification Multi-Agent System
**Sample Deliverable | Agentic AI Architecture Blueprint (Tier B)**
*Prepared by: Yevhen Shaforostov | Oracle Certified Agentic AI Foundations 2026*

> ⚠️ **Note:** Client name and domain-specific data have been redacted for portfolio use.

---

## 📋 Executive Summary

| Parameter | Value |
|---|---|
| **Use Case** | Automated B2B Lead Qualification & CRM Enrichment |
| **Agent Pattern** | Sequential Pipeline with Manager Coordination |
| **Framework** | LangChain LCEL + OpenAI Agents SDK |
| **Memory** | Long-Term ICP Profile Store + Session scratchpad |
| **RAG** | ICP Matching via Hybrid Vector Search |
| **HITL Gates** | 1 gate — High-Value Lead (ICP Score > 85) review before outreach |
| **MCP Integration** | HubSpot MCP Server (SSE transport) |
| **Estimated Cost** | ~$0.12–$0.35 per qualified lead |
| **Expected ROI** | 8–12× faster qualification vs manual SDR process |

---

## 🗺️ System Architecture Diagram

```mermaid
flowchart TD
    subgraph SOURCES["📥 Lead Input Sources"]
        S1(["📋 CSV / Google Sheet\nInbound list"])
        S2(["🌐 Website Form\nInbound signup"])
        S3(["🔍 Outbound Trigger\nJob board / Signal"])
    end

    subgraph ORCHESTRATOR["🧠 Lead Qualification Manager"]
        MGR["🤖 Manager Agent\n──────────────────\n• Receives raw lead data\n• Coordinates pipeline\n• Decides: qualify / disqualify / HITL\n• Writes final verdict to CRM"]
    end

    subgraph PIPELINE["⚙️ Specialist Agent Pipeline"]
        direction TB
        ENR["🔎 Enrichment Agent\n──────────────────\n• Resolves company domain\n• Fetches firmographics\n  (size, industry, tech stack)\n• Finds decision-maker contacts\n• LinkedIn + Apollo lookup"]

        SCR["🏆 Scoring Agent\n──────────────────\n• Applies ICP criteria\n  (size, revenue, tech stack)\n• Computes ICP Match Score\n• Computes Intent Score\n• Outputs: HOT / WARM / COLD"]

        MSG["✍️ Message Crafter Agent\n──────────────────\n• Retrieves ICP pain points\n  from RAG knowledge base\n• Writes personalised\n  outreach email / LinkedIn DM\n• Self-reviews tone & clarity"]
    end

    subgraph MEMORY["🧩 Memory Layer"]
        ICP[("📂 ICP Profile Store\nLong-Term Memory\n─────────────────\nIdeal Customer Profiles\nWon deals patterns\nLost deals patterns\nBuyer personas")]
        SCRATCH["⚡ Session Scratchpad\nShort-Term Memory\n─────────────────\nCurrent lead context\nEnrichment results\nScore breakdown"]
    end

    subgraph RAG_STACK["🔍 ICP Matching — Hybrid RAG"]
        VDB[("🟣 Vector DB\npgvector / Pinecone\nICP embeddings\nWon deal narratives")]
        BM25[("📄 BM25 Index\nIndustry keywords\nTech stack terms\nRole titles")]
        RRF["🔀 RRF Re-ranker\nMerged ICP match\nTop-3 profiles"]
    end

    subgraph TOOLS["🛠️ Tool Layer"]
        T1["🔍 apollo_enrich_company\n(REST API Tool)"]
        T2["👤 linkedin_get_profile\n(Scraper Tool)"]
        T3["📊 score_against_icp\n(RAG + Rules Tool)"]
        T4["🏢 hubspot_upsert_contact\n(MCP Tool)"]
        T5["📧 send_outreach_email\n(SMTP / Lemlist Tool)"]
        T6["✅ create_hitl_review\n(HITL Tool)"]
    end

    subgraph HITL["🛡️ Human-in-the-Loop Gate"]
        H1{"🎯 ICP Score ≥ 85\nor Deal Value > $10K\n→ SDR Review Required"}
        SDR["👩‍💼 SDR / AE Review\n(Slack card)\nApprove outreach\nor Adjust message"]
    end

    subgraph OUTPUT["📤 Output"]
        O1["🔴 COLD\nDisqualified\nCRM tagged + archived"]
        O2["🟡 WARM\nNurture sequence\nAdded to drip campaign"]
        O3["🟢 HOT (Auto)\nOutreach sent\nCRM deal created"]
        O4["🏆 HOT (HITL)\nSDR-approved outreach\nCRM deal created\nSlack notification"]
    end

    S1 & S2 & S3 --> MGR
    MGR --> ENR
    ENR --> T1 & T2
    T1 & T2 --> |"firmographics + contacts"| ENR
    ENR --> |"enriched profile"| SCRATCH

    MGR --> SCR
    SCR --> T3
    T3 --> VDB & BM25
    VDB & BM25 --> RRF
    RRF --> |"ICP match context"| SCR
    SCR --> |"score + verdict"| MGR

    MGR --> ICP & SCRATCH
    ICP --> MSG

    MGR --> |"WARM / COLD"| MSG
    MSG --> |"draft message"| MGR

    MGR --> |"ICP ≥ 85 or Value > $10K"| H1
    H1 --> SDR
    SDR --> |"Approved"| O4
    SDR --> |"Rejected → downgrade"| O2

    MGR --> |"COLD"| O1
    MGR --> |"WARM"| O2
    MGR --> |"HOT score < 85"| O3
    MGR --> T4 & T5 & T6
```

---

## 🔄 Sequence Diagram — Lead Qualification ReAct Loop

```mermaid
sequenceDiagram
    actor SDR as SDR / Sales Ops
    participant MGR as Manager Agent
    participant ENR as Enrichment Agent
    participant SCR as Scoring Agent
    participant MSG as Message Crafter Agent
    participant KB as ICP Knowledge Base
    participant HS as HubSpot MCP Server
    participant SLK as Slack HITL

    SDR->>MGR: new_lead({name: "Alex Chen", company: "Acme Corp", email: "..."})
    MGR->>ENR: Handoff → enrich(company="Acme Corp")

    Note over ENR: Thought: I need firmographics and decision-maker data
    ENR->>ENR: apollo_enrich_company("acmecorp.com")
    Note over ENR: Observe: 250 employees, $28M ARR, SaaS, uses Salesforce + Segment
    ENR->>ENR: linkedin_get_profile("Alex Chen, Acme Corp")
    Note over ENR: Observe: VP of Operations, 7 years exp, ex-HubSpot
    ENR-->>MGR: enriched_profile (complete)

    MGR->>SCR: Handoff → score(profile=enriched_profile)
    Note over SCR: Thought: Score against ICP criteria
    SCR->>KB: score_against_icp(profile, top_k=3)
    KB-->>SCR: [ICP_match_1: 0.91, ICP_match_2: 0.87, ICP_match_3: 0.79]

    Note over SCR: Compute: firmographic_score=88, intent_score=74, final=83
    SCR-->>MGR: {verdict: "HOT", icp_score: 83, deal_est: "$8,400"}

    MGR->>MSG: Handoff → craft_message(profile, icp_context)
    Note over MSG: Thought: Pull pain points for Ops VP at mid-market SaaS
    MSG->>KB: search_knowledge_base("VP Operations SaaS pain points 2024")
    KB-->>MSG: [chunk: "manual reporting overhead", "cross-team visibility", "tool sprawl"]
    Note over MSG: Draft personalised LinkedIn DM referencing Segment integration pain
    Note over MSG: Self-check: tone=professional, length=OK, personalisation=high ✅
    MSG-->>MGR: outreach_draft (approved)

    MGR->>HS: hubspot_upsert_contact(lead_data, score=83, deal_stage="Qualified")
    Note over MGR: ICP score = 83 < 85 threshold → auto-send
    MGR->>MSG: send_outreach_email(draft, recipient=alex@acmecorp.com)
    MGR-->>SDR: ✅ Lead qualified & outreach sent. CRM updated.
```

---

## 📋 Framework Selection — ADR-001

**Decision:** LangChain LCEL for pipeline orchestration + OpenAI Agents SDK for specialist agents.

| Framework | Sequential Pipeline | Tool Calling | Streaming | Memory Support | MCP Ready | Verdict |
|---|---|---|---|---|---|---|
| **LangChain LCEL** | ✅ Native (`\|` pipe) | ✅ | ✅ | ✅ | ✅ | ✅ **Orchestration layer** |
| **OpenAI Agents SDK** | ⚠️ Handoffs | ✅ Native | ✅ | ✅ | ✅ | ✅ **Specialist agents** |
| CrewAI | ✅ Sequential | ✅ | ❌ | ⚠️ | ❌ | ❌ No MCP |
| LangGraph | ✅ Graph | ✅ | ✅ | ✅ | ⚠️ | Runner-up — added complexity |

**Rationale:**
- LCEL's pipe operator (`prompt | model | parser`) is perfect for the linear Enrich → Score → Message pipeline.
- OpenAI Agents SDK's `handoff_description` enables declarative routing within each specialist agent.
- HubSpot MCP Server (official, SSE transport) eliminates custom REST wrapper code.

---

## 🛠️ Tool Definition Schemas

### Tool 1: `apollo_enrich_company`
```json
{
  "name": "apollo_enrich_company",
  "description": "Fetches firmographic data for a company using Apollo.io API. Use this as the FIRST enrichment step for any new lead. Returns: employee count, revenue estimate, industry, tech stack, funding stage, and key decision-maker contacts. Do NOT call linkedin_get_profile before calling this tool.",
  "parameters": {
    "type": "object",
    "properties": {
      "company_domain": {
        "type": "string",
        "description": "Company website domain (e.g. 'acmecorp.com'). Extract from email if not explicitly provided."
      },
      "desired_roles": {
        "type": "array",
        "items": { "type": "string" },
        "description": "List of decision-maker roles to search for (e.g. ['VP Operations', 'Head of Engineering', 'CTO'])",
        "default": ["CEO", "CTO", "VP Engineering", "Head of Product"]
      }
    },
    "required": ["company_domain"]
  }
}
```

### Tool 2: `score_against_icp`
```json
{
  "name": "score_against_icp",
  "description": "Computes an ICP (Ideal Customer Profile) match score for an enriched lead profile using hybrid vector search against historical won deals and defined ICP criteria. Returns a score from 0–100 and a verdict (HOT/WARM/COLD). Always call this AFTER apollo_enrich_company has returned results.",
  "parameters": {
    "type": "object",
    "properties": {
      "company_profile": {
        "type": "object",
        "description": "The enriched company profile object from apollo_enrich_company",
        "properties": {
          "employees": { "type": "integer" },
          "revenue_estimate_usd": { "type": "number" },
          "industry": { "type": "string" },
          "tech_stack": { "type": "array", "items": { "type": "string" } },
          "funding_stage": { "type": "string" }
        }
      },
      "contact_role": {
        "type": "string",
        "description": "The job title of the primary contact being evaluated"
      }
    },
    "required": ["company_profile", "contact_role"]
  }
}
```

### Tool 3: `hubspot_upsert_contact`
```json
{
  "name": "hubspot_upsert_contact",
  "description": "Creates or updates a contact and associated deal in HubSpot CRM. Call this AFTER scoring is complete and a verdict has been determined. Always include the icp_score and agent_verdict fields so sales reps have full context on why this lead was qualified.",
  "parameters": {
    "type": "object",
    "properties": {
      "email": { "type": "string" },
      "firstname": { "type": "string" },
      "lastname": { "type": "string" },
      "company": { "type": "string" },
      "icp_score": {
        "type": "integer",
        "description": "0–100 ICP match score from score_against_icp"
      },
      "agent_verdict": {
        "type": "string",
        "enum": ["HOT", "WARM", "COLD"],
        "description": "The Scoring Agent's qualification verdict"
      },
      "deal_stage": {
        "type": "string",
        "enum": ["Prospect", "Qualified", "Nurture", "Disqualified"],
        "description": "HubSpot pipeline stage to set for this contact"
      },
      "estimated_deal_value_usd": {
        "type": "number",
        "description": "Estimated deal size in USD based on company profile"
      }
    },
    "required": ["email", "company", "icp_score", "agent_verdict", "deal_stage"]
  }
}
```

### Tool 4: `create_hitl_review`
```json
{
  "name": "create_hitl_review",
  "description": "Sends a Slack approval card to the assigned SDR/AE for high-value leads. MUST be called when: (1) ICP score >= 85, OR (2) estimated deal value > $10,000. Do NOT send outreach email before this tool returns an 'approved' status for these leads.",
  "parameters": {
    "type": "object",
    "properties": {
      "lead_summary": {
        "type": "object",
        "properties": {
          "contact_name": { "type": "string" },
          "company": { "type": "string" },
          "role": { "type": "string" },
          "icp_score": { "type": "integer" },
          "estimated_deal_usd": { "type": "number" }
        }
      },
      "proposed_outreach_draft": {
        "type": "string",
        "description": "The Message Crafter Agent's draft outreach message for SDR review"
      },
      "assignee_slack_id": {
        "type": "string",
        "description": "Slack user ID of the SDR/AE responsible for this lead"
      }
    },
    "required": ["lead_summary", "proposed_outreach_draft", "assignee_slack_id"]
  }
}
```

---

## 🎯 ICP Scoring Matrix

| Criterion | Weight | Ideal Value | Scoring Rule |
|---|---|---|---|
| **Company Size** | 25% | 50–500 employees | 100pts if in range; -20 per 100 outside |
| **Industry Match** | 20% | SaaS / FinTech / Ops-heavy | 100 if exact; 60 if adjacent; 0 if mismatch |
| **Tech Stack Fit** | 20% | Uses Salesforce / HubSpot / Segment | +20pts per matching tool (max 100) |
| **Contact Seniority** | 20% | VP / Director / C-Level | VP/Director=100; Manager=60; IC=20 |
| **Intent Signals** | 15% | Hiring AI/Ops roles, recent funding | +15pts per detected signal (max 100) |

**Verdict Thresholds:**
- **HOT:** Score ≥ 75
- **WARM:** Score 45–74
- **COLD:** Score < 45

---

## 🛡️ HITL Policy

| Trigger | Risk | Gate | Timeout | Assignee |
|---|---|---|---|---|
| ICP Score ≥ 85 | 🟠 High-value opportunity | Slack card with draft preview | 4 hours → SDR notified again | Assigned SDR |
| Deal est. > $10,000 | 🟠 Enterprise opportunity | Slack card + CRM flag | 8 hours → Manager notified | AE + Sales Manager |
| Contact = C-Level | 🟡 Reputation risk | SDR must personalise | 2 hours → draft sent unchanged | Assigned SDR |
| Bounce / Invalid email | 🟡 Data quality | Auto-flag, no outreach | N/A — human resolves | Ops team |

---

## 💰 Token Economics Estimate

| Lead Type | Input Tokens | Output Tokens | Model | Cost / Lead |
|---|---|---|---|---|
| COLD (disqualified early) | ~800 | ~150 | gpt-4o-mini | **~$0.002** |
| WARM (scored + nurture) | ~3,200 | ~600 | gpt-4o-mini | **~$0.008** |
| HOT (full pipeline) | ~5,500 | ~1,200 | gpt-4o | **~$0.082** |
| HOT + HITL review | ~6,000 | ~1,400 | gpt-4o | **~$0.095** |

**Blended estimate** (40% COLD, 40% WARM, 20% HOT):
> **~$0.022 per lead processed** — vs $25–$80 per qualified lead for manual SDR time.

**Semantic caching:** Top 20% repeated company enrichment queries cached in Redis → saves ~35% on enrichment API calls.

---

## 🚀 Implementation Roadmap

```
Week 1 (Setup & Enrichment Layer):
  ├── Configure Apollo.io API + LinkedIn scraper (legal check)
  ├── Build Enrichment Agent with apollo_enrich_company tool
  ├── Set up pgvector ICP Profile Store + load historical won/lost deals
  └── Deploy HubSpot MCP Server (SSE transport)

Week 2 (Scoring & Messaging Layer):
  ├── Build Scoring Agent + ICP scoring matrix rules
  ├── Implement Hybrid Search for ICP matching (Dense + BM25 + RRF)
  ├── Build Message Crafter Agent with Self-Reflection loop
  └── Wire HITL Slack card (Block Kit) with approve/reject callbacks

Week 3 (Integration & Eval):
  ├── End-to-end pipeline test: 50 real leads from client's historical data
  ├── Eval: compare agent scores vs SDR historical verdicts (agreement rate target: ≥ 80%)
  ├── Tune ICP scoring weights based on calibration results
  └── Load test + handoff documentation
```

---

*Document version: 1.0 | Prepared: August 2026*
*Oracle Certified Agentic AI Foundations Associate (1Z0-1157-26)*
