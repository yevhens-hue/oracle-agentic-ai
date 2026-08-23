import { describe, it, expect } from 'vitest';
import { runAiWarRoomSimulation } from '../lib/agents/warRoomSimulator';

describe('TDD Suite: Interactive AI War Room Simulator & Scenario Planning', () => {

  it('should run 3-agent competitive debate simulation and output scenario rounds', async () => {
    const result = await runAiWarRoomSimulation('Adsy', 'Collaborator.pro', 'Accessily');

    expect(result).toHaveProperty('targetCompany', 'Adsy');
    expect(result.debateRounds.length).toBeGreaterThanOrEqual(3);
    expect(result.debateRounds[0]).toHaveProperty('speakerAgent');
    expect(result.counterStrategyMatrix.length).toBeGreaterThan(0);
  });

  it('should generate defensive and offensive tactical maneuvers', async () => {
    const result = await runAiWarRoomSimulation('Adsy', 'Collaborator.pro', 'Accessily');

    expect(result).toHaveProperty('winningStrategyScore');
    expect(result.winningStrategyScore).toBeGreaterThan(80);
    expect(result.counterStrategyMatrix[0]).toHaveProperty('maneuverType');
  });

});
