'use client';

import React, { useState } from 'react';
import { Search, Loader2, FileText, Globe, ExternalLink } from 'lucide-react';
import { GptResearchResult } from '@/lib/agents/gptResearcher';

export default function GptResearcherPanel() {
  const [topic, setTopic] = useState('Анализ рынка линкбилдинг-платформ в США 2026: игроки, ценники, доли');
  const [result, setResult] = useState<GptResearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/research/gpt-researcher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      const json = await res.json();
      if (json.success) {
        setResult(json.data);
      }
    } catch (err) {
      console.error('GPT-Researcher error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-dark-800/80 border border-gray-800 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-5 h-5 text-sky-400" />
          <h2 className="text-lg font-bold text-white">GPT-Researcher Engine (assafelovic/gpt-researcher ★ 17k+)</h2>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Автономный AI-агент сканирует 20+ веб-источников, собирает данные рынка и генерирует структурированный R&D отчет с цитатами.
        </p>

        <form onSubmit={handleResearch} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase">
              R&D Исследовательский Запрос / Рыночная Гипотеза
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Анализ цен и функционала MarTech линкбилдинг сервисов..."
              className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Сканирование 20+ источников и генерация отчета...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Сгенерировать R&D Отчет GPT-Researcher
              </>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="p-6 rounded-2xl bg-dark-800/80 border border-gray-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
              <FileText className="w-4 h-4" />
              Отчет GPT-Researcher: {result.topic}
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              {result.sourcesCount} Источников Просканировано
            </span>
          </div>

          <pre className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap font-sans bg-dark-900/80 p-5 rounded-xl border border-gray-800 overflow-x-auto">
            {result.reportMarkdown}
          </pre>

          {/* Citations List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Проверенные Источники & Цитаты</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.citationSources?.map((src, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-dark-900 border border-gray-800 text-xs space-y-1">
                  <div className="font-semibold text-white flex items-center justify-between">
                    <span>{src.title}</span>
                    <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <p className="text-[11px] text-gray-400 italic">"{src.snippet}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
