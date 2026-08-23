'use client';

import React, { useState } from 'react';
import { Users, Search, Loader2, ShieldAlert, Award, Grid, Target } from 'lucide-react';
import { runCompetitiveIntelligencePipeline, calculateFeatureCoverageGap, CompIntelReport, FeatureCoverageGap } from '@/lib/agents/competitiveIntel';

export default function CrewAiPanel() {
  const [targetCompany, setTargetCompany] = useState('Adsy');
  const [report, setReport] = useState<CompIntelReport | null>(() => null);
  const [gapAnalysis, setGapAnalysis] = useState<FeatureCoverageGap | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunIntel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCompany.trim()) return;

    setIsLoading(true);
    try {
      const res = await runCompetitiveIntelligencePipeline({ targetCompany });
      const gap = calculateFeatureCoverageGap(targetCompany);
      setReport(res);
      setGapAnalysis(gap);
    } catch (err) {
      console.error('CrewAI error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="p-6 rounded-2xl bg-dark-800/80 border border-gray-800 backdrop-blur-md space-y-4 shadow-2xl">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">CrewAI Intel Workflow (brightdata/competitive-intelligence)</h2>
        </div>
        <p className="text-xs text-gray-400">
          Команда из 4 AI-агентов (Scraper, SWOT Analyst, Feature Matcher, CMO Strategist) анализирует ваших конкурентов и рассчитывает угрозы.
        </p>

        <form onSubmit={handleRunIntel} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase">
              Анализируемый Бренд (Target Brand)
            </label>
            <input
              type="text"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              placeholder="e.g. Adsy or Collaborator.pro"
              className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Запуск CrewAI воркфлоу агентов...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Сгенерировать SWOT & Feature Matrix
              </>
            )}
          </button>
        </form>
      </div>

      {report && (
        <div className="space-y-6">
          {/* Threat & Gap Banners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-1">
              <span className="text-xs text-gray-400 uppercase font-semibold">Competitive Threat Index</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black font-mono text-amber-400">{report.threatScore}/100</span>
                <span className="text-xs text-amber-400 font-semibold">Moderate Risk</span>
              </div>
            </div>

            {gapAnalysis && (
              <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-1">
                <span className="text-xs text-gray-400 uppercase font-semibold">Feature Coverage Parity</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black font-mono text-emerald-400">{gapAnalysis.targetCoveragePercent}%</span>
                  <span className="text-xs text-emerald-400 font-semibold">High Feature Match</span>
                </div>
              </div>
            )}
          </div>

          {/* Missing Features Gap List */}
          {gapAnalysis && (
            <div className="p-5 rounded-2xl bg-dark-800/80 border border-gray-800 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm uppercase">
                <Target className="w-4 h-4" />
                Выявленные Пробелы в Функционале (Missing Features Gap)
              </div>
              <div className="space-y-2">
                {gapAnalysis.missingFeatures.map((feat, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-dark-900 border border-gray-800 text-xs text-gray-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SWOT Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase">Strengths (Сильные Стороны)</span>
              <ul className="space-y-1 text-xs text-gray-300 list-disc list-inside">
                {report.swotAnalysis.strengths.map((s, idx) => <li key={idx}>{s}</li>)}
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-2">
              <span className="text-xs font-bold text-red-400 uppercase">Weaknesses (Слабые Стороны)</span>
              <ul className="space-y-1 text-xs text-gray-300 list-disc list-inside">
                {report.swotAnalysis.weaknesses.map((w, idx) => <li key={idx}>{w}</li>)}
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-2">
              <span className="text-xs font-bold text-sky-400 uppercase">Opportunities (Возможности)</span>
              <ul className="space-y-1 text-xs text-gray-300 list-disc list-inside">
                {report.swotAnalysis.opportunities.map((o, idx) => <li key={idx}>{o}</li>)}
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase">Threats (Угрозы)</span>
              <ul className="space-y-1 text-xs text-gray-300 list-disc list-inside">
                {report.swotAnalysis.threats.map((t, idx) => <li key={idx}>{t}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
