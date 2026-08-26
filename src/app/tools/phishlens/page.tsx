'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ShieldAlert, CheckCircle2, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function PhishLensToolPage() {
  const [content, setContent] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/tools/phishlens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data.data);
        setError(null);
      } else {
        setError(data.error?.message || 'Analysis could not be completed.');
        setResult(null);
      }
    } catch (err: any) {
      setError(`Network error: ${err.message || 'Unable to connect to PhishLens service'}`);
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
              <ShieldAlert className="w-8 h-8 text-amber-400" />
              PhishLens Social Engineering Analyzer
            </h1>
            <Badge type="productStatus" value="PHISHING ANALYZER" size="sm" />
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Analyze suspicious messages, SMS, WhatsApp texts, or emails for social engineering tactics and urgency manipulation.
        </p>
      </div>

      {/* Input Form */}
      <GlassCard className="p-6 border-amber-500/30 shadow-2xl flex flex-col gap-4">
        <form onSubmit={handleAnalyze} className="flex flex-col gap-4 text-xs">
          <label className="font-bold text-gray-300">Paste Message, SMS, or Email Text:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="e.g. URGENT: Your bank account will be blocked in 2 hours. Click here to verify OTP..."
            rows={4}
            className="p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 text-white placeholder-gray-500 text-xs focus:border-amber-400 resize-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="self-end px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{loading ? 'Analyzing Tactics...' : 'Run PhishLens Diagnostic'}</span>
          </button>
        </form>
      </GlassCard>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results */}
      {result && (
        <GlassCard className="p-6 border-amber-500/40 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <div>
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Social Engineering Exposure</span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-3xl font-black text-white">{result.riskScore}/100</span>
                <Badge type="risk" value={result.riskLevel} size="md" />
              </div>
            </div>

            <Link
              href={`/assistant?context=${encodeURIComponent('PHISHLENS-' + result.riskScore)}`}
              className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask XTRACY AI About This</span>
            </Link>
          </div>

          {/* Beginner Explanation Box */}
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800 text-amber-200 text-xs leading-relaxed flex flex-col gap-1">
            <strong className="text-amber-300 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
              <HelpCircle className="w-4 h-4" /> Explain Like I Am a Beginner
            </strong>
            <p>{result.beginnerExplanation}</p>
          </div>

          {/* Detected Tactics */}
          <div className="flex flex-col gap-2 text-xs">
            <strong className="text-white font-bold uppercase text-[10px]">Detected Tactics & Phrases:</strong>
            {result.detectedTactics?.map((t: string, idx: number) => (
              <div key={idx} className="p-3 rounded-lg bg-darkBg-panel border border-gray-800 text-gray-300 font-medium">
                ⚠️ {t}
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
