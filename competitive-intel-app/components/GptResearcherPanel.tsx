'use client';

import React, { useState } from 'react';
import { Globe, Search, Loader2, BookOpen, Layers, Sparkles } from 'lucide-react';
import { GptResearchResult, runGptResearcher } from '@/lib/agents/gptResearcher';

export default function GptResearcherPanel() {
  const [topic, setTopic] = useState('Анализ рынка линкбилдинг-платформ в США 2026: игроки, ценники, доли');
  const [depth, setDepth] = useState<'fast' | 'deep'>('deep');
  const [result, setResult] = useState<GptResearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const executeResearch = async (searchTopic: string, searchDepth: 'fast' | 'deep') => {
    if (!searchTopic.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/research/gpt-researcher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: searchTopic, depth: searchDepth }),
      });
      const json = await res.json();
      if (json.success) {
        setResult(json.data);
      } else {
        // Fallback execution if server error
        const fallback = await runGptResearcher(searchTopic, searchDepth);
        setResult(fallback);
      }
    } catch (err) {
      console.warn('GPT-Researcher API fallback:', err);
      const fallback = await runGptResearcher(searchTopic, searchDepth);
      setResult(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeResearch(topic, depth);
  };

  const handleDepthSelect = (selectedDepth: 'fast' | 'deep') => {
    setDepth(selectedDepth);
    executeResearch(topic, selectedDepth);
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

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase">
              Глубина Веб-Сканирования Источников (Кликните для мгновенного запуска)
            </label>
            <div className="flex rounded-xl bg-dark-900 p-1 border border-gray-800">
              <button
                type="button"
                onClick={() => handleDepthSelect('fast')}
                disabled={isLoading}
                className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  depth === 'fast' ? 'bg-sky-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
              >
                {isLoading && depth === 'fast' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                Fast Scan (5 Источников)
              </button>
              <button
                type="button"
                onClick={() => handleDepthSelect('deep')}
                disabled={isLoading}
                className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  depth === 'deep' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
              >
                {isLoading && depth === 'deep' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-yellow-300" />}
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
                Запустить Сканирование GPT-Researcher ({depth === 'deep' ? '20 Sources & Mermaid' : '5 Sources'})
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
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">
              {result.reportMarkdown.includes('quadrantChart') ? 'DEEP SCAN (20 SOURCES & MERMAID)' : 'FAST SCAN (5 SOURCES)'}
            </span>
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
