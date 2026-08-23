'use client';

import React, { useState } from 'react';
import { Cpu, Loader2, Layers, CheckCircle2 } from 'lucide-react';
import { Crawl4AiResult } from '@/lib/scrapers/crawl4aiEngine';

export default function Crawl4AiPanel() {
  const [targetUrl, setTargetUrl] = useState('https://collaborator.pro');
  const [result, setResult] = useState<Crawl4AiResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/research/crawl4ai-scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl }),
      });
      const json = await res.json();
      if (json.success) {
        setResult(json.data);
      }
    } catch (err) {
      console.error('Crawl4AI scrape error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-dark-800/80 border border-gray-800 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Crawl4AI RAG Vector Scraper (unclecode/crawl4ai ★ 25k+)</h2>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Сверхбыстрый открытый краулер, оптимизированный под RAG и векторизацию семантических чанков с SEO-блогов и маркетплейсов.
        </p>

        <form onSubmit={handleScrape} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase">
              URL Маркетплейса / Блога для R&D Векторизации
            </label>
            <input
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://collaborator.pro or https://linkhouse.net"
              className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Векторизация и разбивка на семантические чанки...
              </>
            ) : (
              <>
                <Layers className="w-4 h-4" />
                Запустить RAG Векторизацию Crawl4AI
              </>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-6">
          {/* Readiness Score Banner */}
          <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-sm text-white">RAG Vector Readiness Score</span>
                <span className="block text-xs text-emerald-300">Стратегия: {result.extractionStrategy} (Cosine Similarity)</span>
              </div>
            </div>
            <span className="text-2xl font-black font-mono text-emerald-400">
              {result.ragVectorReadinessScore}%
            </span>
          </div>

          {/* Semantic Chunks */}
          <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
              Семантические Чанки для Векторной Базы (Embedding-Ready)
            </h3>

            <div className="space-y-3">
              {result.semanticChunks?.map((chunk) => (
                <div key={chunk.chunkIndex} className="p-4 rounded-xl bg-dark-900 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-sky-400">Чанк #{chunk.chunkIndex}</span>
                    <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Similarity: {(chunk.vectorSimilarityScore * 100).toFixed(1)}% | Tokens: {chunk.tokenCount}
                    </span>
                  </div>
                  <p className="text-xs text-gray-200 leading-relaxed font-sans">{chunk.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
