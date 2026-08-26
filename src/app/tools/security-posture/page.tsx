'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataTrustBadge } from '@/components/ui/DataTrustBadge';
import { ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, Info, ArrowRight, Sparkles, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import Link from 'next/link';

export default function SecurityPostureToolPage() {
  const [url, setUrl] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);

  const handleAssess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !authorized) return;

    setLoading(true);
    try {
      const res = await fetch('/api/tools/security-posture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, authorized }),
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
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-brand-cyan" />
              XTRACY Security Posture Check
            </h1>
            <Badge type="productStatus" value="FLAGSHIP DEFENSIVE TOOL" size="sm" />
          </div>
          <DataTrustBadge status="LIVE" sourceName="XTRACY Security Posture Engine" />
        </div>
        <p className="text-xs text-gray-400">
          Controlled server-side defensive inspection evaluating HTTPS transport, TLS protocols, security headers, SPF/DMARC mail records, and RFC 9116 security.txt.
        </p>
      </div>

      {/* Input & Mandatory Authorization Checkbox */}
      <GlassCard className="p-6 border-brand-cyan/40 shadow-2xl flex flex-col gap-4">
        <form onSubmit={handleAssess} className="flex flex-col gap-4 text-xs">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-gray-300">Target Domain or HTTPS URL:</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. https://example.com or domain.org"
              className="p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs focus:border-brand-cyan"
              required
            />
          </div>

          {/* Mandatory Authorization Confirmation */}
          <label className="flex items-center gap-3 p-3 rounded-xl bg-darkBg-panel/80 border border-gray-800 cursor-pointer hover:border-brand-cyan/40 transition-all">
            <input
              type="checkbox"
              checked={authorized}
              onChange={(e) => setAuthorized(e.target.checked)}
              className="w-4 h-4 rounded text-brand-cyan focus:ring-brand-cyan cursor-pointer"
              required
            />
            <span className="text-xs text-gray-300 font-semibold">
              I confirm that I own this target or have explicit permission to assess it.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading || !authorized}
            className="self-end px-8 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Performing Posture Analysis...' : 'Run Security Posture Assessment'}</span>
          </button>
        </form>
      </GlassCard>

      {/* Results Display */}
      {result && (
        <div className="flex flex-col gap-6">
          {/* Posture Score Banner */}
          <GlassCard className="p-6 border-brand-cyan/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Target Security Posture Score</span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-4xl font-black text-white">{result.postureScore}/100</span>
                <Badge type="risk" value={result.postureRating} size="md" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowMethodology(!showMethodology)}
                className="px-4 py-2 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-700 text-brand-cyan font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <span>SHOW HOW THIS WAS DETERMINED</span>
                {showMethodology ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              <Link
                href={`/assistant?context=${encodeURIComponent('POSTURE-' + result.hostname)}`}
                className="px-4 py-2 rounded-xl bg-brand-blue/20 hover:bg-brand-blue/30 border border-brand-cyan/40 text-brand-cyan font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask AI About Results</span>
              </Link>
            </div>
          </GlassCard>

          {/* Transparency Mode Pipeline Drawer */}
          {showMethodology && (
            <GlassCard className="p-6 border-brand-cyan/50 bg-darkBg-card/90 flex flex-col gap-3 text-xs animate-fadeIn">
              <h4 className="font-bold text-brand-cyan uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Info className="w-4 h-4" /> Methodology Pipeline (Transparency Mode)
              </h4>
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                {result.methodologyPipeline?.map((step: string, idx: number) => (
                  <React.Fragment key={idx}>
                    <span className="px-3 py-1 rounded bg-darkBg-panel text-gray-300 border border-gray-800">
                      {step}
                    </span>
                    {idx < result.methodologyPipeline.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-gray-600 shrink-0" />}
                  </React.Fragment>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Evidence-Based Findings List */}
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Evidence-Based Security Findings ({result.findingsCount})
            </h3>

            {result.findings?.map((f: any, idx: number) => (
              <GlassCard key={idx} className="p-6 border-gray-800 flex flex-col gap-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{f.title}</span>
                    <Badge type="risk" value={f.severity} size="sm" />
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Confidence: {f.confidence}</span>
                </div>

                <div className="p-3 rounded-xl bg-darkBg-panel font-mono text-brand-cyan text-[11px] border border-gray-800">
                  <strong className="text-gray-400 font-sans block text-[10px] uppercase">EVIDENCE:</strong>
                  {f.evidence}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-darkBg-panel/60 border border-gray-800">
                    <strong className="text-amber-400 block text-[10px] uppercase font-bold">WHY IT MATTERS:</strong>
                    <p className="text-gray-300 mt-1">{f.whyItMatters}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-darkBg-panel/60 border border-gray-800">
                    <strong className="text-emerald-400 block text-[10px] uppercase font-bold">RECOMMENDATION:</strong>
                    <p className="text-gray-300 mt-1">{f.recommendation}</p>
                  </div>
                </div>

                <div className="text-[10px] text-gray-500 italic border-t border-gray-800/60 pt-2">
                  <strong>Analysis Limitation:</strong> {f.limitations}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
