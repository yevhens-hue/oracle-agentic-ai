import { describe, it, expect } from 'vitest';
import { runGptResearcher } from '../lib/agents/gptResearcher';
import { runMarketingSubagentsSuite } from '../lib/agents/marketingSubagents';

describe('TDD Suite: 9-Tab Advanced Settings Controls', () => {

  it('1. GPT-Researcher: should accept language and format settings', async () => {
    const res = await runGptResearcher('Link building market 2026', 'deep', {
      format: 'Executive Summary',
      language: 'EN'
    });

    expect(res.reportMarkdown).toContain('Executive Summary');
    expect(res.reportMarkdown).toContain('2026');
  });

  it('2. Marketing Subagents: should accept persona and mode settings', () => {
    const res = runMarketingSubagentsSuite('collaborator.pro', 'all', {
      persona: 'B2B Enterprise',
      executionMode: 'parallel'
    });

    expect(res.rawMarkdownReport).toContain('B2B Enterprise');
    expect(res.rawMarkdownReport).toContain('collaborator.pro');
  });

});
