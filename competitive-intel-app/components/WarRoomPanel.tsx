'use client';

import React, { useState } from 'react';
import { Swords, Loader2, Sparkles, ShieldAlert, Award, MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import { WarRoomSimulationResult } from '@/lib/agents/warRoomSimulator';

export default function WarRoomPanel() {
  const [targetCompany, setTargetCompany] = useState('Adsy');
  const [competitorA, setCompetitorA] = useState('Collaborator.pro');
  const [competitorB, setCompetitorB] = useState('Accessily');
  const [result, setResult] = useState<WarRoomSimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCompany.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/research/warroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetCompany, competitorA, competitorB }),
      });
      const json = await res.json();
      if (json.success) {
        setResult(json.data);
      }
    } catch (err) {
      console.error('War Room error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Form */}
      <div className="p-6 rounded-2xl bg-dark-800/80 border border-gray-800 backdrop-blur-md space-y-4 shadow-2xl">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-red-400" />
          <h2 className="text-lg font-bold text-white">Interactive AI War Room Simulator & Competitive Debate</h2>
        </div>
        <p className="text-xs text-gray-400">
          Симуляция стратегических дебатов между AI-агентами (CMO вашего бренда против CMO конкурентов). Прогнозирует ценовые войны, контрудары и варианты доминирования в нише.
        </p>

        <form onSubmit={handleSimulate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase">
                Ваш Бренд (Target Brand)
              </label>
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="e.g. Adsy"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase">
                Главный Конкурент A
              </label>
              <input
                type="text"
                value={competitorA}
                onChange={(e) => setCompetitorA(e.target.value)}
                placeholder="e.g. Collaborator.pro"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase">
                Конкурент B / Альтернатива
              </label>
              <input
                type="text"
                value={competitorB}
                onChange={(e) => setCompetitorB(e.target.value)}
                placeholder="e.g. Accessily"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Симуляция стратегических дебатов 3 AI CMO агентов...
              </>
            ) : (
              <>
                <Swords className="w-4 h-4 text-yellow-300" />
                Запустить AI War Room & Контрманевры
              </>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-6">
          {/* Winning Index Banner */}
          <div className="p-5 rounded-xl bg-red-950/30 border border-red-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-red-400 shrink-0" />
              <div>
                <span className="font-bold text-sm text-white">Winning Tactical Strategy Index</span>
                <span className="block text-xs text-red-300">
                  Бренд: <code className="font-mono text-white">{result.targetCompany}</code> | Оппоненты: <code className="font-mono text-white">{result.competitorA} & {result.competitorB}</code>
                </span>
              </div>
            </div>

            <span className="text-3xl font-black font-mono text-red-400">
              {result.winningStrategyScore}%
            </span>
          </div>

          {/* Debate Highlights */}
          <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-3">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase">
              <MessageSquare className="w-4 h-4" />
              Ход Дебатов AI-Агентов (Simulated Multi-Agent Debate)
            </div>

            <div className="space-y-3">
              {result.debateRounds?.map((round) => (
                <div key={round.roundNumber} className="p-4 rounded-xl bg-dark-900 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-sky-400">Раунд #{round.roundNumber}: {round.speakerAgent}</span>
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-dark-950 text-gray-400 uppercase">
                      {round.agentRole}
                    </span>
                  </div>
                  <p className="text-xs text-gray-200 italic">"{round.statement}"</p>
                  <span className="block text-xs text-emerald-400 font-semibold">
                    🎯 Тактический шаг: {round.tacticalMove}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Counter Strategy Matrix */}
          <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm uppercase">
              <Zap className="w-4 h-4" />
              Матрица Контрманевров & Реакций (Counter-Strategy Tactical Matrix)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.counterStrategyMatrix?.map((m, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-dark-900 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{m.scenario}</span>
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                      m.maneuverType === 'OFFENSIVE' ? 'bg-red-500/20 text-red-400' :
                      m.maneuverType === 'DISRUPTIVE' ? 'bg-purple-500/20 text-purple-300' : 'bg-sky-500/20 text-sky-300'
                    }`}>
                      {m.maneuverType}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{m.recommendedAction}</p>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold block pt-1">
                    Ожидаемый эффект: {m.expectedRevenueImpact}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
