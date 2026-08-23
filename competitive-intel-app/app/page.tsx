'use client';

import React, { useState } from 'react';
import GptResearcherPanel from '@/components/GptResearcherPanel';
import CrewAiPanel from '@/components/CrewAiPanel';
import FirecrawlPanel from '@/components/FirecrawlPanel';
import Crawl4AiPanel from '@/components/Crawl4AiPanel';
import CompetitorTrackerPanel from '@/components/CompetitorTrackerPanel';
import MarketingSubagentsPanel from '@/components/MarketingSubagentsPanel';
import GeoSimulatorPanel from '@/components/GeoSimulatorPanel';
import GeoAuditBadges from '@/components/GeoAuditBadges';
import { performAdvertoolsAudit } from '@/lib/agents/advertoolsAudit';
import { Globe, Users, Flame, Cpu, Activity, ShieldCheck, Sparkles, Bot } from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'gpt' | 'crew' | 'firecrawl' | 'crawl4ai' | 'tracker' | 'marketing' | 'geosim' | 'geo'>('gpt');
  const [defaultGeoAudit] = useState(() => performAdvertoolsAudit('https://www.adsy.com'));

  const tabs = [
    { id: 'gpt', label: 'GPT-Researcher (★17k+)', icon: Globe, badge: 'R&D Reports' },
    { id: 'crew', label: 'CrewAI Intel Workflow', icon: Users, badge: 'SWOT & Matrix' },
    { id: 'firecrawl', label: 'Firecrawl Scraper (★20k+)', icon: Flame, badge: 'Pricing & Markdown' },
    { id: 'crawl4ai', label: 'Crawl4AI RAG Scraper (★25k+)', icon: Cpu, badge: 'Vector Chunks' },
    { id: 'tracker', label: 'Competitor Tracker', icon: Activity, badge: 'Live Change Log' },
    { id: 'marketing', label: '18 Marketing Subagents', icon: Sparkles, badge: 'everything-claude' },
    { id: 'geosim', label: 'GEO Answer Simulator', icon: Bot, badge: 'ChatGPT & Perplexity' },
    { id: 'geo', label: '8-Bot GEO Audit', icon: ShieldCheck, badge: 'robots.txt & Schema' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white tracking-tight">
          Competitive Intelligence & GEO Platform
        </h1>
        <p className="text-sm text-gray-400 max-w-4xl">
          Единый корпоративный комплекс для R&D исследований, парсинга ценников, векторизации, трекинга конкурентов, 18 маркетинговых субагентов и симуляции цитирования в AI Search Engines (ChatGPT, Perplexity, Claude).
        </p>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-sky-500/20 to-indigo-500/20 border border-sky-500/40 text-white shadow-lg'
                  : 'bg-dark-800/60 border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800/40'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-gray-400'}`} />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${isActive ? 'bg-sky-500/20 text-sky-300' : 'bg-gray-800 text-gray-400'}`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Tab View */}
      <div className="pt-2">
        {activeTab === 'gpt' && <GptResearcherPanel />}
        {activeTab === 'crew' && <CrewAiPanel />}
        {activeTab === 'firecrawl' && <FirecrawlPanel />}
        {activeTab === 'crawl4ai' && <Crawl4AiPanel />}
        {activeTab === 'tracker' && <CompetitorTrackerPanel />}
        {activeTab === 'marketing' && <MarketingSubagentsPanel />}
        {activeTab === 'geosim' && <GeoSimulatorPanel />}
        {activeTab === 'geo' && <GeoAuditBadges audit={defaultGeoAudit} />}
      </div>
    </div>
  );
}
