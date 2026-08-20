import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib import colors

pdf_path = "/Users/yevhen/Desktop/Sample_Blueprint_Support_Triage.pdf"
doc = SimpleDocTemplate(pdf_path, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    'DocTitle',
    parent=styles['Heading1'],
    fontSize=18,
    leading=22,
    textColor=colors.HexColor("#1A365D"),
    spaceAfter=8
)

subtitle_style = ParagraphStyle(
    'DocSubTitle',
    parent=styles['Normal'],
    fontSize=11,
    leading=14,
    textColor=colors.HexColor("#4A5568"),
    spaceAfter=14
)

h2_style = ParagraphStyle(
    'H2',
    parent=styles['Heading2'],
    fontSize=13,
    leading=16,
    textColor=colors.HexColor("#2B6CB0"),
    spaceBefore=10,
    spaceAfter=6
)

body_style = ParagraphStyle(
    'Body',
    parent=styles['Normal'],
    fontSize=9,
    leading=12,
    textColor=colors.HexColor("#2D3748")
)

bullet_style = ParagraphStyle(
    'Bullet',
    parent=styles['Normal'],
    fontSize=9,
    leading=12,
    textColor=colors.HexColor("#2D3748"),
    leftIndent=12,
    spaceAfter=3
)

story = []

# Header
story.append(Paragraph("Enterprise Architecture Blueprint: Support Triage Multi-Agent System", title_style))
story.append(Paragraph("<b>Author:</b> Yevhen Shaforostov | Oracle Certified Agentic AI Foundations Associate (2026)<br/><b>Deliverable Scope:</b> Tier B Architecture Blueprint ($1,250)", subtitle_style))
story.append(Spacer(1, 8))

# Executive Summary Table
story.append(Paragraph("1. Executive Summary", h2_style))
data_summary = [
    ["Parameter", "Specification"],
    ["Use Case", "Automated Customer Support Triage & Multi-Tier Resolution"],
    ["Agent Pattern", "Hierarchical Manager-Worker with Declarative Handoffs"],
    ["Framework", "OpenAI Agents SDK + LangChain Tool Wrappers"],
    ["RAG Retrieval", "Hybrid Search: Dense Vector + BM25 Sparse + Reciprocal Rank Fusion (RRF)"],
    ["Safety Gates (HITL)", "2 Approval Gates (P1 Emergency Escalations & Financial Refunds > $200)"],
    ["MCP Protocol", "Zendesk MCP Server (JSON-RPC 2.0 stdio transport)"],
    ["Token Economics", "$0.025 blended cost/ticket (vs. $6.00-$15.00 human manual baseline)"]
]
t_summary = Table(data_summary, colWidths=[150, 390])
t_summary.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#EBF8FF")),
    ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor("#2B6CB0")),
    ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
    ('FONTSIZE', (0,0), (-1,-1), 8.5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E0")),
    ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
]))
story.append(t_summary)
story.append(Spacer(1, 12))

# Multi-Agent Topology
story.append(Paragraph("2. Multi-Agent Topology & Responsibilities", h2_style))
story.append(Paragraph("• <b>Triage Manager Agent:</b> Central orchestrator receiving inbound tickets from Zendesk MCP/Webhooks. Coordinates specialist workers and evaluates resolution confidence.", bullet_style))
story.append(Paragraph("• <b>Classifier Agent:</b> Fast extraction model categorizing issues (Billing, Tech, Account, Complaint), priority scoring (P1-P4), and sentiment detection.", bullet_style))
story.append(Paragraph("• <b>RAG Resolver Agent:</b> Executes hybrid search against verified enterprise documentation, runs self-reflection verification to eliminate hallucinations.", bullet_style))
story.append(Paragraph("• <b>Escalation Agent:</b> Prepares structured context packages and triggers Human-in-the-Loop Slack cards when confidence &lt; 0.75 or financial rules trigger.", bullet_style))
story.append(Spacer(1, 10))

