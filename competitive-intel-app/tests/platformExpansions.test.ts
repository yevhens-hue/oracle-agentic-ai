import { describe, it, expect } from 'vitest';
import { runGptResearcher } from '../lib/agents/gptResearcher';
import { performFirecrawlScrape } from '../lib/scrapers/firecrawlEngine';
import { performCrawl4AiScrape } from '../lib/scrapers/crawl4aiEngine';
import { simulateGeoAnswerEngine } from '../lib/agents/geoSimulator';
import { runNexscopeNicheValidation } from '../lib/agents/nexscopeSkills';

describe('TDD Suite: 9-Tab Platform Expansions', () => {

  it('1. GPT-Researcher: should support depth modes (fast vs deep) and mermaid charts', async () => {
    const fastResult = await runGptResearcher('Link Building', 'fast');
    const deepResult = await runGptResearcher('Link Building', 'deep');

    expect(fastResult.sourcesCount).toBe(5);
    expect(deepResult.sourcesCount).toBe(20);
    expect(deepResult.reportMarkdown).toContain('quadrantChart');
  });

  it('2. Firecrawl Scraper: should return crawl subpage tree and release timeline', () => {
    const result = performFirecrawlScrape('https://collaborator.pro', 'deep_crawl');

    expect(result.subpagesTree.length).toBeGreaterThan(0);
    expect(result.releaseSignals.length).toBeGreaterThan(0);
  });

  it('3. Crawl4AI RAG Scraper: should perform 1536-dim vector similarity comparison', () => {
    const result = performCrawl4AiScrape('https://collaborator.pro', 10, 'cosine_similarity', 512);

    expect(result.semanticChunks[0]).toHaveProperty('vectorPreview');
    expect(result.semanticChunks[0].vectorPreview.length).toBe(8);
  });

  it('4. GEO Answer Simulator: should support model selection (GPT-4o, Perplexity, Claude, Gemini)', () => {
    const result = simulateGeoAnswerEngine('Top SEO Marketplaces 2026', 'adsy.com', 'gpt4o');

    expect(result.simulations.length).toBe(4);
    expect(result.simulations[0].engineName).toContain('GPT-4o');
  });

  it('5. Nexscope Niche Skills: should provide interactive unit economics forecast', async () => {
    const result = await runNexscopeNicheValidation('Link Building');

    expect(result.unitEconomics.estimatedLtvUsd).toBe(4200);
    expect(result.unitEconomics.grossMarginPercent).toBe(78);
  });

});
