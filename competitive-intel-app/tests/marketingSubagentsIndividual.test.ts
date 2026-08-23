import { describe, it, expect } from 'vitest';
import { runIndividualMarketingSubagent } from '../lib/agents/marketingSubagents';

describe('TDD Suite: Individual Marketing Subagent Execution (everything-claude-marketing)', () => {

  it('should run Technical SEO Auditor agent individually and return core web vitals', async () => {
    const result = await runIndividualMarketingSubagent('collaborator.pro', 'seo_auditor');

    expect(result).toHaveProperty('agentId', 'seo_auditor');
    expect(result).toHaveProperty('agentName', 'Technical SEO Auditor');
    expect(result.findings.length).toBeGreaterThan(0);
    expect(result.deepAnalysisMarkdown).toContain('Technical SEO Auditor');
  });

  it('should run Conversion Funnel Auditor agent individually and return dropoff points', async () => {
    const result = await runIndividualMarketingSubagent('collaborator.pro', 'funnel_auditor');

    expect(result).toHaveProperty('agentId', 'funnel_auditor');
    expect(result.findings.length).toBeGreaterThan(0);
    expect(result.deepAnalysisMarkdown).toContain('Funnel Auditor');
  });

  it('should run Executive CMO Strategist agent individually and return 90-day roadmap', async () => {
    const result = await runIndividualMarketingSubagent('collaborator.pro', 'cmo_strategist');

    expect(result).toHaveProperty('agentId', 'cmo_strategist');
    expect(result.findings.length).toBeGreaterThan(0);
    expect(result.deepAnalysisMarkdown).toContain('Executive CMO');
  });

});
