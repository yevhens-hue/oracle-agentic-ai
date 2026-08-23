import { NextResponse } from 'next/server';
import { performCrawl4AiScrape } from '@/lib/scrapers/crawl4aiEngine';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const targetUrl = body.targetUrl || body.target_url || 'https://collaborator.pro';
    const maxPages = body.maxPages || body.max_pages || 10;
    const extractStrategy = body.extractStrategy || body.extract_strategy || 'cosine_similarity';

    const result = performCrawl4AiScrape(targetUrl, maxPages, extractStrategy);

    try {
      await db.scrapedContent.create({
        data: {
          targetUrl: result.targetUrl,
          engine: 'crawl4ai',
          contentMarkdown: result.rawMarkdownContent,
          structuredJson: JSON.stringify(result.semanticChunks),
          ragReadinessScore: result.ragVectorReadinessScore
        }
      });
    } catch (err) {
      console.warn("DB save warning:", err);
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Crawl4AI scrape failed' },
      { status: 500 }
    );
  }
}
