import { NextResponse } from 'next/server';
import { performFirecrawlScrape } from '@/lib/scrapers/firecrawlEngine';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const targetUrl = body.targetUrl || body.domain_url || 'https://collaborator.pro';
    const crawlMode = body.crawlMode || body.crawl_mode || 'single_page';

    const result = performFirecrawlScrape(targetUrl, crawlMode);

    try {
      await db.scrapedContent.create({
        data: {
          targetUrl: result.targetUrl,
          engine: 'firecrawl',
          contentMarkdown: result.contentMarkdown,
          structuredJson: JSON.stringify(result.structuredJson)
        }
      });
    } catch (err) {
      console.warn("DB save warning:", err);
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Firecrawl scrape failed' },
      { status: 500 }
    );
  }
}
