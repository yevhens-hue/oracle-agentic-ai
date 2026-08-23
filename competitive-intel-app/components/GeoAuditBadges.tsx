import React from 'react';
import { AdvertoolsAuditResult } from '@/lib/agents/advertoolsAudit';
import { Bot, CheckCircle2, XCircle, FileCode } from 'lucide-react';

interface GeoAuditBadgesProps {
  audit: AdvertoolsAuditResult;
}

export default function GeoAuditBadges({ audit }: GeoAuditBadgesProps) {
  if (!audit) return null;

  return (
    <div className="space-y-6">
      {/* 8-Bot Crawler Status Grid */}
      <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
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
      <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800">
        <div className="flex items-center gap-2 mb-4 text-white font-bold">
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
    </div>
  );
}
