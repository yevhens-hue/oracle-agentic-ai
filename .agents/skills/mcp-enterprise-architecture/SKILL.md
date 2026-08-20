---
name: mcp-enterprise-architecture
description: Model Context Protocol (MCP) Enterprise Architecture & Protocol Specification. Solves N x M connector fragmentation via standardized JSON-RPC 2.0 communication. Covers host-client-server 1:1 topologies, initialization capabilities exchange, model-controlled Tools vs application-controlled Resources, Prompts, stdio & Streamable HTTP transports, and database-native MCP security (VPD/RBAC).
---

# 🔌 Model Context Protocol (MCP) Enterprise Architecture

The Model Context Protocol (MCP) is an open standard that acts as the **"USB-C for AI"** — providing a universal, standardized interface between AI applications (LLM Hosts) and external tools, databases, and services.

---

## 🛑 The $N \times M$ Connector Challenge

Before MCP, connecting $N$ AI client applications (Cursor, Claude Desktop, Custom Agents) to $M$ external data sources and tool APIs required $N \times M$ custom integration implementations. 

MCP reduces integration complexity from **$O(N \times M)$** to **$O(N + M)$**.

```
    WITHOUT MCP (N x M Complexity)                   WITH MCP (N + M Standardized)
┌────────────┐     ┌────────────┐            ┌────────────┐     ┌────────────┐
│ AI App 1   │──┬──│ Service A  │            │ AI App 1   │────┐│ Service A  │
└────────────┘  │  └────────────┘            └────────────┘    │└────────────┘
┌────────────┐  ┼──┌────────────┐     VS     ┌────────────┐  ┌─┴────────────┐
│ AI App 2   │──┼──│ Service B  │            │ AI App 2   │──┤ MCP SERVER │
└────────────┘  │  └────────────┘            └────────────┘  └─┬────────────┘
┌────────────┐  │  ┌────────────┐            ┌────────────┐    │┌────────────┐
│ AI App 3   │──┴──│ Service C  │            │ AI App 3   │────┘│ Service B  │
└────────────┘     └────────────┘            └────────────┘     └────────────┘
```

---

## 📐 MCP Core Topology & Client-Server Lifecycle

1. **MCP Host:** The outer application (IDE, agent framework, conversational UI) managing the AI session.
2. **MCP Client:** Maintained 1:1 dedicated connection within the Host process.
3. **MCP Server:** Exposes tools, resources, and prompt templates.

```
MCP Host Application
 └─ MCP Client
     │
     ├─ (1. Initialize Request: JSON-RPC 2.0 exchange protocol version & capabilities)
     ├─ (2. Initialize Response: Server capabilities confirmation)
     │
     ├───► [GET /tools/list] ────► Returns JSON Schemas of executable tools
     ├───► [POST /tools/call] ───► Executes tool with model arguments
     └───► [GET /resources/read] ─► Fetches application-controlled context data
```

---

## 📑 The 3 Core MCP Primitives

| Primitive | Control Model | Execution Nature | Description / Best For |
| :--- | :--- | :--- | :--- |
| **Tools** | **Model-Controlled** | Executable Actions | Functions invoked autonomously by the LLM (e.g., `execute_sql`, `send_email`). Evaluates input JSON Schema. |
| **Resources** | **Application-Controlled** | Read-Only Context | Structured data attached directly by the host application (e.g., database records, log files, system specs). |
| **Prompts** | **User-Controlled** | Template Expansion | Reusable prompt templates presented to the end user for workflow selection. |

---

## 🔄 Protocol Specification & Message Format

All MCP communication uses **JSON-RPC 2.0**.

### 1. Initialization Handshake (`initialize`)
```json
// Client Request
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "roots": { "listChanged": true },
      "sampling": {}
    },
    "clientInfo": { "name": "enterprise-agent-host", "version": "1.0.0" }
  }
}

// Server Response
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "tools": { "listChanged": true },
      "resources": { "subscribe": true, "listChanged": true }
    },
    "serverInfo": { "name": "oracle-database-mcp-server", "version": "23.4.0" }
  }
}
```

### 2. Discovering Tools (`tools/list`)
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list"
}
```

---

## 🚀 Transports: Local vs. Remote

1. **`stdio` Transport:** Local inter-process communication (IPC) via standard input/output streams. Ideal for desktop apps (Cursor, Claude Desktop).
2. **Streamable HTTP / SSE Transport:** Remote HTTP communication using Server-Sent Events (SSE) for server-to-client streaming and standard HTTP POST for client requests. Ideal for cloud microservices and web dashboards.

---

## 🔒 Enterprise & In-Database Security

Database-native MCP servers (such as Oracle Autonomous Database MCP Server) offer key architectural advantages:
* **Zero Outer Proxy Overhead:** MCP Server runs directly within the database engine.
* **In-Database Security:** Enforces Virtual Private Database (VPD), Row-Level Security (RLS), and Role-Based Access Control (RBAC) natively without needing application-layer validation.
* **Audit Compliance:** Logs all tool executions and resource reads directly into database audit trails.
