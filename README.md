# 🤖 Oracle Agentic AI Enterprise Hub & Skill Center

**Official Certification:** Oracle Certified Associate - Agentic AI Foundations (1Z0-1157-26)  
**Candidate ID:** `OC8112637` | **Track ID:** `AAI26OFA`  
**Verified Badge:** [Oracle Share Badge Link](https://catalog-education.oracle.com/ords/certview/sharebadge?id=7CD56C73FBEB10FA1DA49A7ABD0A0D74CB799DBFE3DEE980AF0D8F2403859E2D)  
**Download eCertificate:** [Oracle eCertificate PDF](https://brm-certview.oracle.com/ords/certview/ecertificate?ssn=OC8112637&trackId=AAI26OFA&key=6b86c2675a3b052b00b105568630b3865432eee5)

---

## 🎯 Overview & Project Purpose

This repository serves as a standalone **Antigravity Knowledge Hub, Skill Library, and Service Architecture Blueprint** built directly on top of the **Oracle Cloud Infrastructure (OCI) 2026 Agentic AI Foundations Associate** curriculum and real-world multi-agent engineering patterns.

It consolidates:
1. **Course & Exam Master Guide:** Full 6-module curriculum breakdown + 40 certified practice exam questions.
2. **Bundled Agent Skills (`.agents/skills/`):** 11 production-ready skills for multi-agent topologies, RAG, MCP, and AI governance.
3. **Architecture Blueprints (`blueprints/`):** 3 enterprise-grade sample deliverables covering Support Triage, Lead Qualification, and Document Intelligence use cases.
4. **Productized Services ($750–$7,000+):** B2B Agentic AI Architecture Blueprints ready for Upwork/Djinni Project Catalog.
5. **Public Profile Copies:** Client-tested copy for Upwork, Djinni, and LinkedIn.

---

## 📂 Repository Layout

```
oracle-agentic-ai/
├── README.md                                          # Master repository index (this file)
├── ORACLE_AGENTIC_AI_FOUNDATIONS_MASTER_GUIDE.md     # 6-Module Curriculum + 40 Certified Exam Q&A
├── SESSION_HANDOFF_ORACLE_AGENTIC_AI.md              # Continuity handoff package
├── blueprints/
│   ├── README.md                                      # Blueprint portfolio index & comparison matrix
│   ├── SAMPLE_BLUEPRINT_SUPPORT_TRIAGE.md             # 🎫 Support Triage Multi-Agent System
│   ├── SAMPLE_BLUEPRINT_LEAD_QUALIFICATION.md         # 🏆 Lead Qualification Multi-Agent System
│   ├── SAMPLE_BLUEPRINT_DOCUMENT_INTELLIGENCE.md      # 📄 Document Intelligence Multi-Agent System
│   ├── AGENTIC_AI_SERVICES.md                         # Productized Services Guide ($750–$7,000+)
│   └── UPWORK_LINKEDIN_PROFILES.md                    # Upwork, Djinni & LinkedIn profile copy
└── .agents/
    └── skills/                                        # 11 Standalone Antigravity AI Skills
        ├── agent-tool-governance/                     # HITL, JSON Schema & Risk Scoring
        ├── autonomous-agent-evals/                    # EDD & LLM-as-a-Judge Eval Harness
        ├── hybrid-rag-vector-search/                  # Hybrid Search (BM25 + Dense + RRF)
        ├── langchain-agent-patterns/                  # LCEL, Output Parsers & ReAct Loops
        ├── mcp-enterprise-architecture/               # Model Context Protocol JSON-RPC 2.0
        ├── multi-agent-crew-patterns/                 # Swarm, Hierarchical & Peer Topologies
        ├── oci-enterprise-ai-agents/                  # OCI 3-Layer Agent Architecture
        ├── openai-agents-sdk/                         # OpenAI Swarm & Handoff Primitives
        ├── oracle-ai-database/                        # Oracle 23ai Select AI & Vector Search
        ├── pgvector-hybrid-search/                    # PostgreSQL HNSW & Full-Text Search
        └── zero-shot-cot-prompting/                   # Chain-of-Thought & Guardrails
```

---

## 🏗️ Architecture Blueprints Portfolio

Sample deliverables demonstrating enterprise-grade multi-agent system design.
Each blueprint includes: Mermaid architecture diagrams, Tool JSON Schemas, HITL Policy,
RAG strategy, Token Economics, and 3-week Implementation Roadmap.

→ **[Full Blueprint Index & Comparison Matrix](./blueprints/README.md)**

| Blueprint | Industry | Agent Pattern | HITL Gates | Cost/Op | vs Manual |
|---|---|---|---|---|---|
| [🎫 Support Triage](./blueprints/SAMPLE_BLUEPRINT_SUPPORT_TRIAGE.md) | Customer Success | Hierarchical Manager-Worker | 2 | ~$0.025/ticket | 240–600× cheaper |
| [🏆 Lead Qualification](./blueprints/SAMPLE_BLUEPRINT_LEAD_QUALIFICATION.md) | Sales & RevOps | Sequential Pipeline | 1 | ~$0.022/lead | 1,100–3,600× cheaper |
| [📄 Document Intelligence](./blueprints/SAMPLE_BLUEPRINT_DOCUMENT_INTELLIGENCE.md) | Finance & Legal | Sequential + Parallel Validation | 5 | ~$0.048/doc | 170–520× cheaper |

---

## 🧠 11 Bundled Agent Skills Index

| Skill Name | Core Capability | Focus Area |
| :--- | :--- | :--- |
| **`autonomous-agent-evals`** | Eval-Driven Development (EDD) | LLM-as-a-Judge, trajectory testing, cost-per-task |
| **`agent-tool-governance`** | Enterprise Tool Execution Safety | HITL approval gates ($500+ rules), JSON Schema, idempotency |
| **`multi-agent-crew-patterns`** | Multi-Agent Team Topologies | Swarm, role specialization, task dependency DAGs |
| **`openai-agents-sdk`** | Agent Handoff Architectures | `handoff_description`, Peer vs Manager handoffs |
| **`langchain-agent-patterns`** | LCEL & ReAct Pipelines | Output parsers, LCEL piping, ReAct loops |
| **`hybrid-rag-vector-search`** | Production RAG Architecture | Chunking, BM25 + Dense embeddings, RRF, Re-ranking |
| **`pgvector-hybrid-search`** | PostgreSQL Vector RAG | HNSW/IVFFlat indexes, TSVECTOR, in-database RRF |
| **`mcp-enterprise-architecture`** | Model Context Protocol | JSON-RPC 2.0, Tools vs Resources, stdio / HTTP transport |
| **`zero-shot-cot-prompting`** | Reasoning & Guardrails | Chain-of-Thought ("Let's think step by step"), ReAct |
| **`oci-enterprise-ai-agents`** | OCI Enterprise AI Infrastructure | 3-Layer architecture (Models, Agents, Governance) |
| **`oracle-ai-database`** | Oracle 23ai & Select AI | In-database ONNX embeddings, `VECTOR_DISTANCE()` |

---

## 🛍️ Productized Service Tiers

| Tier | What Client Gets | Price | Delivery |
|---|---|---|---|
| **Tier A — Foundation Blueprint** | Agent Topology Decision Matrix, Framework ADR, Tool Schemas (up to 5), Mermaid Architecture Diagram, RAG & Memory Strategy, Loom walkthrough | **$750** | 3 days |
| **Tier B — Enterprise Blueprint** | All Tier A + MCP Integration Spec, HITL Policy Table, Risk & Guardrails Matrix, Token Economics Estimate, 1-Hour Live Architecture Review Call | **$1,250** | 5 days |
| **RAG & Knowledge Agent Audit** | Baseline benchmark (Precision@K, Recall@K, Hallucination Rate), Hybrid Search upgrade plan, Embedding optimisation spec, Executive Summary + Tech Spec | **$1,000–$2,500** | 5–7 days |
| **Production Multi-Agent MVP** | Working agent system (GitHub + Docker), Architecture Decision Records, Eval Test Suite (LLM-as-a-Judge), 45-min Handoff Call, 2 weeks async support | **$3,500–$7,000+** | 2–3 weeks |

📩 **[Upwork Profile](https://www.upwork.com/freelancers/~014f724f47c12d0083)** | **[LinkedIn](https://www.linkedin.com/in/shaforostov)** | **[Djinni](https://djinni.co/q/6440c32c5f/)**

---

## 🎓 Certified Syllabus Coverage (6 Modules)

1. **AI Agents Fundamentals:** Definition of AI Agents vs traditional software, Agent Memory (Short-term/Long-term), Planning, and Tool Calling.
2. **LLM Reasoning & Agent Decision Making:** Chain-of-Thought (CoT), ReAct loops, Reflection, and Prompt Engineering.
3. **Multi-Agent Frameworks & Topologies:** Sequential, Hierarchical, and Network (Peer-to-Peer) agent chains.
4. **OCI AI Agents Architecture:** 3-Layer design (AI Models, AI Agents, AI Governance), On-Demand vs Dedicated Clusters, signed IAM requests.
5. **RAG & Oracle Database 23ai Integration:** Select AI, `VECTOR` data types, in-database ONNX embeddings, Vector Distance metrics.
6. **Agent Security & Governance:** Model Context Protocol (MCP), AST threat scanning, Human-in-the-loop (HITL) gates, and rate-limiting.
