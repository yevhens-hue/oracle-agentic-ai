import { NextResponse } from 'next/server';
import { runGptResearcher } from '@/lib/agents/gptResearcher';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const topic = body.topic || body.queryTopic || 'Анализ рынка линкбилдинг-платформ в США 2026: игроки, ценники, доли';
    const depth = body.depth || 'deep';

    const result = await runGptResearcher(topic, depth);

    try {
      await db.gptResearchReport.create({
        data: {
          topic: result.topic,
          reportMarkdown: result.reportMarkdown,
          sourcesCount: result.sourcesCount,
          citationSources: JSON.stringify(result.citationSources)
        }
      });
    } catch (dbErr) {
      console.warn("DB save warning:", dbErr);
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'GPT-Researcher analysis failed' },
      { status: 500 }
    );
  }
}
