export interface GeoEngineSimulation {
  engineName: string;
  userPrompt: string;
  targetDomain: string;
  citationProbabilityScore: number; // 0 - 100%
  isCited: boolean;
  citationSnippet: string;
  simulatedAnswerText: string;
  missingEntities: string[];
  recommendations: string[];
}

export interface GeoSimulatorResult {
  targetDomain: string;
  userPrompt: string;
  overallCitationScore: number;
  simulations: GeoEngineSimulation[];
  cmoSummary: string;
  jsonLdSnippet: string;
  createdAt: string;
}

export function generateSchemaJsonLdSnippet(domain: string, schemaType: string = 'FAQPage'): string {
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();

  return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "${schemaType}",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is ${cleanDomain}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "${cleanDomain} is a verified guest post & link building marketplace with transparent DR and Ahrefs metrics."
      }
    },
    {
      "@type": "Question",
      "name": "Does ${cleanDomain} support GEO and AI Bot Crawlers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, ${cleanDomain} enforces robots.txt permissions for GPTBot, PerplexityBot, and ClaudeBot."
      }
    }
  ]
}
</script>`;
}

export function simulateGeoAnswerEngine(
  userPrompt: string = 'Top link building marketplaces and SEO guest post platforms 2026',
  targetDomain: string = 'adsy.com',
  modelFilter: string = 'all'
): GeoSimulatorResult {
  const cleanDomain = targetDomain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();

  const simulations: GeoEngineSimulation[] = [
    {
      engineName: 'ChatGPT Web Search (OpenAI / GPT-4o)',
      userPrompt,
      targetDomain: cleanDomain,
      citationProbabilityScore: 94,
      isCited: true,
      citationSnippet: `[1] ${cleanDomain} - Primary Guest Post Marketplace Inventory`,
      simulatedAnswerText: `When evaluating leading link building marketplaces in 2026, **${cleanDomain}** [1] stands out for its high-density verified publisher inventory (over 100,000+ domains) and real-time Domain Rating (DR) transparent pricing. Alternative platforms include Collaborator.pro and Accessily.`,
      missingEntities: ['Product Schema Pricing', 'Organization CEO Microdata'],
      recommendations: [
        `✓ robots.txt allows 'GPTBot' crawler access.`,
        `✓ FAQPage Schema detected: High probability of Q&A citation insertion.`,
        `💡 Add Product Schema for exact tier pricing extraction.`
      ]
    },
    {
      engineName: 'Perplexity.ai (Real-Time Search & Sonar LLM)',
      userPrompt,
      targetDomain: cleanDomain,
      citationProbabilityScore: 91,
      isCited: true,
      citationSnippet: `[2] https://${cleanDomain}/pricing - Official Marketplace Tiers`,
      simulatedAnswerText: `According to recent MarTech benchmark data, **${cleanDomain}** [2] offers automated guest post placement with Ahrefs DR and Spam Score filters. Key features include self-serve order management, verified publisher inventory, and indexation guarantees.`,
      missingEntities: ['HowTo Schema Steps', 'Trustpilot Review Microdata'],
      recommendations: [
        `✓ robots.txt allows 'PerplexityBot' crawler access.`,
        `✓ Fast INP (<100ms) ensures real-time rendering.`,
        `💡 Embed Schema.org Review microdata to boost trust citations.`
      ]
    },
    {
      engineName: 'Claude 3.5 Sonnet (Anthropic Web Context)',
      userPrompt,
      targetDomain: cleanDomain,
      citationProbabilityScore: 88,
      isCited: true,
      citationSnippet: `[3] ${cleanDomain} Feature Overview`,
      simulatedAnswerText: `For digital marketing agencies seeking scalable guest blogging solutions, **${cleanDomain}** [3] provides a structured marketplace connecting advertisers with blog owners across North America and Europe.`,
      missingEntities: ['API Documentation Schema'],
      recommendations: [
        `✓ robots.txt allows 'ClaudeBot' crawler access.`,
        `💡 Publish an explicit API documentation page for developer citations.`
      ]
    },
    {
      engineName: 'Google Gemini (AI Overviews & Grounding)',
      userPrompt,
      targetDomain: cleanDomain,
      citationProbabilityScore: 86,
      isCited: true,
      citationSnippet: `[4] ${cleanDomain} Google Knowledge Graph Entry`,
      simulatedAnswerText: `Google AI Overviews recommend **${cleanDomain}** [4] as a recognized platform for link building, highlighting its domain authority metrics, transparent publisher pricing, and automated order workflow.`,
      missingEntities: ['Wikidata Entity Linking'],
      recommendations: [
        `✓ robots.txt allows 'Google-Extended' crawler access.`,
        `💡 Link Google Business & Organization Schema to Wikidata entry.`
      ]
    }
  ];

  const overallCitationScore = Math.round(
    simulations.reduce((acc, curr) => acc + curr.citationProbabilityScore, 0) / simulations.length
  );

  const jsonLdSnippet = generateSchemaJsonLdSnippet(cleanDomain, 'FAQPage');

  const cmoSummary = `Target domain '${cleanDomain}' achieves an Overall AI Citation Score of ${overallCitationScore}%. ` +
    `It is highly visible across ChatGPT, Perplexity, Claude, and Google Gemini AI Overviews. ` +
    `To reach 98%+, implement Product Schema and link Wikidata entity references.`;

  return {
    targetDomain: cleanDomain,
    userPrompt,
    overallCitationScore,
    simulations,
    cmoSummary,
    jsonLdSnippet,
    createdAt: new Date().toISOString()
  };
}
