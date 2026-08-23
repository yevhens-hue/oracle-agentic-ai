import { describe, it, expect } from 'vitest';
import { runNexscopeNicheValidation } from '../lib/agents/nexscopeSkills';

describe('TDD Suite: Nexscope E-Commerce & Niche Validation Skills', () => {

  it('should calculate commercial potential score (0-100) and market sizing', async () => {
    const result = await runNexscopeNicheValidation('Link Building & Guest Post Marketplaces');

    expect(result).toHaveProperty('nicheName');
    expect(result.commercialPotentialScore).toBeGreaterThanOrEqual(0);
    expect(result.commercialPotentialScore).toBeLessThanOrEqual(100);
    expect(result.marketSizingUsd).toContain('$');
  });

  it('should extract top customer pain points and frustration signals', async () => {
    const result = await runNexscopeNicheValidation('Link Building & Guest Post Marketplaces');

    expect(result.customerPains.length).toBeGreaterThan(0);
    expect(result.customerPains[0]).toHaveProperty('painCategory');
    expect(result.customerPains[0]).toHaveProperty('severityScore');
  });

  it('should identify white-space market opportunities', async () => {
    const result = await runNexscopeNicheValidation('Link Building & Guest Post Marketplaces');

    expect(result.whiteSpaceOpportunities.length).toBeGreaterThan(0);
    expect(result.whiteSpaceOpportunities[0]).toHaveProperty('opportunityTitle');
    expect(result.whiteSpaceOpportunities[0]).toHaveProperty('potentialRevenueGrowth');
  });

  it('should project unit economics metrics (LTV, CAC, Margin %)', async () => {
    const result = await runNexscopeNicheValidation('Link Building & Guest Post Marketplaces');

    expect(result.unitEconomics).toHaveProperty('estimatedLtvUsd');
    expect(result.unitEconomics).toHaveProperty('estimatedCacUsd');
    expect(result.unitEconomics).toHaveProperty('grossMarginPercent');
    expect(result.unitEconomics.grossMarginPercent).toBeGreaterThan(50);
  });

});
