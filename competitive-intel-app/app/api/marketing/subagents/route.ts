import { NextResponse } from 'next/server';
import { runMarketingSubagentsSuite, runIndividualMarketingSubagent } from '@/lib/agents/marketingSubagents';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const targetDomain = body.targetDomain || body.target_domain || 'collaborator.pro';
    const category = body.category || 'all';
    const agentId = body.agentId || body.agent_id;

    if (agentId) {
      const result = runIndividualMarketingSubagent(targetDomain, agentId);
      return NextResponse.json({ success: true, isIndividual: true, data: result });
    }

    const result = runMarketingSubagentsSuite(targetDomain, category);
    return NextResponse.json({ success: true, isIndividual: false, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Marketing subagents execution failed' },
      { status: 500 }
    );
  }
}
