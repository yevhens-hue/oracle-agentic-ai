import { describe, it, expect } from 'vitest';
import { generateSchemaJsonLdSnippet } from '../lib/agents/geoSimulator';
import { calculateFeatureCoverageGap } from '../lib/agents/competitiveIntel';
import { generateRobotsTxtSnippet } from '../lib/agents/advertoolsAudit';

describe('TDD Suite: Deep Interactive 9-Tab Expansions', () => {

  it('1. GEO Simulator: should generate valid Schema.org JSON-LD code snippet for auto-fix', () => {
    const snippet = generateSchemaJsonLdSnippet('adsy.com', 'FAQPage');

    expect(snippet).toContain('"@context": "https://schema.org"');
    expect(snippet).toContain('"@type": "FAQPage"');
    expect(snippet).toContain('adsy.com');
  });

  it('2. CrewAI Intel: should calculate feature coverage gap % vs competitors', () => {
    const gapAnalysis = calculateFeatureCoverageGap('Adsy', ['Collaborator.pro', 'Accessily']);

    expect(gapAnalysis).toHaveProperty('targetCoveragePercent');
    expect(gapAnalysis.targetCoveragePercent).toBeGreaterThanOrEqual(80);
    expect(gapAnalysis.missingFeatures.length).toBeGreaterThan(0);
  });

  it('3. 8-Bot GEO Audit: should generate compliant robots.txt allowing 8 AI bots', () => {
    const robotsTxt = generateRobotsTxtSnippet('adsy.com');

    expect(robotsTxt).toContain('User-agent: GPTBot');
    expect(robotsTxt).toContain('Allow: /');
    expect(robotsTxt).toContain('User-agent: PerplexityBot');
    expect(robotsTxt).toContain('User-agent: ClaudeBot');
  });

});
