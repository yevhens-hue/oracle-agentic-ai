import React from 'react';
import { SwotAnalysis } from '@/lib/agents/competitiveIntel';
import { TrendingUp, AlertOctagon, Lightbulb, ShieldAlert } from 'lucide-react';

interface SwotMatrixProps {
  swot: SwotAnalysis;
}

export default function SwotMatrix({ swot }: SwotMatrixProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Strengths */}
      <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3 text-emerald-400 font-bold">
          <TrendingUp className="w-5 h-5" />
          <h3>Strengths</h3>
        </div>
        <ul className="space-y-2">
          {swot.strengths?.map((s, idx) => (
            <li key={idx} className="text-xs text-emerald-200/90 leading-relaxed flex items-start gap-2">
              <span className="text-emerald-500 font-bold mt-0.5">•</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-500/20 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3 text-amber-400 font-bold">
          <AlertOctagon className="w-5 h-5" />
          <h3>Weaknesses</h3>
        </div>
        <ul className="space-y-2">
          {swot.weaknesses?.map((w, idx) => (
            <li key={idx} className="text-xs text-amber-200/90 leading-relaxed flex items-start gap-2">
              <span className="text-amber-500 font-bold mt-0.5">•</span>
              <span>{w}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Opportunities */}
      <div className="p-5 rounded-xl bg-sky-950/20 border border-sky-500/20 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3 text-sky-400 font-bold">
          <Lightbulb className="w-5 h-5" />
          <h3>Opportunities (GEO & R&D)</h3>
        </div>
        <ul className="space-y-2">
          {swot.opportunities?.map((o, idx) => (
            <li key={idx} className="text-xs text-sky-200/90 leading-relaxed flex items-start gap-2">
              <span className="text-sky-500 font-bold mt-0.5">•</span>
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Threats */}
      <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-500/20 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3 text-rose-400 font-bold">
          <ShieldAlert className="w-5 h-5" />
          <h3>Threats</h3>
        </div>
        <ul className="space-y-2">
          {swot.threats?.map((t, idx) => (
            <li key={idx} className="text-xs text-rose-200/90 leading-relaxed flex items-start gap-2">
              <span className="text-rose-500 font-bold mt-0.5">•</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
