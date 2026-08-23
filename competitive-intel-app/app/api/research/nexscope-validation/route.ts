import { NextResponse } from 'next/server';
import { runNexscopeNicheValidation } from '@/lib/agents/nexscopeSkills';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nicheOrDomain = body.nicheOrDomain || body.niche_domain || 'Link Building & Guest Post Marketplaces';

    const result = await runNexscopeNicheValidation(nicheOrDomain);

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Nexscope niche validation failed' },
      { status: 500 }
    );
  }
}
