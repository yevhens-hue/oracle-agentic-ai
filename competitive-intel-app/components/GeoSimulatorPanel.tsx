'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2, Search, CheckCircle2, MessageSquare, Bot, AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { GeoSimulatorResult } from '@/lib/agents/geoSimulator';

export default function GeoSimulatorPanel() {
  const [userPrompt, setUserPrompt] = useState('Top link building marketplaces and SEO guest post platforms 2026');
  const [targetDomain, setTargetDomain] = useState('adsy.com');
  const [result, setResult] = useState<GeoSimulatorResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPrompt.trim() || !targetDomain.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/geo/simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt, targetDomain }),
      });
      const json = await res.json();
      if (json.success) {
        setResult(json.data);
      }
    } catch (err) {
      console.error('GEO simulator error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Launcher Form */}
      <div className="p-6 rounded-2xl bg-dark-800/80 border border-gray-800 backdrop-blur-md space-y-4 shadow-2xl">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-sky-400" />
          <h2 className="text-lg font-bold text-white">GEO Answer Engine Simulator (ChatGPT, Perplexity & Claude Citation Tester)</h2>
        </div>
        <p className="text-xs text-gray-400">
          Симулятор поисковых вычлений в нейросетях: протестируйте, попадёт ли ваш бренд в ответы <code className="font-mono text-sky-400">ChatGPT Web Search</code>, <code className="font-mono text-emerald-400">Perplexity.ai</code> и <code className="font-mono text-purple-400">Claude 3.5 Sonnet</code>.
        </p>

        <form onSubmit={handleSimulate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase">
                Поисковый Запрос Пользователя в Нейросети (Search Prompt)
              </label>
              <input
                type="text"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="e.g. Top guest posting platforms and marketplaces for SEO 2026..."
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase">
                Тестируемый Бренд / Домен
              </label>
              <input
                type="text"
                value={targetDomain}
                onChange={(e) => setTargetDomain(e.target.value)}
                placeholder="e.g. adsy.com"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Симуляция 4 AI поисковиков (ChatGPT, Perplexity, Claude, Gemini)...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-yellow-300" />
                Протестировать Вероятность Цитирования в AI Search Engine
              </>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-6">
          {/* Overall Citation Score Banner */}
          <div className="p-5 rounded-xl bg-sky-950/30 border border-sky-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-sky-400 shrink-0" />
              <div>
                <span className="font-bold text-sm text-white">AI Search Citation Probability Score</span>
                <span className="block text-xs text-sky-300">
                  Домен: <code className="font-mono text-white">{result.targetDomain}</code> | Запрос: <code className="font-mono text-white">"{result.userPrompt}"</code>
                </span>
              </div>
            </div>

            <span className="text-3xl font-black font-mono text-sky-400">
              {result.overallCitationScore}%
            </span>
          </div>

          {/* Simulated Answer Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.simulations?.map((sim, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-dark-800/80 border border-gray-800 space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-sky-400" />
                    <span className="font-bold text-xs text-white">{sim.engineName}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full font-mono text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {sim.citationProbabilityScore}% Citation Match
                  </span>
                </div>

                {/* Simulated AI Answer Box */}
                <div className="p-3.5 rounded-xl bg-dark-900 border border-gray-800 space-y-2">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">
                    Сгенерированный Ответ Нейросети
                  </span>
                  <p className="text-xs text-gray-200 leading-relaxed italic">{sim.simulatedAnswerText}</p>
                </div>

                {/* Citation Tag Snippet */}
                <div className="p-2.5 rounded-lg bg-sky-950/40 border border-sky-500/20 flex items-center justify-between text-xs">
                  <span className="font-mono text-sky-300 font-medium">{sim.citationSnippet}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                </div>

                {/* Recommendations */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                    GEO Рекомендации по оптимизации:
                  </span>
                  {sim.recommendations.map((rec, rIdx) => (
                    <span key={rIdx} className="block text-[11px] text-gray-300 leading-snug">
                      {rec}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
