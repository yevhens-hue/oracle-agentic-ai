'use client';

import React, { useState } from 'react';
import { ShieldCheck, Loader2, Cpu, CheckCircle2, AlertTriangle, Key, Layers, ArrowRight, DollarSign, Activity, GitCommit } from 'lucide-react';
import { AgentEvalMetric, GovernanceResult, LcelHandoffChainStep, runAgentEvalsBenchmark, evaluateToolGovernance, getLcelHandoffChain } from '@/lib/agents/agentEvalsGovernance';

export default function AgentGovernancePanel() {
  const [agentName, setAgentName] = useState('GPT-Researcher');
  const [toolName, setToolName] = useState('firecrawl_scrape');
  const [targetCompany, setTargetCompany] = useState('Adsy');

  const [evals, setEvals] = useState<AgentEvalMetric | null>(null);
  const [governance, setGovernance] = useState<GovernanceResult | null>(null);
  const [handoffChain, setHandoffChain] = useState<LcelHandoffChainStep[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunBenchmark = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/research/agent-evals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentName, toolName, targetCompany }),
      });
      const json = await res.json();
      if (json.success) {
        setEvals(json.data.agentEvals);
        setGovernance(json.data.governance);
        setHandoffChain(json.data.handoffChain);
      } else {
        // Fallback execution
        setEvals(await runAgentEvalsBenchmark(agentName));
        setGovernance(evaluateToolGovernance(toolName));
        setHandoffChain(getLcelHandoffChain(targetCompany));
      }
    } catch (err) {
      console.warn('Evals fallback execution:', err);
      setEvals(await runAgentEvalsBenchmark(agentName));
      setGovernance(evaluateToolGovernance(toolName));
      setHandoffChain(getLcelHandoffChain(targetCompany));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls Form */}
      <div className="p-6 rounded-2xl bg-dark-800/80 border border-gray-800 backdrop-blur-md space-y-4 shadow-2xl">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Agent Evals & Enterprise Tool Governance (EDD & Safety Gatekeeper)</h2>
        </div>
        <p className="text-xs text-gray-400">
          Бенчмаркинг точности вызова инструментов (Precision/Recall), расчёт стоимости одного вызова ($/task), валидация JSON-схем, проверка ключей идемпотентности и визуализатор LCEL Handoff цепочек.
        </p>

        <form onSubmit={handleRunBenchmark} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase">
                Анализируемый Агент (Agent Name)
              </label>
              <select
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-gray-700 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
              >
                <option value="GPT-Researcher">GPT-Researcher Engine</option>
                <option value="CrewAI Intel Workflow">CrewAI Intel Workflow</option>
                <option value="Crawl4AI RAG Scraper">Crawl4AI RAG Scraper</option>
                <option value="18 Marketing Subagents">18 Marketing Subagents</option>
                <option value="AI War Room Simulator">AI War Room Simulator</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase">
                Инструмент Governance (Tool Name)
              </label>
              <select
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-gray-700 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
              >
                <option value="firecrawl_scrape">firecrawl_scrape (Read-Only)</option>
                <option value="crawl4ai_vector_push">crawl4ai_vector_push (Write DB)</option>
                <option value="delete_competitor_record">delete_competitor_record (Sensitive)</option>
                <option value="cmo_strategy_export">cmo_strategy_export (Report Export)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase">
                Целевой Бренд (Target Domain)
              </label>
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="e.g. Adsy"
                className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-gray-700 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Расчёт метрик бенчмаркинга Evals & Safety Governance...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-yellow-300" />
                Запустить Бенчмаркинг Evals & Safety Governance
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results Dashboard */}
      {evals && governance && handoffChain && (
        <div className="space-y-6">
          {/* Autonomous Agent Evals Metrics */}
          <div className="p-5 rounded-2xl bg-dark-800/80 border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase">
                <Activity className="w-4 h-4" />
                Autonomous Agent Evals Dashboard ({evals.agentName})
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                LLM-as-a-Judge Score: {evals.evalJudgeScore}/100
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-dark-900 border border-gray-800 space-y-1">
                <span className="text-[11px] text-gray-400 font-semibold uppercase">Tool Precision</span>
                <div className="text-2xl font-black font-mono text-emerald-400">{evals.toolCallingPrecision}%</div>
                <span className="text-[10px] text-emerald-400">Zero Invalid Tool Calls</span>
              </div>

              <div className="p-4 rounded-xl bg-dark-900 border border-gray-800 space-y-1">
                <span className="text-[11px] text-gray-400 font-semibold uppercase">Hallucination Rate</span>
                <div className="text-2xl font-black font-mono text-sky-400">{evals.hallucinationRatePercent}%</div>
                <span className="text-[10px] text-sky-300">Grounded in Web Context</span>
              </div>

              <div className="p-4 rounded-xl bg-dark-900 border border-gray-800 space-y-1">
                <span className="text-[11px] text-gray-400 font-semibold uppercase">Cost Per Task ($)</span>
                <div className="text-2xl font-black font-mono text-purple-400">${evals.costPerTaskUsd}</div>
                <span className="text-[10px] text-purple-300">Hybrid LLM Routing Savings</span>
              </div>

              <div className="p-4 rounded-xl bg-dark-900 border border-gray-800 space-y-1">
                <span className="text-[11px] text-gray-400 font-semibold uppercase">Latency (P95)</span>
                <div className="text-2xl font-black font-mono text-amber-400">{evals.latencyP95Ms} ms</div>
                <span className="text-[10px] text-amber-300">Ultra-Fast Agent Trajectory</span>
              </div>
            </div>
          </div>

          {/* Enterprise Tool Governance & Safety */}
          <div className="p-5 rounded-2xl bg-dark-800/80 border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-sm uppercase">
                <Key className="w-4 h-4" />
                Enterprise Safety Governance & Idempotency Gatekeeper ({governance.toolName})
              </div>
              <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${
                governance.riskCategory === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                Risk Category: {governance.riskCategory} ({governance.riskScore}/100)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-dark-900 border border-gray-800 space-y-1">
                <span className="text-xs text-gray-400 uppercase font-semibold">JSON Schema Status</span>
                <span className="block text-sm font-bold text-emerald-400 flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {governance.schemaValidationStatus}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-dark-900 border border-gray-800 space-y-1">
                <span className="text-xs text-gray-400 uppercase font-semibold">Idempotency Key</span>
                <span className="block text-xs font-mono text-gray-300 truncate pt-1">{governance.idempotencyKey}</span>
              </div>

              <div className="p-4 rounded-xl bg-dark-900 border border-gray-800 space-y-1">
                <span className="text-xs text-gray-400 uppercase font-semibold">HITL Approval Gate</span>
                <span className={`block text-xs font-bold pt-1 ${governance.hitlApprovalRequired ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {governance.hitlApprovalRequired ? '⚠️ REQUIRED ($500+ Gate)' : '✓ AUTO-APPROVED'}
                </span>
              </div>
            </div>
          </div>

          {/* LangChain LCEL & Swarm Multi-Agent Handoff Chain */}
          <div className="p-5 rounded-2xl bg-dark-800/80 border border-gray-800 space-y-4">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm uppercase">
              <GitCommit className="w-4 h-4" />
              LangChain LCEL & OpenAI Agents Swarm Handoff Chain Visualizer
            </div>

            <div className="space-y-3">
              {handoffChain.map((step) => (
                <div key={step.stepNumber} className="p-4 rounded-xl bg-dark-900 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                      Шаг #{step.stepNumber}: {step.fromAgent}
                      <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                      {step.toAgent}
                    </span>
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-purple-500/20 text-purple-300">
                      {step.handOffType}
                    </span>
                  </div>
                  <pre className="text-xs font-mono bg-dark-950 p-3 rounded-lg border border-gray-800 text-gray-300 overflow-x-auto whitespace-pre-wrap">
                    State Payload: {step.statePayload}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
