'use client';

import React, { useState } from 'react';
import { Target, Loader2, Sparkles, AlertTriangle, TrendingUp, Compass, DollarSign, Award, Layers } from 'lucide-react';
import { NexscopeValidationResult } from '@/lib/agents/nexscopeSkills';

export default function NexscopePanel() {
  const [nicheOrDomain, setNicheOrDomain] = useState('Link Building & Guest Post Marketplaces');
  const [result, setResult] = useState<NexscopeValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nicheOrDomain.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/research/nexscope-validation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nicheOrDomain }),
      });
      const json = await res.json();
      if (json.success) {
        setResult(json.data);
      }
    } catch (err) {
      console.error('Nexscope validation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Launcher Form */}
      <div className="p-6 rounded-2xl bg-dark-800/80 border border-gray-800 backdrop-blur-md space-y-4 shadow-2xl">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Nexscope E-Commerce & Market Window Validator (nexscope-ai ★)</h2>
        </div>
        <p className="text-xs text-gray-400">
          Набор AI-скиллов для исследования ниш, оценки коммерческого потенциала, анализа болей потребителей и поиска необслуженных рыночных окон (White-Space Opportunities).
        </p>

        <form onSubmit={handleValidate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase">
              Исследуемая Ниша или Продуктовая Категория
            </label>
            <input
              type="text"
              value={nicheOrDomain}
              onChange={(e) => setNicheOrDomain(e.target.value)}
              placeholder="e.g. Link Building & Guest Post Marketplaces or SEO SaaS Tools..."
              className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Анализ коммерческого потенциала и болей...
              </>
            ) : (
              <>
                <Compass className="w-4 h-4 text-emerald-300" />
                Запустить Валидацию Ниши & Поиск Рыночных Окон
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results Dashboard */}
      {result && (
        <div className="space-y-6">
          {/* Key Metrics Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-1">
              <span className="text-xs text-gray-400 uppercase font-semibold">Commercial Score</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black font-mono text-emerald-400">{result.commercialPotentialScore}/100</span>
                <span className="text-xs text-emerald-400 font-semibold">High Potential</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-1">
              <span className="text-xs text-gray-400 uppercase font-semibold">Market TAM Sizing</span>
              <span className="text-2xl font-bold font-mono text-white block">{result.marketSizingUsd}</span>
              <span className="text-[11px] text-emerald-400 font-semibold">{result.marketGrowthCagr} Growth</span>
            </div>

            <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-1">
              <span className="text-xs text-gray-400 uppercase font-semibold">Forecast LTV / CAC</span>
              <span className="text-2xl font-bold font-mono text-sky-400 block">${result.unitEconomics.estimatedLtvUsd} LTV</span>
              <span className="text-[11px] text-gray-400">CAC: ${result.unitEconomics.estimatedCacUsd} ({(result.unitEconomics.estimatedLtvUsd / result.unitEconomics.estimatedCacUsd).toFixed(1)}x)</span>
            </div>

            <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-1">
              <span className="text-xs text-gray-400 uppercase font-semibold">Gross Margin & Payback</span>
              <span className="text-2xl font-bold font-mono text-purple-400 block">{result.unitEconomics.grossMarginPercent}% Margin</span>
              <span className="text-[11px] text-gray-400">{result.unitEconomics.paybackPeriodMonths} Months Payback</span>
            </div>
          </div>

          {/* Customer Pain Points */}
          <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase">
              <AlertTriangle className="w-4 h-4" />
              Анализ Болей Пользователей & Фрустрации (Customer Pain Points)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.customerPains?.map((pain, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-dark-900 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{pain.painCategory}</span>
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-500/20 text-amber-400">
                      Severity {pain.severityScore}/10
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{pain.description}</p>
                  <p className="text-[11px] text-gray-400 italic bg-dark-950 p-2 rounded border border-gray-800">
                    "{pain.userFrustrationQuote}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* White-Space Opportunities */}
          <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase">
              <Sparkles className="w-4 h-4" />
              Рыночные Окна & Необслуженные Ниши (White-Space Opportunities)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.whiteSpaceOpportunities?.map((opp, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-dark-900 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-400">{opp.opportunityTitle}</span>
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                      {opp.potentialRevenueGrowth}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">Целевой Сегмент: {opp.targetSegment}</span>
                  <p className="text-xs text-gray-300 leading-relaxed">{opp.strategicAction}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
