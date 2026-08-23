'use client';

import React, { useState } from 'react';
import CompetitiveIntelForm from '@/components/CompetitiveIntelForm';
import ThreatScoreGauge from '@/components/ThreatScoreGauge';
import SwotMatrix from '@/components/SwotMatrix';
import FeatureComparisonTable from '@/components/FeatureComparisonTable';
import { CompIntelReport } from '@/lib/agents/competitiveIntel';
import { Users, FileText, Cpu } from 'lucide-react';

export default function CrewAiPanel() {
  const [report, setReport] = useState<CompIntelReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async (targetCompany: string, competitors: string[]) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/research/crewai-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetCompany, competitors }),
      });
      const json = await res.json();
      if (json.success) {
        setReport(json.data);
      }
    } catch (err) {
      console.error('CrewAI pipeline error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-3">
        <Users className="w-5 h-5 text-indigo-400 shrink-0" />
        <span>
          <b>CrewAI Multi-Agent Architecture (brightdata/competitive-intelligence):</b> 3 Воркфлоу-Агента (Researcher, Analyst, Writer) проводят SWOT-анализ, высчитывают Threat Score и формируют матрицу позиционирования.
        </span>
      </div>

      <CompetitiveIntelForm onAnalyze={handleAnalyze} isLoading={isLoading} />

      {report && (
        <div className="space-y-8 pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-2xl bg-dark-800/80 border border-gray-800 space-y-4">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm uppercase">
                <FileText className="w-4 h-4" />
                CrewAI Executive Summary — {report.targetCompany}
              </div>
              <pre className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap font-sans bg-dark-900/80 p-4 rounded-xl border border-gray-800">
                {report.executiveSummary}
              </pre>
            </div>
            <ThreatScoreGauge score={report.threatScore} />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              SWOT Analysis Matrix
            </h2>
            <SwotMatrix swot={report.swotAnalysis} />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Competitor Feature Parity Matrix</h2>
            <FeatureComparisonTable matrix={report.featureMatrix} targetCompany={report.targetCompany} />
          </div>
        </div>
      )}
    </div>
  );
}
