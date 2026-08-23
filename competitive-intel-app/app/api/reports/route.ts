import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getFallbackReports } from '@/lib/reportsFallback';

export async function GET() {
  try {
    let rawReports: any[] = [];
    try {
      rawReports = await db.report.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
      });
    } catch (dbErr) {
      console.warn("DB query failed in /api/reports, using fallback reports:", dbErr);
    }

    if (!rawReports || rawReports.length === 0) {
      return NextResponse.json({ success: true, count: 2, data: getFallbackReports() });
    }

    const parsedReports = rawReports.map(r => ({
      ...r,
      swotAnalysis: typeof r.swotAnalysis === 'string' ? JSON.parse(r.swotAnalysis || '{}') : r.swotAnalysis,
      featureMatrix: typeof r.featureMatrix === 'string' ? JSON.parse(r.featureMatrix || '{}') : r.featureMatrix,
      geoAudit: typeof r.geoAudit === 'string' ? JSON.parse(r.geoAudit || 'null') : r.geoAudit
    }));

    return NextResponse.json({ success: true, count: parsedReports.length, data: parsedReports });
  } catch (error: any) {
    console.warn("Returning fallback reports due to error:", error);
    return NextResponse.json({ success: true, count: 2, data: getFallbackReports() });
  }
}
