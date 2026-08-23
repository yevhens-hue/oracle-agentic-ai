import { NextResponse } from 'next/server';
import { runCompetitiveIntelligencePipeline } from '@/lib/agents/competitiveIntel';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const targetCompany = body.targetCompany || body.target_company || 'Adsy';
    const competitors = body.competitors || ['Collaborator.pro', 'Accessily', 'Postaga', 'Semrush'];
    const industryDomain = body.industryDomain || body.industry_domain || 'MarTech / Link Growth Marketplace';

    const report = await runCompetitiveIntelligencePipeline({
      targetCompany,
      competitors,
      industryDomain
    });

    // Save to Prisma Database if connection available
    let savedRecord = null;
    try {
      savedRecord = await db.report.create({
        data: {
          targetCompany: report.targetCompany,
          threatScore: report.threatScore,
          industryDomain: report.industryDomain,
          executiveSummary: report.executiveSummary,
          swotAnalysis: JSON.stringify(report.swotAnalysis),
          featureMatrix: JSON.stringify(report.featureMatrix),
          geoAudit: JSON.stringify(report.geoAudit),
          mermaidChart: report.mermaidChart
        }
      });
    } catch (dbErr) {
      console.warn("DB save warning (falling back to memory response):", dbErr);
    }

    return NextResponse.json({
      success: true,
      data: report,
      dbId: savedRecord?.id || null
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Competitive intelligence analysis failed' },
      { status: 500 }
    );
  }
}
