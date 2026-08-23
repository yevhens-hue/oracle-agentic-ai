import { NextResponse } from 'next/server';
import { runAgentEvalsBenchmark, evaluateToolGovernance, getLcelHandoffChain } from '@/lib/agents/agentEvalsGovernance';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const agentName = body.agentName || body.agent_name || 'GPT-Researcher';
    const toolName = body.toolName || body.tool_name || 'firecrawl_scrape';
    const targetCompany = body.targetCompany || body.target_company || 'Adsy';

    const agentEvals = await runAgentEvalsBenchmark(agentName);
    const governance = evaluateToolGovernance(toolName, body.payload || {});
    const handoffChain = getLcelHandoffChain(targetCompany);

    return NextResponse.json({
      success: true,
      data: {
        agentEvals,
        governance,
        handoffChain,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Agent evals & governance failed' },
      { status: 500 }
    );
  }
}
