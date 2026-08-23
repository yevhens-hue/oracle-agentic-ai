import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const reports = await db.report.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    const parsedReports = reports.map(r => ({
      ...r,
      swotAnalysis: JSON.parse(r.swotAnalysis || '{}'),
      featureMatrix: JSON.parse(r.featureMatrix || '{}'),
      geoAudit: r.geoAudit ? JSON.parse(r.geoAudit) : null
    }));

    return NextResponse.json({ success: true, count: parsedReports.length, data: parsedReports });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
