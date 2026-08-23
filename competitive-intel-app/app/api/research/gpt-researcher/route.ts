import { NextResponse } from 'next/server';
import { runGptResearcher } from '@/lib/agents/gptResearcher';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const topic = body.topic || body.queryTopic || 'Анализ рынка линкбилдинг-платформ в США 2026: игроки, ценники, доли';

    const result = await runGptResearcher(topic);

    let savedRecord = null;
    try {
      savedRecord = await db.gptResearchReport.create({
        data: {
          topic: result.topic,
          reportMarkdown: result.reportMarkdown,
          sourcesCount: result.sourcesCount,
          citationSources: JSON.stringify(result.citationSources)
        }
      });
    } catch (err) {
      console.warn("DB save warning:", err);
    }

    return NextResponse.json({
      success: true,
      data: result,
      dbId: savedRecord?.id || null
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'GPT-Researcher execution failed' },
      { status: 500 }
    );
  }
}
