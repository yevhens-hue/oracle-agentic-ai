import { NextResponse } from 'next/server';
import { simulateGeoAnswerEngine } from '@/lib/agents/geoSimulator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userPrompt = body.userPrompt || body.user_prompt || 'Top link building marketplaces and SEO guest post platforms 2026';
    const targetDomain = body.targetDomain || body.target_domain || 'adsy.com';

    const result = simulateGeoAnswerEngine(userPrompt, targetDomain);

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'GEO answer engine simulation failed' },
      { status: 500 }
    );
  }
}
