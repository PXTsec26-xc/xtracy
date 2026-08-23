'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataTrustBadge } from '@/components/ui/DataTrustBadge';
import { ShieldAlert, Send, CheckCircle2, AlertCircle, Info, Lock } from 'lucide-react';

export const CommunitySubmissionForm: React.FC = () => {
  const [category, setCategory] = useState<'Phishing URL' | 'Scam SMS' | 'Impersonation' | 'Deepfake' | 'Malware / Ransomware' | 'Other'>('Phishing URL');
  const [sampleContent, setSampleContent] = useState('');
  const [targetPlatform, setTargetPlatform] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successResult, setSuccessResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sampleContent || sampleContent.trim().length < 5) return;

    setIsLoading(true);
    setError(null);
    setSuccessResult(null);

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, sampleContent, targetPlatform, submitterName }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error?.message || 'Submission failed.');
        setIsLoading(false);
        return;
      }

      setSuccessResult(data.data);
      setSampleContent('');
      setTargetPlatform('');
    } catch (err) {
      setError('Connection error. Please try submitting again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassCard className="p-6 border-brand-blue/30 shadow-2xl flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white uppercase tracking-wider">Report Suspicious Threat or Scam</h3>
        </div>
        <DataTrustBadge status="LIVE" sourceName="Community Defense Submission Engine" />
      </div>

      {successResult && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex flex-col gap-2">
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" /> Threat Submission Received!
          </div>
          <p>
            Your report has been queued for verification. Assigned Risk Heuristic Score: <strong className="text-white">{successResult.riskScore}/100</strong>.
          </p>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-gray-300">Threat Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs"
            >
              <option value="Phishing URL">Phishing URL / Fake Domain</option>
              <option value="Scam SMS">Scam SMS / Smishing Text</option>
              <option value="Impersonation">Social Media Impersonation</option>
              <option value="Deepfake">Deepfake Video / Voice Fraud</option>
              <option value="Malware / Ransomware">Malware / Ransomware Indicator</option>
              <option value="Other">Other Cyber Incident</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-gray-300">Target Platform / App:</label>
            <input
              type="text"
              value={targetPlatform}
              onChange={(e) => setTargetPlatform(e.target.value)}
              placeholder="e.g. WhatsApp, Instagram, Gmail, SMS"
              className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white placeholder-gray-500 text-xs focus:border-brand-cyan"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-bold text-gray-300">Suspicious Content / URL Sample:</label>
          <textarea
            value={sampleContent}
            onChange={(e) => setSampleContent(e.target.value)}
            placeholder="Paste suspicious URL, email header, or scam text message here for risk verification..."
            rows={4}
            className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white placeholder-gray-500 text-xs focus:border-brand-cyan resize-none"
            required
            minLength={5}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-bold text-gray-300">Submitter Display Name (Optional):</label>
          <input
            type="text"
            value={submitterName}
            onChange={(e) => setSubmitterName(e.target.value)}
            placeholder="Anonymous Member or handle"
            className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white placeholder-gray-500 text-xs focus:border-brand-cyan"
          />
        </div>

        <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 text-[11px] text-gray-400 flex items-start gap-2">
          <Lock className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
          <p>
            <strong className="text-gray-200">PRIVACY NOTICE:</strong> Do not include passwords, OTPs, or personally identifiable financial numbers. Submissions are sanitized automatically before appearing in the public community directory.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="self-end px-8 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>{isLoading ? 'Submitting & Analyzing...' : 'Submit Threat Report'}</span>
        </button>
      </form>
    </GlassCard>
  );
};
