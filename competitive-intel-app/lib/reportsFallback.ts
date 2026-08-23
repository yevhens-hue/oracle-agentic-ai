export function getFallbackReports() {
  return [
    {
      id: 'rep-1',
      targetCompany: 'Adsy',
      industryDomain: 'MarTech & Link Growth Marketplace',
      threatScore: 42.5,
      executiveSummary: `Executive Competitive Intelligence Briefing for Adsy:\n\n• Market Position: Adsy maintains a leading inventory footprint in MarTech & Link Growth Marketplace with 100,000+ verified publisher domains.\n• Technical Vulnerability: 38% of high-intent search traffic is shifting to LLM Answer Engines (ChatGPT, Perplexity).\n• Strategic Roadmap: Upgrade to an AI-First Agentic Link Engine, enforcing 8-Bot Crawler Permission Vetting and launching a Hybrid SaaS subscription tier.`,
      swotAnalysis: {
        strengths: [
          'Dominant market presence with 100,000+ verified publisher inventory.',
          'Transparent SEO metrics (Moz, Ahrefs, Majestic).',
          'Self-serve marketplace ease-of-use for advertisers.'
        ],
        weaknesses: [
          'Pay-per-link model yields lower LTV than SaaS subscriptions.',
          'Manual publisher editorial approval cycles add turn-around latency.'
        ],
        opportunities: [
          'Transitioning to Hybrid SaaS ($99 - $299/mo) + Marketplace Fee.',
          'Deploying 8-bot AI crawler permission checker.',
          'Launching GEO suite for ChatGPT & Perplexity citations.'
        ],
        threats: [
          'Rapid adoption of AI outreach automation tools.',
          'Regional competitors expanding with API-first integrations.'
        ]
      },
      featureMatrix: {
        'Adsy': { inventory: '100,000+ Sites', aiAutomation: 'In-Progress (8-Bot Scanner)', saasModel: 'Hybrid Target', geoSupport: 'Advanced' },
        'Collaborator.pro': { inventory: '43,000+ Sites', aiAutomation: 'Basic API', saasModel: 'No', geoSupport: 'Limited' },
        'Accessily': { inventory: '15,000+ Sites', aiAutomation: 'Low', saasModel: 'SaaS Tier', geoSupport: 'None' }
      },
      geoAudit: {
        domain: 'adsy.com',
        seo_health_score: 92,
        geo_readiness_score: 88,
        ai_bots_status: [
          { bot_name: "GPTBot", user_agent: "GPTBot", allowed: true, impact_description: "Powers ChatGPT Web Search citations" },
          { bot_name: "PerplexityBot", user_agent: "PerplexityBot", allowed: true, impact_description: "Powers Perplexity.ai citations" },
          { bot_name: "ClaudeBot", user_agent: "ClaudeBot", allowed: true, impact_description: "Powers Anthropic Claude search" }
        ],
        schema_types: [
          { schema_type: "FAQPage", detected: true, geo_impact: "Critical — Direct source for Q&A" },
          { schema_type: "Organization", detected: true, geo_impact: "High — Brand entity validation" }
        ]
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'rep-2',
      targetCompany: 'Collaborator.pro',
      industryDomain: 'European Link Marketplace',
      threatScore: 58.0,
      executiveSummary: `Competitive Intelligence Briefing for Collaborator.pro:\n\n• Strong regional presence in European CEE markets.\n• Ahrefs API integration provides live DR metrics.\n• Vulnerability: Lacks automated 8-bot crawler permission checks and GEO optimization suite.`,
      swotAnalysis: {
        strengths: ['43,000+ verified European sites', 'Ahrefs live DR metric sync'],
        weaknesses: ['No SaaS subscription pricing', 'No GEO Schema generator'],
        opportunities: ['Expand into US guest posting market'],
        threats: ['Adsy expansion with AI bot scanning']
      },
      featureMatrix: {
        'Collaborator.pro': { inventory: '43,000+ Sites', aiAutomation: 'Basic API', saasModel: 'No', geoSupport: 'Limited' },
        'Adsy': { inventory: '100,000+ Sites', aiAutomation: 'In-Progress (8-Bot Scanner)', saasModel: 'Hybrid Target', geoSupport: 'Advanced' }
      },
      geoAudit: null,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];
}
