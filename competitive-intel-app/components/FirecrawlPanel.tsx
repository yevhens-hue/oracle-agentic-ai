'use client';

import React, { useState } from 'react';
import { Flame, Loader2, DollarSign, Zap, FileCode } from 'lucide-react';
import { FirecrawlScrapeResult } from '@/lib/scrapers/firecrawlEngine';

export default function FirecrawlPanel() {
  const [targetUrl, setTargetUrl] = useState('https://collaborator.pro');
  const [result, setResult] = useState<FirecrawlScrapeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/research/firecrawl-scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl }),
      });
      const json = await res.json();
      if (json.success) {
        setResult(json.data);
      }
    } catch (err) {
      console.error('Firecrawl scrape error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-dark-800/80 border border-gray-800 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-2">
          <Flame className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-white">Firecrawl LLM Web Scraper (firecrawl/firecrawl ★ 20k+)</h2>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Конвертирует любой сайт конкурента (даже с тяжелым JavaScript или антиботом) в чистый Markdown/JSON с вытягиванием ценников и релизов.
        </p>

        <form onSubmit={handleScrape} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase">
              URL Сайта Конкурента для Мониторинга & Парсинга
            </label>
            <input
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://collaborator.pro or https://accessily.com"
              className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Обход JS/Антибота и очистка контента...
              </>
            ) : (
              <>
                <Flame className="w-4 h-4" />
                Спарсить Конкурента через Firecrawl
              </>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-6">
          {/* Detected Pricing Tiers */}
          <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase">
              <DollarSign className="w-4 h-4" />
              Обнаруженные Тарифные Планы Конкурента
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.detectedPricing?.map((tier, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-dark-900 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{tier.plan_name}</span>
                    <span className="text-xs font-mono font-bold text-amber-400">{tier.price}</span>
                  </div>
                  <ul className="space-y-1">
                    {tier.features.map((f, fIdx) => (
                      <li key={fIdx} className="text-[11px] text-gray-400 flex items-center gap-1.5">
                        <span className="text-amber-500">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Release Signals */}
          <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-3">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm uppercase">
              <Zap className="w-4 h-4" />
              Сигналы Релизов и Изменений
            </div>

            <div className="space-y-2">
              {result.releaseSignals?.map((sig, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-dark-900 border border-gray-800 text-xs text-gray-200">
                  {sig}
                </div>
              ))}
            </div>
          </div>

          {/* Clean Markdown Extraction */}
          <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-300 font-bold text-sm uppercase">
                <FileCode className="w-4 h-4 text-amber-400" />
                Очищенный Markdown Контент (LLM-Ready)
              </div>
              <span className="text-xs font-mono text-gray-400">
                Context Tokens: ~{result.llmContextTokenEstimate}
              </span>
            </div>

            <pre className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap font-mono bg-dark-900 p-4 rounded-xl border border-gray-800 max-h-96 overflow-y-auto">
              {result.contentMarkdown}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
