---
name: oci-enterprise-ai-agents
description: OCI Enterprise AI Platform and Agentic Systems Architecture. Covers the 3-layer architecture (AI Models, AI Agents, AI Governance), On-Demand vs Dedicated AI Clusters, OCI IAM signed authentication, Project OCID request routing, short-term vs long-term memory models, OpenAI Responses API compatibility, and Docker/Podman container deployment to OCI Container Registry.
---

# ☁️ OCI Enterprise AI Platform & Agents Architecture

The Oracle Cloud Infrastructure (OCI) Enterprise AI Platform provides a production-grade environment for building, hosting, and governing autonomous AI agents.

---

## 🏗️ The 3-Layer OCI Enterprise AI Platform

```
┌─────────────────────────────────────────────────────────────────┐
│                    1. AI GOVERNANCE LAYER                       │
│   (OCI IAM, Signed Requests, RBAC, Fine-Grained Telemetry/Audit) │
├─────────────────────────────────────────────────────────────────┤
│                     2. AI AGENTS LAYER                          │
│   (ReAct Loops, Short/Long-Term Memory, Managed Tool Runtime)   │
├─────────────────────────────────────────────────────────────────┤
│                     3. AI MODELS LAYER                          │
│ ┌───────────────────────────────┬─────────────────────────────┐ │
│ │       On-Demand Serving       │    Dedicated AI Clusters    │ │
│ │  (Shared Multi-Tenant GPUs)   │ (Isolated GPUs for Custom)  │ │
│ └───────────────────────────────┴─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. On-Demand Serving vs. Dedicated AI Clusters

| Feature | On-Demand Serving | Dedicated AI Clusters |
| :--- | :--- | :--- |
| **Infrastructure** | Shared multi-tenant GPU pool | Physically isolated GPU instances |
| **Custom Models** | Standard pre-trained models | Fine-tuned or custom imported models |
| **SLAs & Throughput** | Best-effort / Shared rate limits | Dedicated predictable throughput |
| **Use Case** | Prototyping, standard LLM inference | Enterprise workloads, regulatory compliance |

---

## 2. Request Routing & IAM Authentication

All API interactions with OCI Enterprise AI are authenticated via **OCI IAM signed requests** and routed via **Project OCID**.

### Key Protocol Identifiers
* **Project OCID:** `ocid1.genaiproject.oc1.iad.xxxxxxxx...` (Associates API requests with a specific Generative AI Project resource for billing and policy enforcement).
* **IAM Signatures:** API requests require standard HTTP Signature authorization headers generated from OCI API Keys or Instance Principals.

---

## 3. OpenAI Responses API Compatibility

OCI Enterprise AI provides an OpenAI-compatible endpoint, allowing standard OpenAI SDKs to interact with OCI AI Agents by overriding `base_url` and headers.

```python
import os
from openai import OpenAI

# Initialize OpenAI client pointing to OCI Enterprise AI Endpoint
client = OpenAI(
    base_url="https://inference.generativeai.us-ashburn-1.oci.oraclecloud.com/20231130/actions/v1",
    api_key=os.getenv("OCI_AUTH_TOKEN"),
    default_headers={
        "opc-project-id": "ocid1.genaiproject.oc1.iad.example_project_ocid"
    }
)

response = client.chat.completions.create(
    model="cohere.command-r-plus",
    messages=[
        {"role": "system", "content": "You are an enterprise operations assistant. Let's think step by step."},
        {"role": "user", "content": "Analyze system logs for anomalies."}
    ],
    temperature=0.2
)

print(response.choices[0].message.content)
```

---

## 4. OCI Agent Memory Architecture

OCI AI Agents manage state through two distinct memory stores:

```
                  ┌──────────────────────────────┐
                  │    Agent Session Request     │
                  └──────────────┬───────────────┘
                                 │
           ┌─────────────────────┴─────────────────────┐
           ▼                                           ▼
┌─────────────────────────────┐             ┌────────────────────────────┐
│      Short-Term Memory     │             │      Long-Term Memory      │
│  (Session Conversation Ctx) │             │ (Persistent Cross-Session) │
│  - Active dialogue turns    │             │ - User preferences & facts │
│  - Transient tool outputs   │             │ - Historical entity state  │
└─────────────────────────────┘             └────────────────────────────┘
```

---

## 5. Built-in Tools & Integrations

OCI AI Agents come with native, fully-managed tool integrations:
* **File Search:** Managed RAG tool querying uploaded document collections.
* **Code Interpreter:** Sandboxed Python execution environment for data analysis and math.
* **Function Calling:** Standard schema-based tool calling to external APIs.
* **MCP Calling:** Remote invocation of Model Context Protocol (MCP) servers over HTTPS.

---

## 6. Containerized Deployment Workflow

Enterprise agents built on OCI are packaged as containerized microservices using Podman or Docker and pushed to OCI Container Registry (OCIR):

```bash
# 1. Build Docker/Podman container image
podman build -t oci-agent-service:v1.0 .

# 2. Authenticate with OCI Container Registry (OCIR)
podman login iad.ocir.io -u "tenancy_namespace/username" -p "auth_token"

# 3. Tag and Push image to OCIR
podman tag oci-agent-service:v1.0 iad.ocir.io/tenancy_namespace/oci-agent-service:v1.0
podman push iad.ocir.io/tenancy_namespace/oci-agent-service:v1.0
```
