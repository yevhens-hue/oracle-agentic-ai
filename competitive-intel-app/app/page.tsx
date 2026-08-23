'use client';

import React, { useState } from 'react';
import CompetitiveIntelForm from '@/components/CompetitiveIntelForm';
import ThreatScoreGauge from '@/components/ThreatScoreGauge';
import SwotMatrix from '@/components/SwotMatrix';
import FeatureComparisonTable from '@/components/FeatureComparisonTable';
import GeoAuditBadges from '@/components/GeoAuditBadges';
import { CompIntelReport } from '@/lib/agents/competitiveIntel';
import { FileText, Cpu, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  const [report, setReport] = useState<CompIntelReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dbSaved, setDbSaved] = useState<string | null>(null);

  const handleAnalyze = async (targetCompany: string, competitors: string[]) => {
    setIsLoading(true);
    setDbSaved(null);
    try {
      const res = await fetch('/api/research/competitive-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetCompany, competitors }),
      });
      const json = await res.json();
      if (json.success) {
        setReport(json.data);
        if (json.dbId) {
          setDbSaved(json.dbId);
        }
      }
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white tracking-tight">
          Competitive Intelligence & GEO Platform
        </h1>
        <p className="text-sm text-gray-400 max-w-3xl">
          Multi-agent competitive benchmarking, 8-AI bot crawler permission auditing, and Generative Engine Optimization (GEO) readiness suite.
        </p>
      </div>

      {/* Form Launcher */}
      <CompetitiveIntelForm onAnalyze={handleAnalyze} isLoading={isLoading} />

      {/* DB Saved Alert */}
      {dbSaved && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Analysis report successfully persisted to Prisma database (Record ID: <code className="font-mono">{dbSaved}</code>)</span>
          </div>
        </div>
      )}

      {/* Analysis Results Display */}
      {report && (
        <div className="space-y-8 pt-4">
          {/* Top Summary Bar & Threat Gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-2xl bg-dark-800/80 border border-gray-800 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-sm uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                Executive Briefing — {report.targetCompany}
              </div>
              <pre className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap font-sans bg-dark-900/60 p-4 rounded-xl border border-gray-800/80">
                {report.executiveSummary}
              </pre>
            </div>

            <ThreatScoreGauge score={report.threatScore} />
          </div>

          {/* 8-Bot & Schema.org Audit */}
          <GeoAuditBadges audit={report.geoAudit} />

          {/* SWOT Matrix */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              Strategic SWOT Analysis
            </h2>
            <SwotMatrix swot={report.swotAnalysis} />
          </div>

          {/* Feature Matrix */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Competitor Feature Benchmark Matrix</h2>
            <FeatureComparisonTable matrix={report.featureMatrix} targetCompany={report.targetCompany} />
          </div>
        </div>
      )}
    </div>
  );
}
