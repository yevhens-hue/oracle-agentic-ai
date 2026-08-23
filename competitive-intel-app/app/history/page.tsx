'use client';

import React, { useEffect, useState } from 'react';
import ThreatScoreGauge from '@/components/ThreatScoreGauge';
import SwotMatrix from '@/components/SwotMatrix';
import FeatureComparisonTable from '@/components/FeatureComparisonTable';
import GeoAuditBadges from '@/components/GeoAuditBadges';
import { Database, Clock, Calendar } from 'lucide-react';

export default function HistoryPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      const json = await res.json();
      if (json.success && json.data) {
        setReports(json.data);
        if (json.data.length > 0) {
          setSelectedReport(json.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load reports history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Database className="w-7 h-7 text-indigo-400" />
          Saved Competitive Intelligence Reports
        </h1>
        <p className="text-sm text-gray-400">
          Historical analysis records persisted in the Prisma database.
        </p>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-gray-400 text-sm">
          Loading audit database records...
        </div>
      ) : reports.length === 0 ? (
        <div className="p-12 text-center text-gray-400 text-sm bg-dark-800/40 rounded-2xl border border-gray-800">
          No saved reports found in database yet. Run an analysis on the Dashboard to save your first report!
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* History Sidebar */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Saved Audits ({reports.length})
            </h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {reports.map((rep) => {
                const isSelected = selectedReport?.id === rep.id;
                return (
                  <button
                    key={rep.id}
                    onClick={() => setSelectedReport(rep)}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-sky-500/10 border-sky-500/40 text-white shadow-lg'
                        : 'bg-dark-800/60 border-gray-800 text-gray-300 hover:bg-gray-800/40'
                    }`}
                  >
                    <div className="font-bold text-sm">{rep.targetCompany}</div>
                    <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-sky-400" />
                      Threat Score: <span className="font-mono font-bold text-white">{rep.threatScore}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {new Date(rep.createdAt).toLocaleDateString()}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Report Details */}
          <div className="lg:col-span-3 space-y-8">
            {selectedReport && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 p-6 rounded-2xl bg-dark-800/80 border border-gray-800">
                    <h3 className="text-sm font-bold text-sky-400 mb-2 uppercase tracking-wider">
                      Report Briefing — {selectedReport.targetCompany}
                    </h3>
                    <pre className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap font-sans bg-dark-900/60 p-4 rounded-xl border border-gray-800">
                      {selectedReport.executiveSummary}
                    </pre>
                  </div>
                  <ThreatScoreGauge score={selectedReport.threatScore} />
                </div>

                {selectedReport.geoAudit && <GeoAuditBadges audit={selectedReport.geoAudit} />}

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">SWOT Analysis</h3>
                  <SwotMatrix swot={selectedReport.swotAnalysis} />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">Feature Comparison</h3>
                  <FeatureComparisonTable
                    matrix={selectedReport.featureMatrix}
                    targetCompany={selectedReport.targetCompany}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
