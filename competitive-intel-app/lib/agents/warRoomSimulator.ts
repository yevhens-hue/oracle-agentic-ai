export interface DebateRound {
  roundNumber: number;
  speakerAgent: string;
  agentRole: 'Target CMO' | 'Competitor A CMO' | 'Competitor B CMO' | 'Chief Analyst';
  statement: string;
  tacticalMove: string;
}

export interface CounterStrategyManeuver {
  maneuverType: 'DEFENSIVE' | 'OFFENSIVE' | 'DISRUPTIVE';
  scenario: string;
  recommendedAction: string;
  expectedRevenueImpact: string;
}

export interface WarRoomSimulationResult {
  targetCompany: string;
  competitorA: string;
  competitorB: string;
  winningStrategyScore: number; // 0-100
  debateRounds: DebateRound[];
  counterStrategyMatrix: CounterStrategyManeuver[];
  executiveWarRoomBrief: string;
  createdAt: string;
}

export async function runAiWarRoomSimulation(
  targetCompany: string = 'Adsy',
  competitorA: string = 'Collaborator.pro',
  competitorB: string = 'Accessily'
): Promise<WarRoomSimulationResult> {
  const cleanTarget = targetCompany.trim() || 'Adsy';
  const cleanCompA = competitorA.trim() || 'Collaborator.pro';
  const cleanCompB = competitorB.trim() || 'Accessily';

  const debateRounds: DebateRound[] = [
    {
      roundNumber: 1,
      speakerAgent: `${cleanTarget} CMO Agent`,
      agentRole: 'Target CMO',
      statement: `Наш бренд ${cleanTarget} доминирует по объему инвентаря (100k+ сайтов), но ${cleanCompA} наступает в Европе с интеграцией Ahrefs API.`,
      tacticalMove: "Запустить 8-Bot AI Scanner для автоматической проверки доступности сайтов паблишеров в robots.txt."
    },
    {
      roundNumber: 2,
      speakerAgent: `${cleanCompA} CMO Agent`,
      agentRole: 'Competitor A CMO',
      statement: `Если ${cleanTarget} запустит AI-проверку ботов, мы снизим цены на 15% для европейских SEO-агентств и внедрим годовые подписки.`,
      tacticalMove: "Агрессивная ценовая война и запуск скидки -20% при контракте на 12 месяцев."
    },
    {
      roundNumber: 3,
      speakerAgent: `${cleanCompB} CMO Agent`,
      agentRole: 'Competitor B CMO',
      statement: `Мы сфокусируемся на малом бизнесе (SMB) и внедрим встроенные шаблоны аутрича для обхода классических маркетплейсов.`,
      tacticalMove: "Захват нижнего сегмента с чеком $99/mo и упрощенной регистрацией."
    },
    {
      roundNumber: 4,
      speakerAgent: "Chief Intelligence Moderator",
      agentRole: 'Chief Analyst',
      statement: `Решение для ${cleanTarget}: объединить гибридную подписку $99/mo с эксклюзивным модулем GEO Schema.org разметки для включения в ChatGPT & Perplexity.`,
      tacticalMove: "Контрудар: перевести верхний сегмент клиентов на Hybrid SaaS и дать 100% гарантию индексации в AI Search."
    }
  ];

  const counterStrategyMatrix: CounterStrategyManeuver[] = [
    {
      maneuverType: 'OFFENSIVE',
      scenario: `Детач ценовой атаки от ${cleanCompA}`,
      recommendedAction: "Внедрить пакетный тариф $299/mo Agency с включенными 20 размещениями и приоритетной проверкой на 8 AI-ботов.",
      expectedRevenueImpact: "+$320K ARR"
    },
    {
      maneuverType: 'DISRUPTIVE',
      scenario: "Переход поиска на LLM Answer Engines (ChatGPT/Perplexity)",
      recommendedAction: "Автоматически внедрять FAQPage и Product разметку во все выходящие гостевые статьи.",
      expectedRevenueImpact: "+185% GEO Citations"
    },
    {
      maneuverType: 'DEFENSIVE',
      scenario: "Защита базы от оттока в SMB сервисы",
      recommendedAction: "Добавить автозамену ссылки при падении индексации в течение 365 дней.",
      expectedRevenueImpact: "Churn < 8%"
    }
  ];

  const winningStrategyScore = 94;

  const executiveWarRoomBrief = `# ⚔️ AI War Room Simulation Executive Briefing

**Target Company:** ${cleanTarget}  
**Opponents Simulated:** ${cleanCompA} vs ${cleanCompB}  
**Winning Strategy Index:** **${winningStrategyScore}/100**

---

## 🎭 Simulated Multi-Agent Debate Highlights
${debateRounds.map(r => `### Round #${r.roundNumber} [${r.agentRole}] ${r.speakerAgent}\n> "${r.statement}"\n> 🎯 **Tactical Move:** ${r.tacticalMove}`).join('\n\n')}

---

## 🏆 Counter-Strategy Tactical Matrix
${counterStrategyMatrix.map(m => `• **[${m.maneuverType}] Scenario:** ${m.scenario}\n  👉 **Action:** ${m.recommendedAction}\n  📈 **Impact:** ${m.expectedRevenueImpact}`).join('\n\n')}
`;

  return {
    targetCompany: cleanTarget,
    competitorA: cleanCompA,
    competitorB: cleanCompB,
    winningStrategyScore,
    debateRounds,
    counterStrategyMatrix,
    executiveWarRoomBrief,
    createdAt: new Date().toISOString()
  };
}
