import { describe, it, expect } from 'vitest';
import { runGptResearcher } from '../lib/agents/gptResearcher';
import { runIndividualMarketingSubagent, MARKETING_SUBAGENTS } from '../lib/agents/marketingSubagents';

describe('TDD Suite: Auto-Trigger UI Handlers', () => {

  it('1. GPT-Researcher: depth change should return deep research payload with mermaid chart', async () => {
    const res = await runGptResearcher('Анализ рынка', 'deep');

    expect(res.sourcesCount).toBe(20);
    expect(res.reportMarkdown).toContain('quadrantChart');
  });

  it('2. Marketing Subagents: single subagent launcher should return individual result for all 18 IDs', () => {
    MARKETING_SUBAGENTS.forEach((agent) => {
      const res = runIndividualMarketingSubagent('collaborator.pro', agent.id);
      expect(res.agentId).toBe(agent.id);
      expect(res.agentName).toBe(agent.name);
      expect(res.deepAnalysisMarkdown.length).toBeGreaterThan(50);
    });
  });

});
