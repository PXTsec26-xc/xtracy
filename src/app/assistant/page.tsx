'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { FeatureStatusBadge } from '@/components/ui/FeatureStatusBadge';
import { Terminal, Send, Sparkles, HelpCircle, CheckCircle2, AlertTriangle, ShieldCheck, Cpu, Lock } from 'lucide-react';

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
              XTRACY AI Assistant: Universal IT &amp; Cybersecurity
            </h1>
            <Badge type="productStatus" value="TECHNICAL ASSISTANT" size="sm" />
          </div>
          <FeatureStatusBadge status="LIVE" label="● PROBLEM-SOLVING ENGINE" />
        </div>
        <p className="text-xs text-gray-400">
          Practical IT troubleshooting, networking, secure coding, digital forensics guidance, and evidence explanation.
        </p>
      </div>

      {/* Mode Selector & Input Area */}
      <GlassCard className="p-6 border-brand-cyan/40 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
          <span className="text-gray-400 font-bold">Assistant Operating Mode:</span>
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
            placeholder="Ask any IT or Cybersecurity question (e.g. 'How do I check DNS SPF records?', 'Explain WebCrypto AES-GCM', 'Troubleshoot Linux network interface')..."
            rows={4}
            className="w-full p-4 rounded-xl bg-darkBg-panel border border-gray-800 text-white placeholder-gray-500 text-xs focus:border-brand-cyan resize-none"
            required
          />

          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[10px] text-gray-500 font-mono">
              ⚠️ AI guidance. Verify critical actions independently before deploying to production.
            </span>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Processing Query...' : 'Ask AI Assistant'}</span>
            </button>
          </div>
        </form>
      </GlassCard>

      {/* AI Assistant Output Card */}
      {response && (
        <GlassCard className="p-6 border-gray-800 flex flex-col gap-6 text-xs animate-fadeIn">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4 flex-wrap gap-2">
            <div>
              <span className="text-[10px] text-brand-cyan font-mono uppercase font-bold">
                Information Classification: {response.classification}
              </span>
              <h3 className="text-base font-bold text-white">Direct Solution &amp; Problem Analysis</h3>
            </div>

            {response.incidentModeNotice && (
              <span className="px-3 py-1 rounded bg-amber-950 border border-amber-800 text-amber-300 font-mono font-bold text-[10px]">
                {response.incidentModeNotice}
              </span>
            )}
          </div>

          <p className="text-sm font-semibold text-white leading-relaxed">{response.directSolution}</p>

          {/* 10-Step Troubleshooting Instructions */}
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
            <span>Source Trust Metadata: {response.metadata.sourceName}</span>
            <span>{response.aiNotice}</span>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
