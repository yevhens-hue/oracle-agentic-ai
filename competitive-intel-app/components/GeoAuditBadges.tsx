'use client';

import React, { useState } from 'react';
import { AdvertoolsAuditResult, generateRobotsTxtSnippet } from '@/lib/agents/advertoolsAudit';
import { Bot, CheckCircle2, XCircle, FileCode, Copy, Check } from 'lucide-react';

interface GeoAuditBadgesProps {
  audit: AdvertoolsAuditResult;
}

export default function GeoAuditBadges({ audit }: GeoAuditBadgesProps) {
  const [copiedRobots, setCopiedRobots] = useState(false);

  if (!audit) return null;

  const robotsTxt = generateRobotsTxtSnippet(audit.domain);

  const handleCopyRobots = () => {
    navigator.clipboard.writeText(robotsTxt);
    setCopiedRobots(true);
    setTimeout(() => setCopiedRobots(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 8-Bot Crawler Status Grid */}
      <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold">
            <Bot className="w-5 h-5 text-sky-400" />
            <h3>8-AI Search Bot Crawler Permissions (robots.txt Audit)</h3>
          </div>
          <span className="text-xs font-mono text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full">
            SEO Health: {audit.seo_health_score}%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {audit.ai_bots_status.map((bot) => (
            <div
              key={bot.bot_name}
              className={`p-3 rounded-lg border flex flex-col justify-between ${
                bot.allowed
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                  : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs">{bot.bot_name}</span>
                {bot.allowed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400" />
                )}
              </div>
              <p className="text-[10px] text-gray-400 leading-tight mt-1">
                {bot.impact_description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Schema.org Microdata Detection */}
      <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-4">
        <div className="flex items-center gap-2 text-white font-bold">
          <FileCode className="w-5 h-5 text-indigo-400" />
          <h3>Schema.org Microdata & GEO Citation Readiness</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {audit.schema_types.map((schema) => (
            <div
              key={schema.schema_type}
              className="p-3 rounded-lg bg-dark-900 border border-gray-800 flex items-center justify-between"
            >
              <div>
                <span className="font-semibold text-xs text-white">{schema.schema_type}</span>
                <span className="block text-[10px] text-gray-400 mt-0.5">{schema.geo_impact}</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                  schema.detected
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-gray-800 text-gray-400'
                }`}
              >
                {schema.detected ? 'DETECTED' : 'MISSING'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 1-Click Ideal robots.txt Generator */}
      <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm uppercase">
            <Bot className="w-4 h-4" />
            Генератор Идеального robots.txt для 8 AI-Ботов
          </div>
          <button
            onClick={handleCopyRobots}
            className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            {copiedRobots ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                Скопировано!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Скопировать robots.txt
              </>
            )}
          </button>
        </div>
        <pre className="text-xs font-mono bg-dark-950 p-4 rounded-xl border border-gray-800 text-gray-300 overflow-x-auto whitespace-pre-wrap">
          {robotsTxt}
        </pre>
      </div>
    </div>
  );
}
