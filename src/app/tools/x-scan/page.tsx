'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataTrustBadge } from '@/components/ui/DataTrustBadge';
import { Search, ShieldAlert, CheckCircle2, AlertTriangle, Info, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function XScanToolPage() {
  const [input, setInput] = useState('');
  const [inputType, setInputType] = useState('URL');
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/tools/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, inputType }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data.data);
        setError(null);
      } else {
        setError(data.error?.message || 'Scan could not be completed.');
        setResult(null);
      }
    } catch (err: any) {
      setError(`Network error: ${err.message || 'Unable to connect to scan service'}`);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Search className="w-8 h-8 text-brand-cyan" />
              X-Scan Intelligence
            </h1>
            <Badge type="productStatus" value="SSRF PROTECTED" size="sm" />
          </div>
          <DataTrustBadge status="LIVE" sourceName="X-Scan Heuristic Engine" />
        </div>
        <p className="text-xs text-gray-400">
          Defensive URL, SMS text, and email header risk scanner evaluating suspicious structures, TLDs, and lure keywords.
        </p>
      </div>

      {/* Input Form */}
      <GlassCard className="p-6 border-brand-blue/30 shadow-2xl flex flex-col gap-4">
        <form onSubmit={handleScan} className="flex flex-col gap-4 text-xs">
          <div className="flex items-center gap-3">
            <label className="font-bold text-gray-300">Input Type:</label>
            <div className="flex gap-2">
              {['URL', 'SMS', 'EMAIL'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setInputType(t)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                    inputType === t
                      ? 'bg-brand-blue text-white border-brand-cyan shadow-glowBlue'
                      : 'bg-darkBg-panel text-gray-400 border-gray-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              inputType === 'URL'
                ? 'Enter URL (e.g. http://suspicious-verify-account.xyz)'
                : 'Paste SMS text or email header here...'
            }
            rows={3}
            className="p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 text-white placeholder-gray-500 text-xs focus:border-brand-cyan resize-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="self-end px-8 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Analyzing...' : 'Run X-Scan Intelligence'}</span>
          </button>
        </form>
      </GlassCard>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <GlassCard className="p-6 border-brand-cyan/30 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <div>
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Risk Score Rating</span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-3xl font-black text-white">{result.riskScore}/100</span>
                <Badge type="risk" value={result.riskLevel} size="md" />
              </div>
            </div>
            <Link
              href={`/assistant?context=${encodeURIComponent('XSCAN-' + result.riskScore)}`}
              className="px-4 py-2 rounded-xl bg-brand-blue/20 hover:bg-brand-blue/30 border border-brand-cyan/40 text-brand-cyan font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask XTRACY AI About This</span>
            </Link>
          </div>

          {/* 6-Part Explainability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-darkBg-panel/80 border border-gray-800 flex flex-col gap-2">
              <strong className="text-emerald-400 text-[10px] uppercase font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed Facts
              </strong>
              <ul className="list-disc pl-4 text-gray-300 space-y-1">
                {result.explainability?.facts?.map((f: string, idx: number) => (
                  <li key={idx}>{f}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-darkBg-panel/80 border border-gray-800 flex flex-col gap-2">
              <strong className="text-amber-400 text-[10px] uppercase font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Heuristic Indicators
              </strong>
              <ul className="list-disc pl-4 text-gray-300 space-y-1">
                {result.explainability?.heuristics?.map((h: string, idx: number) => (
                  <li key={idx}>{h}</li>
                )) || <li>No high-risk heuristics triggered.</li>}
              </ul>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 text-[11px] text-gray-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Analysis Limitation: </strong>
              {result.explainability?.limitations?.join(' ')}
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
