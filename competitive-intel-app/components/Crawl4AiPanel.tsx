'use client';

import React, { useState } from 'react';
import { Cpu, Loader2, Layers, CheckCircle2, Database, Download, Code, Sparkles, Copy, Check } from 'lucide-react';
import { Crawl4AiResult } from '@/lib/scrapers/crawl4aiEngine';

export default function Crawl4AiPanel() {
  const [targetUrl, setTargetUrl] = useState('https://collaborator.pro');
  const [extractStrategy, setExtractStrategy] = useState('cosine_similarity');
  const [chunkSize, setChunkSize] = useState(512);
  const [result, setResult] = useState<Crawl4AiResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState<'pgvector' | 'pinecone'>('pgvector');

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/research/crawl4ai-scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl, extractStrategy, chunkSize }),
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

  const handleCopyExport = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(type);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="p-6 rounded-2xl bg-dark-800/80 border border-gray-800 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Crawl4AI Advanced RAG Vector Scraper (unclecode/crawl4ai ★ 25k+)</h2>
        </div>
        <p className="text-xs text-gray-400">
          Сверхбыстрый открытый краулер для RAG-систем: семантическое чанкирование, превью 1536-мерных эмбеддингов, граф сущностей и экспорт в Supabase <code className="font-mono text-emerald-400">pgvector</code>.
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

          {/* Controls: Strategy & Chunk Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase">Стратегия Извлечения</label>
              <div className="flex rounded-xl bg-dark-900 p-1 border border-gray-800">
                {[
                  { id: 'cosine_similarity', label: 'Cosine Similarity' },
                  { id: 'llm_entity_extraction', label: 'LLM Entity Graph' },
                  { id: 'bm25_sparse', label: 'BM25 Hybrid' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setExtractStrategy(s.id)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      extractStrategy === s.id
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase">Размер Чанка (Tokens)</label>
              <div className="flex rounded-xl bg-dark-900 p-1 border border-gray-800">
                {[256, 512, 1024].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setChunkSize(size)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      chunkSize === size
                        ? 'bg-sky-600 text-white shadow'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {size} Tokens
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Векторизация и построение графа сущностей...
              </>
            ) : (
              <>
                <Layers className="w-4 h-4" />
                Запустить RAG Векторизацию & Эмбеддинги
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
                <span className="block text-xs text-emerald-300">
                  Стратегия: <code className="font-mono text-white">{result.extractionStrategy}</code> | Чанк: <code className="font-mono text-white">{result.chunkSizeTokens} tokens</code>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowExportModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                Экспорт в pgvector / Pinecone
              </button>
              <span className="text-2xl font-black font-mono text-emerald-400">
                {result.ragVectorReadinessScore}%
              </span>
            </div>
          </div>

          {/* Knowledge Graph Entities */}
          <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-3">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm uppercase">
              <Sparkles className="w-4 h-4" />
              Граф Извлеченных Сущностей (LLM Entity Knowledge Graph)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.knowledgeGraphEntities?.map((ent, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-dark-900 border border-gray-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{ent.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {(ent.confidence * 100).toFixed(0)}% Match
                    </span>
                  </div>
                  <span className="block text-[10px] font-mono text-sky-400 uppercase tracking-wider">{ent.category}</span>
                  <p className="text-[11px] text-gray-400 italic mt-1">{ent.snippet}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Semantic Chunks with 1536-Dim Vector Preview */}
          <div className="p-5 rounded-xl bg-dark-800/80 border border-gray-800 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm uppercase">
              <Database className="w-4 h-4 text-emerald-400" />
              Семантические Векторные Чанки & Эмбеддинги (text-embedding-3-small 1536-dim)
            </div>

            <div className="space-y-4">
              {result.semanticChunks?.map((chunk) => (
                <div key={chunk.chunkIndex} className="p-4 rounded-xl bg-dark-900 border border-gray-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-sky-400">Чанк #{chunk.chunkIndex}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                        Similarity: {(chunk.vectorSimilarityScore * 100).toFixed(1)}%
                      </span>
                      <span className="font-mono text-gray-400 bg-gray-800 px-2 py-0.5 rounded">
                        {chunk.tokenCount} Tokens
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-200 leading-relaxed font-sans">{chunk.content}</p>

                  <div className="p-3 rounded-lg bg-dark-950 border border-gray-800/80 space-y-1">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">
                      1536-Dim Vector Preview (OpenAI / Supabase pgvector)
                    </span>
                    <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto">
                      [{chunk.vectorPreview.join(', ')}, ...]
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-2xl w-full p-6 rounded-2xl bg-dark-800 border border-gray-700 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-emerald-400" />
                Экспорт Чанков в Векторную Базу Данных
              </h3>
              <button onClick={() => setShowExportModal(false)} className="text-gray-400 hover:text-white text-lg">✕</button>
            </div>

            <div className="flex rounded-xl bg-dark-900 p-1 border border-gray-800">
              <button
                onClick={() => setExportType('pgvector')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                  exportType === 'pgvector' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Supabase pgvector (SQL)
              </button>
              <button
                onClick={() => setExportType('pinecone')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                  exportType === 'pinecone' ? 'bg-sky-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Pinecone (JSON Upsert)
              </button>
            </div>

            <div className="relative">
              <pre className="text-xs font-mono bg-dark-950 p-4 rounded-xl border border-gray-800 text-gray-300 max-h-80 overflow-y-auto">
                {exportType === 'pgvector' ? result.pgvectorFullSql : result.pineconeExportJson}
              </pre>

              <button
                onClick={() =>
                  handleCopyExport(
                    exportType === 'pgvector' ? result.pgvectorFullSql : result.pineconeExportJson,
                    exportType
                  )
                }
                className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
              >
                {copiedFormat === exportType ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Скопировано!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Скопировать
                  </>
                )}
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
