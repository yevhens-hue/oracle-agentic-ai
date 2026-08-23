'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2, Search, AlertTriangle, CheckCircle2, TrendingUp, ShieldCheck, Zap, Award, Layers } from 'lucide-react';
import { MARKETING_SUBAGENTS, MarketingSubagentRunResult } from '@/lib/agents/marketingSubagents';

export default function MarketingSubagentsPanel() {
  const [targetDomain, setTargetDomain] = useState('collaborator.pro');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'seo' | 'cro' | 'growth'>('all');
  const [result, setResult] = useState<MarketingSubagentRunResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunSuite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetDomain.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/marketing/subagents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetDomain, category: selectedCategory }),
      });
      const json = await res.json();
      if (json.success) {
        setResult(json.data);
      }
    } catch (err) {
      console.error('Marketing subagents error:', err);
    } finally {
      setIsLoading(false);
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

      {/* Agents Catalog Grid */}
      <div className="p-5 rounded-2xl bg-dark-800/80 border border-gray-800 space-y-3">
        <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4 text-indigo-400" />
          Каталог Субагентов в Наборе ({filteredAgents.length} активных)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {filteredAgents.map((agent) => (
            <div key={agent.id} className="p-3.5 rounded-xl bg-dark-900 border border-gray-800/80 space-y-1 hover:border-gray-700 transition-colors">
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
          ))}
        </div>
      </div>

      {/* Results Dashboard */}
      {result && (
        <div className="space-y-6">
          {/* Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-1">
              <span className="text-xs text-gray-400 uppercase font-semibold">SEO & Technical Index</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black font-mono text-sky-400">{result.seoScore}/100</span>
                <span className="text-xs text-emerald-400 font-semibold">High Health</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-1">
              <span className="text-xs text-gray-400 uppercase font-semibold">Conversion Funnel CRO</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black font-mono text-amber-400">{result.croScore}/100</span>
                <span className="text-xs text-amber-400 font-semibold">Moderate Friction</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-1">
              <span className="text-xs text-gray-400 uppercase font-semibold">Growth & ARPU Potential</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black font-mono text-purple-400">{result.growthPotentialScore}/100</span>
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
              {result.funnelFrictionPoints?.map((item, idx) => (
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
              {result.executiveCmoRoadmap?.map((item, idx) => (
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
