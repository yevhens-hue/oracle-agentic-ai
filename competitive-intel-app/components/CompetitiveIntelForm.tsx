'use client';

import React, { useState } from 'react';
import { Search, Loader2, Sparkles } from 'lucide-react';

interface CompetitiveIntelFormProps {
  onAnalyze: (targetCompany: string, competitors: string[]) => void;
  isLoading: boolean;
}

export default function CompetitiveIntelForm({ onAnalyze, isLoading }: CompetitiveIntelFormProps) {
  const [targetCompany, setTargetCompany] = useState('Adsy');
  const [competitorsText, setCompetitorsText] = useState('Collaborator.pro, Accessily, Postaga, Semrush');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCompany.trim()) return;

    const competitorList = competitorsText
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    onAnalyze(targetCompany, competitorList);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-2xl bg-dark-800/80 border border-gray-800 backdrop-blur-md shadow-2xl space-y-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-sky-400" />
        <h2 className="text-lg font-bold text-white">Competitive Intelligence & GEO Audit Launcher</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
            Target Domain / Company
          </label>
          <input
            type="text"
            value={targetCompany}
            onChange={(e) => setTargetCompany(e.target.value)}
            placeholder="e.g. Adsy or MarketZen"
            className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 text-sm transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
            Primary Competitors (Comma-separated)
          </label>
          <input
            type="text"
            value={competitorsText}
            onChange={(e) => setCompetitorsText(e.target.value)}
            placeholder="e.g. Collaborator.pro, Accessily, Postaga"
            className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 text-sm transition-colors"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Running Multi-Agent Pipeline...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Run Competitive & GEO Audit
            </>
          )}
        </button>
      </div>
    </form>
  );
}
