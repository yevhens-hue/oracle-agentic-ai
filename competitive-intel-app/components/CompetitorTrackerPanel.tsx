'use client';

import React, { useEffect, useState } from 'react';
import { Activity, ShieldAlert, DollarSign, Zap, Plus, Clock } from 'lucide-react';

export default function CompetitorTrackerPanel() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      const res = await fetch('/api/competitors/tracker');
      const json = await res.json();
      if (json.success && json.data) {
        setTracks(json.data);
      }
    } catch (err) {
      console.error('Failed to load competitor tracks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-dark-800/80 border border-gray-800 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Competitor Change Tracker (0xmetaschool/competitor-analyst)</h2>
            </div>
            <p className="text-xs text-gray-400">
              Регулярный трекинг действий конкурентов, изменений их позиционирования, фичей и ценовых тиров.
            </p>
          </div>

          <span className="text-xs font-mono bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-full font-bold">
            {tracks.length} Signal Events
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-gray-400 text-sm">Загрузка сигналов конкурентов...</div>
      ) : (
        <div className="space-y-4">
          {tracks.map((item) => {
            let riskBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            if (item.riskLevel === 'High' || item.riskLevel === 'Critical') {
              riskBadge = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            } else if (item.riskLevel === 'Medium') {
              riskBadge = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            }

            return (
              <div
                key={item.id}
                className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-3 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-sm text-white">{item.competitor}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-gray-800 text-gray-300">
                      {item.changeType}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold ${riskBadge}`}>
                      Risk: {item.riskLevel}
                    </span>
                    <span className="text-[11px] text-gray-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-gray-200">{item.title}</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{item.description}</p>
                </div>

                {item.pricingData && (
                  <pre className="text-[11px] text-sky-300 font-mono bg-dark-900/80 p-3 rounded-lg border border-gray-800 overflow-x-auto">
                    {item.pricingData}
                  </pre>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
