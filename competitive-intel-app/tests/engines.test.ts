import { describe, it, expect } from 'vitest';
import { runGptResearcher } from '../lib/agents/gptResearcher';
import { runCompetitiveIntelligencePipeline } from '../lib/agents/competitiveIntel';
import { performFirecrawlScrape } from '../lib/scrapers/firecrawlEngine';
import { performCrawl4AiScrape } from '../lib/scrapers/crawl4aiEngine';
import { runMarketingSubagentsSuite } from '../lib/agents/marketingSubagents';
import { simulateGeoAnswerEngine } from '../lib/agents/geoSimulator';
import { performAdvertoolsAudit } from '../lib/agents/advertoolsAudit';

describe('TDD Suite: Competitive Intelligence & GEO Platform Engines', () => {

  describe('1. GPT-Researcher Engine', () => {
    it('should generate a structured markdown report with citations and market share table', async () => {
      const topic = 'Link Building Marketplaces 2026';
      const result = await runGptResearcher(topic);

      expect(result).toHaveProperty('reportMarkdown');
      expect(result).toHaveProperty('sourcesCount');
      expect(result.sourcesCount).toBeGreaterThanOrEqual(5);
      expect(result.reportMarkdown).toContain('GPT-Researcher Autonomous Report');
      expect(result.reportMarkdown).toContain('Scanned Sources & Citations');
    });
  });

  describe('2. CrewAI Multi-Agent Pipeline', () => {
    it('should calculate threat score and return SWOT analysis matrix', async () => {
      const report = await runCompetitiveIntelligencePipeline({
        targetCompany: 'Adsy',
        competitors: ['Collaborator.pro', 'Accessily'],
        industryDomain: 'MarTech Marketplace'
      });

      expect(report.targetCompany).toBe('Adsy');
      expect(report.threatScore).toBeGreaterThanOrEqual(0);
      expect(report.threatScore).toBeLessThanOrEqual(100);
      expect(report.swotAnalysis.strengths.length).toBeGreaterThan(0);
      expect(report.swotAnalysis.weaknesses.length).toBeGreaterThan(0);
    });
  });

  describe('3. Firecrawl Scraper Engine', () => {
    it('should bypass JS rendering, extract clean markdown and pricing signals', () => {
      const url = 'https://collaborator.pro';
      const result = performFirecrawlScrape(url);

      expect(result.domain).toBe('collaborator.pro');
      expect(result.contentMarkdown).toContain('Scraped via Firecrawl');
      expect(result.detectedPricing.length).toBeGreaterThan(0);
    });
  });

  describe('4. Crawl4AI RAG Scraper Engine', () => {
    it('should perform semantic chunking, 1536-dim vector previews, and pgvector SQL export', () => {
      const url = 'https://collaborator.pro';
      const result = performCrawl4AiScrape(url, 10, 'llm_entity_extraction', 256);

      expect(result.domain).toBe('collaborator.pro');
      expect(result.chunkSizeTokens).toBe(256);
      expect(result.extractionStrategy).toBe('llm_entity_extraction');
      expect(result.ragVectorReadinessScore).toBeGreaterThan(90);
      expect(result.semanticChunks.length).toBeGreaterThan(0);
      expect(result.semanticChunks[0].vectorPreview.length).toBe(8);
      expect(result.pgvectorFullSql).toContain('CREATE EXTENSION IF NOT EXISTS vector;');
    });
  });

  describe('5. 18 Marketing Subagents Suite', () => {
    it('should run all 18 subagents, calculate scores, and generate CMO roadmap', () => {
      const domain = 'collaborator.pro';
      const result = runMarketingSubagentsSuite(domain, 'all');

      expect(result.targetDomain).toBe('collaborator.pro');
      expect(result.executedAgentsCount).toBe(18);
      expect(result.seoScore).toBeGreaterThan(0);
      expect(result.croScore).toBeGreaterThan(0);
      expect(result.executiveCmoRoadmap.length).toBe(3);
    });
  });

  describe('6. GEO Answer Engine Simulator', () => {
    it('should test prompt visibility across ChatGPT, Perplexity, Claude & Gemini', () => {
      const prompt = 'Top link building marketplaces 2026';
      const domain = 'adsy.com';
      const result = simulateGeoAnswerEngine(prompt, domain);

      expect(result.targetDomain).toBe('adsy.com');
      expect(result.overallCitationScore).toBeGreaterThan(0);
      expect(result.simulations.length).toBe(4);
      expect(result.simulations[0].engineName).toContain('ChatGPT');
    });
  });

  describe('7. 8-Bot GEO & Advertools Audit', () => {
    it('should inspect robots.txt for 8 AI crawlers and Schema.org microdata', () => {
      const domain = 'https://adsy.com';
      const audit = performAdvertoolsAudit(domain);

      expect(audit.ai_bots_status.length).toBe(8);
      expect(audit.geo_readiness_score).toBeGreaterThanOrEqual(90);
      expect(audit.schema_types.length).toBeGreaterThan(0);
    });
  });

});
