import { describe, it, expect } from 'vitest';
import { getFallbackReports } from '../lib/reportsFallback';

describe('TDD Suite: Saved Reports History Reliability', () => {

  it('should return non-empty fallback reports array when DB is offline', () => {
    const fallbacks = getFallbackReports();

    expect(fallbacks.length).toBeGreaterThan(0);
    expect(fallbacks[0]).toHaveProperty('targetCompany', 'Adsy');
    expect(fallbacks[0]).toHaveProperty('executiveSummary');
    expect(fallbacks[0]).toHaveProperty('threatScore');
  });

});
