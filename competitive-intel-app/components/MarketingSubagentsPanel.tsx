'use client';

import React, { useState, useRef } from 'react';
import { Sparkles, Loader2, Search, AlertTriangle, CheckCircle2, TrendingUp, ShieldCheck, Zap, Award, Layers, Play, SlidersHorizontal, Users } from 'lucide-react';
import { MARKETING_SUBAGENTS, MarketingSubagentRunResult, IndividualSubagentResult, runIndividualMarketingSubagent, runMarketingSubagentsSuite } from '@/lib/agents/marketingSubagents';

export default function MarketingSubagentsPanel() {
  const [targetDomain, setTargetDomain] = useState('collaborator.pro');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'seo' | 'cro' | 'growth'>('all');
  const [persona, setPersona] = useState<'SMB Agency' | 'B2B Enterprise' | 'Direct-to-Consumer (D2C)'>('SMB Agency');
  const [executionMode, setExecutionMode] = useState<'parallel' | 'sequential'>('parallel');

  const [suiteResult, setSuiteResult] = useState<MarketingSubagentRunResult | null>(null);
  const [individualResult, setIndividualResult] = useState<IndividualSubagentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [runningAgentId, setRunningAgentId] = useState<string | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);

  const handleRunSuite = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!targetDomain.trim()) return;
    setIsLoading(true);
    setIndividualResult(null);

    try {
      const res = await fetch('/api/marketing/subagents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetDomain, category: selectedCategory, options: { persona, executionMode } }),
      });
      const json = await res.json();
      if (json.success && !json.isIndividual) {
        setSuiteResult(json.data);
      } else {
        const fallback = runMarketingSubagentsSuite(targetDomain, selectedCategory, { persona, executionMode });
        setSuiteResult(fallback);
      }
    } catch (err) {
      console.warn('Suite fallback execution:', err);
      const fallback = runMarketingSubagentsSuite(targetDomain, selectedCategory, { persona, executionMode });
      setSuiteResult(fallback);
    } finally {
      setIsLoading(false);
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const handleRunSingleAgent = async (agentId: string) => {
    const domain = targetDomain.trim() || 'collaborator.pro';
    setRunningAgentId(agentId);

    try {
      const res = await fetch('/api/marketing/subagents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetDomain: domain, agentId }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setIndividualResult(json.data);
      } else {
        const fallback = runIndividualMarketingSubagent(domain, agentId);
        setIndividualResult(fallback);
      }
    } catch (err) {
      console.warn('Single agent fallback:', err);
      const fallback = runIndividualMarketingSubagent(domain, agentId);
      setIndividualResult(fallback);
    } finally {
      setRunningAgentId(null);
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
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

          {/* Config Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-dark-900/90 border border-gray-800">
            <div>
              <label className="block text-xs font-semibold text-indigo-400 mb-1.5 uppercase flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Целевая Персона / Сегмент Аудитории (Persona)
              </label>
              <select
                value={persona}
                onChange={(e) => setPersona(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-gray-700 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="SMB Agency">SMB Agency (Агентства малого бизнеса)</option>
                <option value="B2B Enterprise">B2B Enterprise (Крупные корпораты)</option>
                <option value="Direct-to-Consumer (D2C)">Direct-to-Consumer (D2C Бренд)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-indigo-400 mb-1.5 uppercase flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Режим Выполнения Субагентов
              </label>
              <select
                value={executionMode}
                onChange={(e) => setExecutionMode(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-gray-700 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="parallel">Parallel Fast Batch (Параллельный быстрый)</option>
                <option value="sequential">Sequential Deep (Последовательный глубокий)</option>
              </select>
            </div>
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
                Запуск {filteredAgents.length} маркетинговых субагентов ({executionMode})...
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
      <div className="p-5 rounded-2xl bg-dark-800/80 border border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
            <Layers className="w-4 h-4 text-indigo-400" />
            Каталог 18 Субагентов (Кликните для индивидуального запуска)
          </div>
          <span className="text-[11px] font-mono text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
            Нажмите ▶ на любом агенте для старта
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {filteredAgents.map((agent) => {
            const isAgentRunning = runningAgentId === agent.id;
            return (
              <div
                key={agent.id}
                className={`p-4 rounded-xl bg-dark-900 border space-y-3 transition-all flex flex-col justify-between ${
                  isAgentRunning
                    ? 'border-indigo-500 ring-2 ring-indigo-500/30'
                    : 'border-gray-800 hover:border-indigo-500/50'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{agent.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase font-bold ${
                      agent.category === 'seo' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' :
                      agent.category === 'cro' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}>
                      {agent.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-snug">{agent.description}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRunSingleAgent(agent.id)}
                  disabled={isAgentRunning}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow ${
                    isAgentRunning
                      ? 'bg-indigo-600 text-white'
                      : 'bg-dark-800 hover:bg-indigo-600 text-gray-200 hover:text-white border border-gray-700 hover:border-indigo-500'
                  }`}
                >
                  {isAgentRunning ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Выполнение анализа...
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                      Запустить Агента
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target Anchor for Report Smooth Scrolling */}
      <div ref={reportRef} />

      {/* Individual Agent Single Result */}
      {individualResult && (
        <div className="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-500/50 space-y-4 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-indigo-500/30">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="font-bold text-sm text-white">Индивидуальный Отчёт Субагента</span>
                <span className="block text-xs font-mono text-indigo-300">
                  Агент: <strong>{individualResult.agentName}</strong> | Домен: <strong>{individualResult.targetDomain}</strong>
                </span>
              </div>
            </div>

            <span className="text-2xl font-black font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl">
              Score: {individualResult.score}/100
            </span>
          </div>

          <div className="space-y-2">
            {individualResult.findings?.map((f, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-dark-900 border border-gray-800 text-xs flex items-center justify-between">
                <span className="font-bold text-white">{f.title}</span>
                <span className="text-gray-300">{f.detail}</span>
              </div>
            ))}
          </div>

          <pre className="text-xs font-mono bg-dark-950 p-5 rounded-xl border border-gray-800 text-gray-200 max-h-80 overflow-y-auto whitespace-pre-wrap leading-relaxed">
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
