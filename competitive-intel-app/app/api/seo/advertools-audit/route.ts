import { NextResponse } from 'next/server';
import { performAdvertoolsAudit } from '@/lib/agents/advertoolsAudit';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const domainUrl = body.domain_url || body.domainUrl || 'https://www.adsy.com';
    
    const result = performAdvertoolsAudit(domainUrl);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Advertools audit failed' },
      { status: 500 }
    );
  }
}
