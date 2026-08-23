'use client';

import React, { useState } from 'react';
import { Bot, Search, Loader2, Sparkles, AlertCircle, CheckCircle2, Code2, Copy, Check } from 'lucide-react';
import { simulateGeoAnswerEngine, GeoSimulatorResult } from '@/lib/agents/geoSimulator';

export default function GeoSimulatorPanel() {
  const [userPrompt, setUserPrompt] = useState('Top link building marketplaces and SEO guest post platforms 2026');
  const [targetDomain, setTargetDomain] = useState('adsy.com');
  const [result, setResult] = useState<GeoSimulatorResult | null>(() => simulateGeoAnswerEngine(userPrompt, targetDomain));
  const [isLoading, setIsLoading] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetDomain.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setResult(simulateGeoAnswerEngine(userPrompt, targetDomain));
      setIsLoading(false);
    }, 600);
  };

  const handleCopySnippet = () => {
    if (!result?.jsonLdSnippet) return;
    navigator.clipboard.writeText(result.jsonLdSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="p-6 rounded-2xl bg-dark-800/80 border border-gray-800 backdrop-blur-md space-y-4 shadow-2xl">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">GEO Answer Engine Simulator (ChatGPT, Perplexity, Claude, Gemini)</h2>
        </div>
        <p className="text-xs text-gray-400">
          Симуляция вероятности цитирования и вычленения вашего бренда в поисковых AI-выдачах (Generative Engine Optimization).
        </p>

        <form onSubmit={handleSimulate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase">
                Поисковый Запрос Пользователя к AI (Prompt)
              </label>
              <input
                type="text"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="e.g. Top link building marketplaces 2026..."
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase">
                Ваш Проверяемый Домен (Target Domain)
              </label>
              <input
                type="text"
                value={targetDomain}
                onChange={(e) => setTargetDomain(e.target.value)}
                placeholder="e.g. adsy.com"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Симуляция вычлений в AI Answer Engines...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 text-yellow-300" />
                Симулировать Выдачу в 4 AI-Движках
              </>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-6">
          {/* Overall Citation Score Banner */}
          <div className="p-5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-indigo-400 shrink-0" />
              <div>
                <span className="font-bold text-sm text-white">Overall GEO Citation Probability</span>
                <span className="block text-xs text-gray-400">{result.cmoSummary}</span>
              </div>
            </div>

            <span className="text-3xl font-black font-mono text-emerald-400">
              {result.overallCitationScore}%
            </span>
          </div>

          {/* AI Engines Simulations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.simulations.map((sim, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-dark-800/80 border border-gray-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{sim.engineName}</span>
                  <span className="px-2.5 py-1 rounded font-mono text-xs font-bold bg-emerald-500/20 text-emerald-400">
                    {sim.citationProbabilityScore}% Citation
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-dark-900 border border-gray-800 text-xs font-mono text-gray-300 space-y-1">
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">Сгенерированный Ответ LLM:</span>
                  <p className="leading-relaxed">{sim.simulatedAnswerText}</p>
                </div>

                <div className="space-y-1 text-xs">
                  {sim.recommendations.map((rec, rIdx) => (
                    <span key={rIdx} className="block text-gray-400 leading-snug">{rec}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Schema.org Auto-Fixer Tool */}
          <div className="p-5 rounded-2xl bg-dark-800/80 border border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm uppercase">
                <Code2 className="w-4 h-4" />
                Автогенератор Schema.org JSON-LD Microdata (FAQPage)
              </div>
              <button
                onClick={handleCopySnippet}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                {copiedSnippet ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    Скопировано!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Скопировать Код Microdata
                  </>
                )}
              </button>
            </div>
            <pre className="text-xs font-mono bg-dark-950 p-4 rounded-xl border border-gray-800 text-gray-300 overflow-x-auto whitespace-pre-wrap">
              {result.jsonLdSnippet}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