# Tool & MCP Architecture
story.append(Paragraph("3. Model Context Protocol (MCP) & Tool Schema Design", h2_style))
story.append(Paragraph("Tools are defined using strict JSON Schema validation and exposed via standard MCP endpoints:", body_style))
story.append(Spacer(1, 4))
data_tools = [
    ["Tool Name", "Transport", "Description & Safety Constraint"],
    ["zendesk_get_ticket", "MCP stdio", "Fetches full ticket conversation history and user profile metadata."],
    ["search_knowledge_base", "Internal RAG", "Executes Dense + BM25 Hybrid Search with RRF re-ranking. Top-3 chunks."],
    ["create_hitl_card", "Slack API", "Dispatches interactive Slack card for human authorization ($200+ refunds)."],
    ["zendesk_update_ticket", "MCP stdio", "Applies status change, internal tags, and dispatches verified draft response."]
]
t_tools = Table(data_tools, colWidths=[130, 90, 320])
t_tools.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F7FAFC")),
    ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor("#2D3748")),
    ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
    ('FONTSIZE', (0,0), (-1,-1), 8),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
    ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
]))
story.append(t_tools)
story.append(Spacer(1, 12))

# Page 2: Safety, Economics, Roadmap
story.append(PageBreak())
story.append(Paragraph("4. Human-In-The-Loop (HITL) Policy & Safety Governance", h2_style))
data_hitl = [
    ["Trigger Condition", "Risk Level", "Gate Mechanism", "Timeout SLA", "Assigned Role"],
    ["P1 Emergency Outage", "Critical", "Slack Card + PagerDuty Alert", "5 Minutes", "On-Call Tech Lead"],
    ["Refund Request > $200", "High", "Slack Interactive Approval Card", "2 Hours", "Finance Lead"],
    ["Account Deletion Request", "Critical", "Dual-Factor Email Confirmation", "24 Hours", "SecOps Team"],
    ["Model Confidence < 0.70", "Medium", "Draft Flagged for Peer Review", "1 Hour", "Tier-2 Human Agent"]
]
t_hitl = Table(data_hitl, colWidths=[120, 65, 140, 75, 140])
t_hitl.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#FFF5F5")),
    ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor("#C53030")),
    ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
    ('FONTSIZE', (0,0), (-1,-1), 8),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#FEB2B2")),
    ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
]))
story.append(t_hitl)
story.append(Spacer(1, 14))

story.append(Paragraph("5. Token Economics & Cost Reduction Analysis", h2_style))
data_cost = [
    ["Execution Tier", "Input Tokens", "Output Tokens", "Target LLM Model", "Cost per Ticket"],
    ["Simple Classification", "~1,200", "~300", "gpt-4o-mini", "$0.003"],
    ["RAG Hybrid Resolution", "~3,500", "~500", "gpt-4o-mini", "$0.009"],
    ["Escalated Ticket with HITL", "~4,500", "~700", "gpt-4o", "$0.058"],
    ["Blended Production Average", "-", "-", "Hybrid Model Fleet", "$0.025 / ticket"]
]
t_cost = Table(data_cost, colWidths=[130, 85, 85, 120, 120])
t_cost.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F0FFF4")),
    ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor("#276749")),
    ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
    ('FONTSIZE', (0,0), (-1,-1), 8),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#9AE6B4")),
    ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
]))
story.append(t_cost)
story.append(Spacer(1, 14))

story.append(Paragraph("6. 3-Week Implementation Roadmap", h2_style))
story.append(Paragraph("• <b>Week 1 (Infrastructure & MCP):</b> Deploy Zendesk MCP Server, configure Pinecone/pgvector vector store, index enterprise KB.", bullet_style))
story.append(Paragraph("• <b>Week 2 (Agent Swarm & Safety):</b> Develop Classifier, RAG Resolver, Self-Reflection loops, and Slack Block Kit HITL webhooks.", bullet_style))
story.append(Paragraph("• <b>Week 3 (Eval Testing & Handoff):</b> Run 40-scenario benchmark with LLM-as-a-Judge, latency optimization, and final team handoff.", bullet_style))
story.append(Spacer(1, 16))

story.append(Paragraph("<i>Public Verification: Oracle Certified Associate - Agentic AI Foundations (1Z0-1157-26) | Candidate ID: OC8112637</i>", ParagraphStyle('Footer', parent=styles['Normal'], fontSize=7.5, textColor=colors.HexColor("#718096"))))

doc.build(story)
print("PDF generated successfully at:", pdf_path)
