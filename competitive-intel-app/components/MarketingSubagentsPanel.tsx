'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2, Search, AlertTriangle, CheckCircle2, TrendingUp, ShieldCheck, Zap, Award, Layers, Play } from 'lucide-react';
import { MARKETING_SUBAGENTS, MarketingSubagentRunResult, IndividualSubagentResult } from '@/lib/agents/marketingSubagents';

export default function MarketingSubagentsPanel() {
  const [targetDomain, setTargetDomain] = useState('collaborator.pro');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'seo' | 'cro' | 'growth'>('all');
  const [suiteResult, setSuiteResult] = useState<MarketingSubagentRunResult | null>(null);
  const [individualResult, setIndividualResult] = useState<IndividualSubagentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [runningAgentId, setRunningAgentId] = useState<string | null>(null);

  const handleRunSuite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetDomain.trim()) return;
    setIsLoading(true);
    setIndividualResult(null);

    try {
      const res = await fetch('/api/marketing/subagents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetDomain, category: selectedCategory }),
      });
      const json = await res.json();
      if (json.success) {
        setSuiteResult(json.data);
      }
    } catch (err) {
      console.error('Marketing subagents error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunSingleAgent = async (agentId: string) => {
    if (!targetDomain.trim()) return;
    setRunningAgentId(agentId);

    try {
      const res = await fetch('/api/marketing/subagents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetDomain, agentId }),
      });
      const json = await res.json();
      if (json.success) {
        setIndividualResult(json.data);
      }
    } catch (err) {
      console.error('Single agent error:', err);
    } finally {
      setRunningAgentId(null);
    }
  };

  const filteredAgents = selectedCategory === 'all'
    ? MARKETING_SUBAGENTS
    : MARKETING_SUBAGENTS.filter(a => a.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header & Launcher Form */}
      <div className="p-6 rounded-2xl bg-dark-800/80 border border-gray-800 backdrop-blur-md space-y-4 shadow-2xl">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">18 Marketing Subagents Suite (everything-claude-marketing)</h2>
        </div>
        <p className="text-xs text-gray-400">
          Набор из 18 специализированных субагентов для непрерывного SEO-аудита, оценки точек трения в воронке конверсий и построения 90-дневной CMO-стратегии.
        </p>

        <form onSubmit={handleRunSuite} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase">
              Целевой Домен / Маркетплейс для Маркетингового Аудита
            </label>
            <input
              type="text"
              value={targetDomain}
              onChange={(e) => setTargetDomain(e.target.value)}
              placeholder="e.g. collaborator.pro or accessily.com"
              className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm"
              required
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase">Кластер Субагентов</label>
            <div className="flex rounded-xl bg-dark-900 p-1 border border-gray-800">
              {[
                { id: 'all', label: 'Все 18 Субагентов' },
                { id: 'seo', label: 'SEO & Content (5)' },
                { id: 'cro', label: 'CRO & Funnel (5)' },
                { id: 'growth', label: 'Growth & Research (8)' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Запуск {filteredAgents.length} маркетинговых субагентов...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-yellow-300" />
                Запустить Комплексный Маркетинговый Аудит ({filteredAgents.length} Агентов)
              </>
            )}
          </button>
        </form>
      </div>

      {/* Agents Catalog Grid with Individual 1-Click Launchers */}
      <div className="p-5 rounded-2xl bg-dark-800/80 border border-gray-800 space-y-3">
        <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4 text-indigo-400" />
          Каталог 18 Субагентов (Кликните для индивидуального запуска)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {filteredAgents.map((agent) => (
            <div key={agent.id} className="p-3.5 rounded-xl bg-dark-900 border border-gray-800/80 space-y-2 hover:border-indigo-500/50 transition-all flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{agent.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase ${
                    agent.category === 'seo' ? 'bg-sky-500/20 text-sky-300' :
                    agent.category === 'cro' ? 'bg-amber-500/20 text-amber-300' : 'bg-purple-500/20 text-purple-300'
                  }`}>
                    {agent.category}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-snug">{agent.description}</p>
              </div>

              <button
                onClick={() => handleRunSingleAgent(agent.id)}
                disabled={runningAgentId === agent.id}
                className="w-full py-1.5 px-3 rounded-lg bg-gray-800 hover:bg-indigo-600 text-gray-200 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {runningAgentId === agent.id ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Запуск...
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-indigo-400 fill-indigo-400" />
                    Запустить Агента
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Agent Single Result */}
      {individualResult && (
        <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Отдельный Отчёт Субагента: <code className="font-mono text-indigo-300">{individualResult.agentName}</code>
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              Score: {individualResult.score}/100
            </span>
          </div>

          <div className="space-y-2">
            {individualResult.findings?.map((f, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-dark-900 border border-gray-800 text-xs flex items-center justify-between">
                <span className="font-bold text-white">{f.title}</span>
                <span className="text-gray-300">{f.detail}</span>
              </div>
            ))}
          </div>

          <pre className="text-xs font-mono bg-dark-950 p-4 rounded-xl border border-gray-800 text-gray-300 max-h-60 overflow-y-auto whitespace-pre-wrap">
            {individualResult.deepAnalysisMarkdown}
          </pre>
        </div>
      )}

      {/* Full Suite Results Dashboard */}
      {suiteResult && !individualResult && (
        <div className="space-y-6">
          {/* Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-1">
              <span className="text-xs text-gray-400 uppercase font-semibold">SEO & Technical Index</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black font-mono text-sky-400">{suiteResult.seoScore}/100</span>
                <span className="text-xs text-emerald-400 font-semibold">High Health</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-1">
              <span className="text-xs text-gray-400 uppercase font-semibold">Conversion Funnel CRO</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black font-mono text-amber-400">{suiteResult.croScore}/100</span>
                <span className="text-xs text-amber-400 font-semibold">Moderate Friction</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-1">
              <span className="text-xs text-gray-400 uppercase font-semibold">Growth & ARPU Potential</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black font-mono text-purple-400">{suiteResult.growthPotentialScore}/100</span>
                <span className="text-xs text-emerald-400 font-semibold">Strong Upside</span>
              </div>
            </div>
          </div>

          {/* Funnel Friction Points */}
          <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase">
              <AlertTriangle className="w-4 h-4" />
              Точки Потери Конверсии (Funnel Friction Audit)
            </div>

            <div className="space-y-3">
              {suiteResult.funnelFrictionPoints?.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-dark-900 border border-gray-800 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-bold text-xs text-white block">{item.step}</span>
                    <span className="text-xs text-gray-400 block">Трение: {item.frictionReason}</span>
                    <span className="text-xs text-emerald-400 block font-semibold">💡 Решение: {item.recommendation}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded font-mono text-xs font-bold bg-amber-500/20 text-amber-400 shrink-0">
                    -{item.dropoffRate} Dropoff
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Executive CMO Roadmap */}
          <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-3">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm uppercase">
              <Award className="w-4 h-4" />
              90-Дневный Стратегический План (Executive CMO Roadmap)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {suiteResult.executiveCmoRoadmap?.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-dark-900 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-400">{item.phase}</span>
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                      item.impact === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-purple-500/20 text-purple-300'
                    }`}>
                      {item.impact}
                    </span>
                  </div>
                  <span className="font-bold text-xs text-white block">{item.title}</span>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
