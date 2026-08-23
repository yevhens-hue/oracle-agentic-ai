'use client';

import React, { useState } from 'react';
import { Globe, Search, Loader2, BookOpen, Layers } from 'lucide-react';
import { GptResearchResult } from '@/lib/agents/gptResearcher';

export default function GptResearcherPanel() {
  const [topic, setTopic] = useState('Анализ рынка линкбилдинг-платформ в США 2026: игроки, ценники, доли');
  const [depth, setDepth] = useState<'fast' | 'deep'>('deep');
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
        body: JSON.stringify({ topic, depth }),
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
      <div className="p-6 rounded-2xl bg-dark-800/80 border border-gray-800 backdrop-blur-md space-y-4 shadow-2xl">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-sky-400" />
          <h2 className="text-lg font-bold text-white">GPT-Researcher Engine (assafelovic/gpt-researcher ★ 17k+)</h2>
        </div>
        <p className="text-xs text-gray-400">
          Автономный AI-агент сканирует веб-источники, собирает данные рынка, позиционирование конкурентов и генерирует структурированный R&D отчет с цитатами.
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

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase">Глубина Веб-Сканирования Источников</label>
            <div className="flex rounded-xl bg-dark-900 p-1 border border-gray-800">
              <button
                type="button"
                onClick={() => setDepth('fast')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                  depth === 'fast' ? 'bg-sky-600 text-white shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                Fast Scan (5 Источников)
              </button>
              <button
                type="button"
                onClick={() => setDepth('deep')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                  depth === 'deep' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                Deep R&D Scan (20+ Источников & Mermaid Диаграмма)
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Сканирование источников и генерация R&D отчета...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Сгенерировать R&D Отчет GPT-Researcher ({depth === 'deep' ? '20 Sources' : '5 Sources'})
              </>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-500/30 flex items-center justify-between">
            <span className="text-xs text-sky-300 font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              Отсканировано web-источников: <strong className="text-white font-mono">{result.sourcesCount}</strong>
            </span>
            <span className="text-xs text-gray-400 font-mono">Глубина: {result.reportMarkdown.includes('quadrantChart') ? 'DEEP SCAN' : 'FAST SCAN'}</span>
          </div>

          <div className="p-6 rounded-2xl bg-dark-800/90 border border-gray-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              Структурированный R&D Отчет
            </h3>
            <pre className="text-xs font-mono bg-dark-950 p-5 rounded-xl border border-gray-800 text-gray-200 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">
              {result.reportMarkdown}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
