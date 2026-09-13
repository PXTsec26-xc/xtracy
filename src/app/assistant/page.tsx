'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { FeatureStatusBadge } from '@/components/ui/FeatureStatusBadge';
import { Terminal, Send, Sparkles, HelpCircle, CheckCircle2, AlertTriangle, ShieldCheck, Cpu, Lock, FileText, ArrowRight } from 'lucide-react';

export default function AssistantPage() {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'SIMPLE' | 'TECHNICAL' | 'LEARNING' | 'INCIDENT_ASSISTANCE'>('TECHNICAL');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResponse(data.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Terminal className="w-8 h-8 text-brand-cyan" />
              XTRACY Investigation Copilot
            </h1>
            <Badge type="productStatus" value="EVIDENCE COPILOT" size="sm" />
          </div>
          <FeatureStatusBadge status="LIVE" label="● EVIDENCE-AWARE REASONING" />
        </div>
        <p className="text-xs text-gray-400">
          Ask evidence queries, request step-by-step IT troubleshooting, analyze investigation cases, and inspect evidence trails.
        </p>
      </div>

      {/* Mode Selector & Input Area */}
      <GlassCard className="p-6 border-brand-cyan/40 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
          <span className="text-gray-400 font-bold">Copilot Mode:</span>
          <div className="flex items-center gap-2">
            {(['SIMPLE', 'TECHNICAL', 'LEARNING', 'INCIDENT_ASSISTANCE'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1 rounded-xl border text-[11px] font-bold transition-all ${
                  mode === m
                    ? 'bg-brand-cyan text-black border-brand-cyan font-extrabold'
                    : 'bg-darkBg-panel text-gray-400 border-gray-800 hover:text-white'
                }`}
              >
                {m.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask Copilot (e.g. 'What is the strongest evidence?', 'What is uncertain?', 'How do I verify DNS SPF records?', 'Explain WebCrypto SHA-256 integrity')..."
            rows={4}
            className="w-full p-4 rounded-xl bg-darkBg-panel border border-gray-800 text-white placeholder-gray-500 text-xs focus:border-brand-cyan resize-none font-mono"
            required
          />

          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[10px] text-gray-500 font-mono">
              ⚠️ AI Copilot guidance. Verify critical actions independently before production deployment.
            </span>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Processing Query...' : 'Ask Copilot'}</span>
            </button>
          </div>
        </form>
      </GlassCard>

      {/* Copilot Output Card */}
      {response && (
        <GlassCard className="p-6 border-gray-800 flex flex-col gap-6 text-xs animate-fadeIn">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4 flex-wrap gap-2 font-mono">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 uppercase">Copilot Evidence Label:</span>
              <span className={`px-2.5 py-0.5 rounded font-extrabold text-[10px] ${
                response.label === 'VERIFIED FACT'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : response.label === 'UNKNOWN'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-sky-950 text-sky-300 border border-sky-800'
              }`}>
                {response.label || 'SUPPORTED INFERENCE'}
              </span>
            </div>

            {response.incidentModeNotice && (
              <span className="px-3 py-1 rounded bg-amber-950 border border-amber-800 text-amber-300 font-mono font-bold text-[10px]">
                {response.incidentModeNotice}
              </span>
            )}
          </div>

          <p className="text-sm font-semibold text-white leading-relaxed">{response.directSolution}</p>

          {/* Evidence Trail Badges */}
          {response.evidenceTrail && response.evidenceTrail.length > 0 && (
            <div className="flex flex-col gap-2 font-mono">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Supporting Evidence Trail:</span>
              <div className="flex items-center gap-2 flex-wrap text-[11px]">
                {response.evidenceTrail.map((ev: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 rounded-xl bg-darkBg-panel border border-gray-800 text-brand-cyan">
                    🔍 {ev}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 10-Step Resolution Instructions */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-brand-cyan uppercase tracking-wider font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Step-by-Step Problem Resolution Instructions
            </h4>

            <div className="flex flex-col gap-2 font-mono text-xs">
              {response.stepByStep.map((step: string, idx: number) => (
                <div key={idx} className="p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 text-gray-200">
                  {step}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1">
              <strong className="text-brand-cyan text-[10px] uppercase font-sans">Why This Solution Works:</strong>
              <p className="text-gray-300 text-xs font-sans leading-relaxed">{response.whyItWorks}</p>
            </div>

            <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1">
              <strong className="text-emerald-400 text-[10px] uppercase font-sans">Verification Step:</strong>
              <p className="text-gray-300 text-xs font-sans leading-relaxed">{response.verificationStep}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-900 border border-gray-800 text-[11px] text-gray-400 font-mono flex items-center justify-between">
            <span>Source Metadata: {response.metadata?.sourceName}</span>
            <span>{response.aiNotice}</span>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
