'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { FeatureStatusBadge } from '@/components/ui/FeatureStatusBadge';
import { ScamCheckResult, SCAM_CHECK_DISCLAIMER } from '@/lib/server/scamCheck';
import { ShieldAlert, Search, HelpCircle, CheckCircle2, AlertTriangle, Info, FileText } from 'lucide-react';

export default function ScamCheckPage() {
  const [targetType, setTargetType] = useState<any>('SMS_TEXT');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScamCheckResult | null>(null);

  const handleRunCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/tools/scam-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType, content }),
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
      {/* Disclaimer */}
      <div className="p-3.5 rounded-xl bg-gray-900/90 border border-gray-800 text-[11px] text-gray-400 leading-relaxed flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
        <div>
          <strong className="text-white font-bold">XTRACY SCAM CHECK DISCLAIMER: </strong>
          {SCAM_CHECK_DISCLAIMER}
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <ShieldAlert className="w-8 h-8 text-amber-400" />
              XTRACY Scam Check Engine
            </h1>
            <Badge type="productStatus" value="EVIDENCE-BASED SCAM DIAGNOSTIC" size="sm" />
          </div>
          <FeatureStatusBadge status="LOCAL" label="● 100% LOCAL HEURISTICS" />
        </div>
        <p className="text-xs text-gray-400">
          Analyze suspicious messages, URLs, job offers, payment requests, or crypto lures against deterministic risk indicators.
        </p>
      </div>

      {/* Input Form */}
      <GlassCard className="p-6 border-amber-500/40 shadow-2xl flex flex-col gap-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <Search className="w-4 h-4" /> Submit Content for Scam Analysis
        </h3>

        <form onSubmit={handleRunCheck} className="flex flex-col gap-4 text-xs">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-gray-300">Content Category:</label>
            <select
              value={targetType}
              onChange={(e) => setTargetType(e.target.value)}
              className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs font-bold"
            >
              <option value="SMS_TEXT">SMS / WhatsApp Message</option>
              <option value="EMAIL_TEXT">Email Body / Header Content</option>
              <option value="JOB_OFFER">Job Offer / Recruitment Message</option>
              <option value="PAYMENT_REQUEST">Payment / Wire Transfer Lure</option>
              <option value="CRYPTO_LURE">Cryptocurrency / Investment Lure</option>
              <option value="URL">Website URL / Domain Target</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-gray-300">Suspicious Message Text or URL Content:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste suspicious SMS text (e.g. 'Urgent! Your account is blocked. Verify now: http://...'), job offer email, or payment message..."
              rows={4}
              className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white placeholder-gray-500 text-xs focus:border-amber-400 resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="self-end px-8 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Analyzing Risk Indicators...' : 'Analyze Scam Indicators'}</span>
          </button>
        </form>
      </GlassCard>

      {/* Analysis Result */}
      {result && (
        <GlassCard className="p-6 border-gray-800 flex flex-col gap-6 text-xs animate-fadeIn">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold">Analysis Verdict</span>
              <h3 className="text-lg font-bold text-white">{result.verdictCategory}</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-white">{result.riskScore}</span>
              <span className="text-xs text-gray-500 font-bold">/100 Risk</span>
            </div>
          </div>

          <p className="text-gray-200 text-sm font-semibold">{result.summary}</p>

          {/* Why This Result Section */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> Why This Result? (Contributing Risk Factors)
            </h4>

            <div className="flex flex-col gap-2">
              {result.factors.map((f, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-white font-bold">{f.indicator}</strong>
                    <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono text-[10px]">
                      {f.weight} WEIGHT
                    </span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{f.reasoning}</p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
