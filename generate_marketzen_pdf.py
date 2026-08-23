import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
from reportlab.lib import colors

def build_marketzen_pdf(output_path: str):
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#1A365D"),
        spaceAfter=4,
        fontName='Helvetica-Bold'
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#4A5568"),
        spaceAfter=12,
        fontName='Helvetica'
    )
    
    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Heading2'],
        fontSize=13,
        leading=16,
        textColor=colors.HexColor("#1A365D"),
        spaceBefore=12,
        spaceAfter=6,
        fontName='Helvetica-Bold'
    )
    
    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Heading3'],
        fontSize=10.5,
        leading=13,
        textColor=colors.HexColor("#2B6CB0"),
        spaceBefore=8,
        spaceAfter=4,
        fontName='Helvetica-Bold'
    )
    
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#2D3748"),
        spaceAfter=4
    )
    
    bullet_style = ParagraphStyle(
        'Bullet',
        parent=styles['Normal'],
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#2D3748"),
        leftIndent=10,
        spaceAfter=2
    )

    tbl_header_style = ParagraphStyle(
        'TblHeader',
        parent=styles['Normal'],
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#FFFFFF"),
        fontName='Helvetica-Bold'
    )

    tbl_cell_style = ParagraphStyle(
        'TblCell',
        parent=styles['Normal'],
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor("#2D3748")
    )

    tbl_cell_bold = ParagraphStyle(
        'TblCellBold',
        parent=styles['Normal'],
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor("#1A365D"),
        fontName='Helvetica-Bold'
    )

    story = []
    
    # --- HEADER ---
    story.append(Paragraph("MarketZen & Adsy 2026 Strategic R&D & GEO Report", title_style))
    story.append(Paragraph(
        "<b>Executive Author:</b> Yevhen Shaforostov | Oracle Certified Agentic AI Systems Architect<br/>"
        "<b>Focus Area:</b> Generative Engine Optimization (GEO/AEO), AI Publisher Vetting & Hybrid SaaS Monetization",
        subtitle_style
    ))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E0"), spaceBefore=0, spaceAfter=10))

    # --- EXECUTIVE SUMMARY ---
    story.append(Paragraph("1. Executive Summary & Market Scope", h1_style))
    exec_text = (
        "This report delivers a data-driven competitive analysis of <b>MarketZen</b> and its flagship platform, "
        "<b>Adsy</b>, within the link-building marketplace sector. As search transitions from traditional Google blue links "
        "to Generative Engine Optimization (GEO) across ChatGPT, Perplexity, Claude, and Gemini, Adsy has a strategic "
        "window to lead by integrating automated AI publisher vetting, GEO citation engineering, and proactive link health monitoring."
    )
    story.append(Paragraph(exec_text, body_style))
    story.append(Spacer(1, 4))

    data_meta = [
        [Paragraph("Strategic Vector", tbl_header_style), Paragraph("Market Benchmark (2026)", tbl_header_style), Paragraph("Adsy R&D Recommendation", tbl_header_style)],
        [Paragraph("Search Engine Paradigm", tbl_cell_bold), Paragraph("Google Blue Links → AI Answer Engines (Perplexity, ChatGPT)", tbl_cell_style), Paragraph("Deploy GEO & Schema.org Auto-Injector for Content", tbl_cell_style)],
        [Paragraph("Publisher Vetting", tbl_cell_bold), Paragraph("Manual Moz/Ahrefs Spam Checking", tbl_cell_style), Paragraph("AI Real-time PBN & Crawler Permissions Vetting Engine", tbl_cell_style)],
        [Paragraph("Monetization Model", tbl_cell_bold), Paragraph("Pure Pay-Per-Link Marketplace (10-20% fee)", tbl_cell_style), Paragraph("Hybrid SaaS ($99-$299/mo) + Lower Placement Fees", tbl_cell_style)],
        [Paragraph("Link Health Assurance", tbl_cell_bold), Paragraph("Manual refund requests upon link drop", tbl_cell_style), Paragraph("Continuous Crawl4AI Health & Indexing Auto-Remediation", tbl_cell_style)]
    ]
    t_meta = Table(data_meta, colWidths=[120, 200, 220])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1A365D")),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#FFFFFF"), colors.HexColor("#F7FAFC")])
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 10))

    # --- SECTION 2: COMPETITIVE MATRIX ---
    story.append(Paragraph("2. Extended Competitive Matrix & Feature Gap Analysis", h1_style))
    
    matrix_data = [
        [
            Paragraph("Platform", tbl_header_style),
            Paragraph("Inventory", tbl_header_style),
            Paragraph("Traffic Verification", tbl_header_style),
            Paragraph("Spam & PBN Filter", tbl_header_style),
            Paragraph("GEO/AEO Support", tbl_header_style),
            Paragraph("Pricing Model", tbl_header_style)
        ],
        [
            Paragraph("<b>Adsy</b>", tbl_cell_bold),
            Paragraph("20,000+ Global", tbl_cell_style),
            Paragraph("Self-check / Manual", tbl_cell_style),
            Paragraph("Moz / Ahrefs Basic", tbl_cell_style),
            Paragraph("⭐ Basic (Target 2026)", tbl_cell_style),
            Paragraph("Pay-per-link / Bulk", tbl_cell_style)
        ],
        [
            Paragraph("Collaborator.pro", tbl_cell_style),
            Paragraph("43,000+ Global", tbl_cell_style),
            Paragraph("Integrated", tbl_cell_style),
            Paragraph("Moderate", tbl_cell_style),
            Paragraph("Limited", tbl_cell_style),
            Paragraph("Pay-per-link / Tiered", tbl_cell_style)
        ],
        [
            Paragraph("Accessily", tbl_cell_style),
            Paragraph("15,000+", tbl_cell_style),
            Paragraph("Partial", tbl_cell_style),
            Paragraph("Limited", tbl_cell_style),
            Paragraph("None", tbl_cell_style),
            Paragraph("SaaS + Pay-per-link", tbl_cell_style)
        ],
        [
            Paragraph("Postaga", tbl_cell_style),
            Paragraph("Outreach SaaS", tbl_cell_style),
            Paragraph("API Integrations", tbl_cell_style),
            Paragraph("N/A", tbl_cell_style),
            Paragraph("Moderate", tbl_cell_style),
            Paragraph("SaaS Subscription", tbl_cell_style)
        ],
        [
            Paragraph("PRNEWS.IO", tbl_cell_style),
            Paragraph("100,000+", tbl_cell_style),
            Paragraph("Publisher-reported", tbl_cell_style),
            Paragraph("Minimal", tbl_cell_style),
            Paragraph("None", tbl_cell_style),
            Paragraph("Pay-per-placement", tbl_cell_style)
        ]
    ]
    t_matrix = Table(matrix_data, colWidths=[80, 85, 95, 95, 95, 90])
    t_matrix.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#2B6CB0")),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#FFFFFF"), colors.HexColor("#F7FAFC")])
    ]))
    story.append(t_matrix)
    story.append(Spacer(1, 10))

    # --- SECTION 3: GEO / AEO PARADIGM SHIFT ---
    story.append(Paragraph("3. 2026 Search Paradigm: Generative Engine Optimization (GEO/AEO)", h1_style))
    story.append(Paragraph("• <b>AI Answer Citation Shift:</b> Over 38% of high-intent queries now terminate in AI Overviews or LLM Chat answers (ChatGPT Search, Perplexity, Gemini, Claude). Traditional Domain Authority (DA/DR) is insufficient.", bullet_style))
    story.append(Paragraph("• <b>Key GEO Ranking Factors:</b> Direct Schema.org microdata (FAQPage, HowTo, Organization), verified robots.txt access for 8 AI crawlers (GPTBot, PerplexityBot, ClaudeBot, Google-Extended), and high entity co-occurrence.", bullet_style))
    story.append(Paragraph("• <b>Adsy Technical Advantage:</b> Deploy real-time Advertools & Crawl4AI scanning to certify publishers as 'GEO-Ready' directly inside the marketplace directory.", bullet_style))
    story.append(Spacer(1, 10))

    # --- PAGE BREAK ---
    story.append(PageBreak())

    # --- SECTION 4: FINANCIAL & MONETIZATION EVOLUTION ---
    story.append(Paragraph("4. Financial Projections & Hybrid SaaS Monetization", h1_style))
    story.append(Paragraph("Transitioning from pure transaction fees to a hybrid SaaS subscription stabilizes ARR and drives higher Customer Lifetime Value (LTV):", body_style))
    story.append(Spacer(1, 4))

    saas_data = [
        [Paragraph("Metric / Benchmark", tbl_header_style), Paragraph("Pure Marketplace Baseline", tbl_header_style), Paragraph("Hybrid SaaS + Marketplace Target", tbl_header_style)],
        [Paragraph("Customer Acquisition Cost (CAC)", tbl_cell_bold), Paragraph("$450 - $600", tbl_cell_style), Paragraph("$400 (Lower via product-led trial)", tbl_cell_style)],
        [Paragraph("Average LTV (Advertisers)", tbl_cell_bold), Paragraph("$1,800", tbl_cell_style), Paragraph("$4,200 (2.3x expansion via SaaS)", tbl_cell_style)],
        [Paragraph("Gross Profit Margin", tbl_cell_bold), Paragraph("35% - 40%", tbl_cell_style), Paragraph("65% - 72% blended", tbl_cell_style)],
        [Paragraph("Annual Churn Rate", tbl_cell_bold), Paragraph("18% - 24%", tbl_cell_style), Paragraph("9% - 12% (Sticky workflow integration)", tbl_cell_style)]
    ]
    t_saas = Table(saas_data, colWidths=[150, 195, 195])
    t_saas.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#276749")),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#9AE6B4")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#FFFFFF"), colors.HexColor("#F0FFF4")])
    ]))
    story.append(t_saas)
    story.append(Spacer(1, 10))

    # --- SECTION 5: R&D STRATEGIC ROADMAP ---
    story.append(Paragraph("5. 3-Phase R&D Implementation Roadmap", h1_style))
    
    roadmap_data = [
        [Paragraph("Phase & Timeline", tbl_header_style), Paragraph("Core Deliverable", tbl_header_style), Paragraph("Technical Stack", tbl_header_style), Paragraph("Target Success KPI", tbl_header_style)],
        [
            Paragraph("<b>Phase 1</b><br/>(Months 1-2)", tbl_cell_bold),
            Paragraph("AI Publisher Vetting & 8-Bot Crawler Permission Audit", tbl_cell_style),
            Paragraph("Python, Advertools, FastAPI, Redis", tbl_cell_style),
            Paragraph("Zero low-quality PBNs in active catalog; &gt;95% bot audit precision", tbl_cell_style)
        ],
        [
            Paragraph("<b>Phase 2</b><br/>(Months 3-4)", tbl_cell_bold),
            Paragraph("GEO Content Brief Suite & Schema Auto-Formatter", tbl_cell_style),
            Paragraph("OpenAI Agents SDK, Crawl4AI, JSON-LD", tbl_cell_style),
            Paragraph("+45% AI Search citation probability for guest posts", tbl_cell_style)
        ],
        [
            Paragraph("<b>Phase 3</b><br/>(Months 5-6)", tbl_cell_bold),
            Paragraph("Automated Link Health & Indexing Remediation Engine", tbl_cell_style),
            Paragraph("Playwright headless, Supabase/pgvector, Webhooks", tbl_cell_style),
            Paragraph("&lt;1% undetected link drops; 100% auto-refund/replacement", tbl_cell_style)
        ]
    ]
    t_roadmap = Table(roadmap_data, colWidths=[80, 160, 140, 160])
    t_roadmap.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1A365D")),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#FFFFFF"), colors.HexColor("#F7FAFC")])
    ]))
    story.append(t_roadmap)
    story.append(Spacer(1, 14))

    # --- FOOTER SIGN-OFF ---
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E0"), spaceBefore=10, spaceAfter=8))
    story.append(Paragraph(
        "<b>MarketZen R&D Report Completed:</b> 2026 | "
        "<b>Verified Credentials:</b> Oracle Certified Agentic AI Foundations Associate (1Z0-1157-26) | "
        "Candidate ID: OC8112637",
        ParagraphStyle('Footer', parent=styles['Normal'], fontSize=7.5, textColor=colors.HexColor("#718096"))
    ))

    doc.build(story)
    print(f"✅ MarketZen Executive PDF report generated successfully at: {output_path}")

if __name__ == "__main__":
    out_dir_pdf = os.path.join(os.path.dirname(__file__), "reports", "MarketZen_RD_Report_2026.pdf")
    desktop_pdf = os.path.expanduser("~/Desktop/MarketZen_RD_Report_2026.pdf")
    build_marketzen_pdf(out_dir_pdf)
    build_marketzen_pdf(desktop_pdf)
