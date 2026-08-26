'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { FeatureStatusBadge } from '@/components/ui/FeatureStatusBadge';
import { ScamCheckResult, SCAM_CHECK_DISCLAIMER } from '@/lib/server/scamCheck';
import { ReportModal } from '@/components/reports/ReportModal';
import {
  ShieldAlert,
  Search,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  FileText,
  Lock,
  Printer,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Shield,
} from 'lucide-react';

export default function ScamCheckPage() {
  const [targetType, setTargetType] = useState<any>('SMS_TEXT');
  const [content, setContent] = useState('');
  const [privateMode, setPrivateMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScamCheckResult | null>(null);
  const [showWhy, setShowWhy] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleRunCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/tools/scam-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType, content, privateMode }),
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
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Disclaimer Notice */}
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
            <Badge type="productStatus" value="MULTI-LAYER SCAM DIAGNOSTIC" size="sm" />
          </div>

          <div className="flex items-center gap-3">
            {/* Private Local Analysis Toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-gray-300 bg-darkBg-panel px-3 py-1.5 rounded-xl border border-gray-800">
              <Lock className="w-3.5 h-3.5 text-brand-cyan" />
              <span>PRIVATE LOCAL MODE</span>
              <input
                type="checkbox"
                checked={privateMode}
                onChange={(e) => setPrivateMode(e.target.checked)}
                className="accent-brand-cyan"
              />
            </label>

            <FeatureStatusBadge status={privateMode ? 'LOCAL' : 'REQUIRES_API'} label={privateMode ? '● 100% LOCAL' : '● HYBRID LOOKUP'} />
          </div>
        </div>

        <p className="text-xs text-gray-400">
          Analyze suspicious messages, URLs, job offers, payment requests, or crypto lures against deterministic risk indicators.
        </p>
      </div>

      {/* Input Form */}
      <GlassCard className="p-6 border-amber-500/40 shadow-2xl flex flex-col gap-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <Search className="w-4 h-4" /> Submit Target Content for Scam Analysis
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
              <option value="SOCIAL_MEDIA">Social Media / Direct Message</option>
              <option value="URL">Website URL / Domain Target</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-gray-300">Suspicious Target Content or URL:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste suspicious SMS text (e.g. 'Urgent! Your account is suspended. Verify now: http://...'), job offer email, or payment message..."
              rows={4}
              className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white placeholder-gray-500 text-xs focus:border-amber-400 resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[11px] text-gray-400 font-mono">
              {privateMode ? '🔒 Mode: Private Local Heuristics Only (No external lookup)' : '🌐 Mode: Hybrid Heuristic + Threat Intelligence'}
            </span>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Analyzing Risk Indicators...' : 'Analyze Target'}</span>
            </button>
          </div>
        </form>
      </GlassCard>

      {/* Analysis Result Output */}
      {result && (
        <GlassCard className="p-6 border-gray-800 flex flex-col gap-6 text-xs animate-fadeIn">
          {/* Verdict Header */}
          <div className="flex items-center justify-between border-b border-gray-800 pb-4 flex-wrap gap-4">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold font-mono">Analysis Verdict</span>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                {result.verdict}
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-2xl font-black text-white">{result.riskScore} <span className="text-xs text-gray-500 font-normal">/ 100</span></span>
                <span className="text-[10px] text-brand-cyan font-mono">Explainable Risk Score</span>
              </div>

              <button
                onClick={() => setShowReportModal(true)}
                className="px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-electric text-white font-extrabold text-xs shadow-glowBlue transition-all flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Security Report</span>
              </button>
            </div>
          </div>

          {/* Expandable "Why did XTRACY give this result?" Section */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowWhy(!showWhy)}
              className="flex items-center justify-between p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 text-amber-400 font-bold text-xs hover:border-amber-400 transition-all"
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4" /> Why did XTRACY give this result? ({result.factors.length} Contributing Indicators)
              </span>
              {showWhy ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showWhy && (
              <div className="flex flex-col gap-3 pt-2">
                {result.factors.map((f, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-darkBg-panel/90 border border-gray-800 flex flex-col gap-1.5 font-mono">
                    <div className="flex items-center justify-between">
                      <strong className="text-white text-xs font-sans font-bold">{f.name}</strong>
                      <span className="px-2.5 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px]">
                        +{f.points} PTS ({f.source})
                      </span>
                    </div>
                    <p className="text-gray-300 text-xs font-sans leading-relaxed">{f.technicalExplanation}</p>
                    <span className="text-gray-400 text-[10px] italic">Rationale: {f.fraudAssociationRationale}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SHA-256 Integrity Checksum Notice */}
          <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1 font-mono text-[11px]">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-gray-400">SHA-256 Evidence Integrity Checksum:</span>
              <strong className="text-emerald-400 text-[10px] break-all">{result.evidenceRecord.evidenceHash}</strong>
            </div>
            <p className="text-[10px] text-gray-500 italic border-t border-gray-800/80 pt-1 mt-1">
              {result.evidenceRecord.integrityNotice}
            </p>
          </div>
        </GlassCard>
      )}

      {/* Official India Safety Resources Section */}
      <GlassCard className="p-6 border-brand-cyan/30 flex flex-col gap-4 text-xs">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-brand-cyan flex items-center gap-2">
            <Shield className="w-4 h-4" /> Official Cybercrime Safety Portals (India)
          </h3>
          <span className="text-[10px] text-gray-400 font-mono">OFFICIAL EXTERNAL HELPLINES</span>
        </div>

        <p className="text-gray-300 leading-relaxed">
          If you have lost money or suffered financial fraud due to cybercrime in India, report immediately to official government portals within the golden period:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 hover:border-brand-cyan transition-all flex flex-col gap-1 group"
          >
            <div className="flex items-center justify-between">
              <strong className="text-white font-bold group-hover:text-brand-cyan">National Cyber Crime Reporting Portal</strong>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </div>
            <span className="text-brand-cyan font-mono text-xs font-bold">cybercrime.gov.in</span>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Official Government of India portal for reporting financial cyber fraud, phishing, and online harassment.
            </p>
          </a>

          <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1">
            <strong className="text-white font-bold">Financial Cyber Fraud Helpline</strong>
            <span className="text-amber-400 font-mono text-lg font-black">1930</span>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Toll-free national helpline number to report active financial fraud and request payment hold actions.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Report Modal */}
      {showReportModal && result && (
        <ReportModal report={result.securityReport} onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
}
