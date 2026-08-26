'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataTrustBadge } from '@/components/ui/DataTrustBadge';
import { Mail, CheckCircle2, AlertTriangle, Info, HelpCircle, ShieldCheck } from 'lucide-react';

export default function EmailForensicsToolPage() {
  const [rawHeaders, setRawHeaders] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawHeaders) return;

    setLoading(true);
    try {
      const res = await fetch('/api/tools/email-forensics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawHeaders }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Mail className="w-8 h-8 text-brand-cyan" />
              Email Header Forensics
            </h1>
            <Badge type="productStatus" value="FORENSIC HEADER PARSER" size="sm" />
          </div>
          <DataTrustBadge status="LIVE" sourceName="XTRACY Email Forensics Engine" />
        </div>
        <p className="text-xs text-gray-400">
          Parse raw email headers to analyze Received hop chains, SPF/DKIM/DMARC results, and Reply-To mismatch indicators.
        </p>
      </div>

      <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs font-semibold flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Privacy Guarantee: Email Header Forensics NEVER collects email passwords, private keys, or account credentials.</span>
      </div>

      {/* Input Form */}
      <GlassCard className="p-6 border-brand-blue/30 shadow-2xl flex flex-col gap-4">
        <form onSubmit={handleAnalyze} className="flex flex-col gap-4 text-xs">
          <label className="font-bold text-gray-300">Paste Raw Email Headers:</label>
          <textarea
            value={rawHeaders}
            onChange={(e) => setRawHeaders(e.target.value)}
            placeholder="Paste complete raw email headers (e.g. Received: from mail.example.com... Authentication-Results: spf=pass...)"
            rows={6}
            className="p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 text-white placeholder-gray-500 font-mono text-[11px] focus:border-brand-cyan resize-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="self-end px-8 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            <span>{loading ? 'Parsing Headers...' : 'Run Header Forensics'}</span>
          </button>
        </form>
      </GlassCard>

      {/* Results */}
      {result && (
        <GlassCard className="p-6 border-brand-cyan/30 flex flex-col gap-6 text-xs">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <div>
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Forensic Risk Exposure</span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-3xl font-black text-white">{result.riskScore}/100</span>
                <Badge type="risk" value={result.riskRating} size="md" />
              </div>
            </div>
            <span className="text-[10px] text-gray-500 font-bold uppercase">Confidence: {result.confidenceLevel}</span>
          </div>

          {/* Simple Explanation Box */}
          <div className="p-4 rounded-xl bg-brand-blue/20 border border-brand-cyan/40 text-brand-cyan text-xs leading-relaxed flex flex-col gap-1">
            <strong className="text-white font-bold uppercase text-[10px] flex items-center gap-1">
              <HelpCircle className="w-4 h-4 text-brand-cyan" /> Plain Language Explanation
            </strong>
            <p>{result.simpleExplanation}</p>
          </div>

          {/* Technical Explanation & Evidence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-2">
              <strong className="text-white uppercase text-[10px] font-bold">Technical Findings:</strong>
              <ul className="list-disc pl-4 text-gray-300 space-y-1">
                {result.findings?.map((f: string, idx: number) => (
                  <li key={idx}>{f}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-2">
              <strong className="text-brand-cyan uppercase text-[10px] font-bold">Observed Evidence:</strong>
              <ul className="list-disc pl-4 text-gray-300 font-mono text-[11px] space-y-1">
                {result.evidence?.map((e: string, idx: number) => (
                  <li key={idx}>{e}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-[11px] text-gray-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Analysis Limitation: </strong>
              {result.analysisLimitations}
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
