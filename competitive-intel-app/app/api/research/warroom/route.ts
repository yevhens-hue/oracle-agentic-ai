import { NextResponse } from 'next/server';
import { runAiWarRoomSimulation } from '@/lib/agents/warRoomSimulator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const targetCompany = body.targetCompany || body.target_company || 'Adsy';
    const competitorA = body.competitorA || body.competitor_a || 'Collaborator.pro';
    const competitorB = body.competitorB || body.competitor_b || 'Accessily';

    const result = await runAiWarRoomSimulation(targetCompany, competitorA, competitorB);

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'AI War Room simulation failed' },
      { status: 500 }
    );
  }
}
