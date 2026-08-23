import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface ThreatScoreGaugeProps {
  score: number;
}

export default function ThreatScoreGauge({ score }: ThreatScoreGaugeProps) {
  let colorClass = "from-emerald-500 to-teal-600";
  let borderClass = "border-emerald-500/30 text-emerald-400";
  let label = "Low Threat Level";
  let Icon = ShieldCheck;

  if (score >= 40 && score < 70) {
    colorClass = "from-amber-500 to-orange-600";
    borderClass = "border-amber-500/30 text-amber-400";
    label = "Moderate Threat Level";
    Icon = AlertTriangle;
  } else if (score >= 70) {
    colorClass = "from-rose-500 to-red-600";
    borderClass = "border-rose-500/30 text-rose-400";
    label = "Critical Threat Level";
    Icon = ShieldAlert;
  }

  return (
    <div className="p-6 rounded-2xl bg-dark-800/80 border border-gray-800 backdrop-blur-sm flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-5 h-5 ${borderClass.split(' ')[1]}`} />
        <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Competitive Risk Gauge</span>
      </div>

      <div className="relative flex items-center justify-center my-2">
        <div className={`w-28 h-28 rounded-full bg-gradient-to-tr ${colorClass} p-1 shadow-xl flex items-center justify-center`}>
          <div className="w-full h-full rounded-full bg-dark-900 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-white">{score}</span>
            <span className="text-[10px] text-gray-400 font-mono">/ 100</span>
          </div>
        </div>
      </div>

      <span className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold border ${borderClass} bg-dark-900/60`}>
        {label}
      </span>
    </div>
  );
}
