'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Bug, Mail, CheckCircle2, AlertTriangle, Send, ShieldCheck, FileText } from 'lucide-react';
import Link from 'next/link';

export default function SecurityDisclosurePage() {
  const [reporterEmail, setReporterEmail] = useState('');
  const [targetComponent, setTargetComponent] = useState('WEB_APP');
  const [vulnerabilitySummary, setVulnerabilitySummary] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporterEmail || !vulnerabilitySummary || !stepsToReproduce) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Bug className="w-8 h-8 text-brand-cyan" />
              Responsible Security & Vulnerability Disclosure
            </h1>
            <Badge type="productStatus" value="RFC 9116 COMPLIANT" size="sm" />
          </div>
          <a
            href="/.well-known/security.txt"
            target="_blank"
            className="px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 text-brand-cyan text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View security.txt</span>
          </a>
        </div>
        <p className="text-xs text-gray-400">
          Guidelines and reporting channel for ethical security researchers reporting vulnerabilities in XTRACY.
        </p>
      </div>

      {/* Guidelines Card */}
      <GlassCard className="p-8 border-brand-blue/30 flex flex-col gap-6 text-xs leading-relaxed text-gray-300">
        <div>
          <h2 className="text-lg font-bold text-white mb-2">Our Commitment</h2>
          <p>
            XTRACY takes platform security and privacy seriously. We welcome security researchers to test our public web application and report vulnerabilities in accordance with ethical disclosure guidelines.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-brand-cyan">
            Safe Testing Expectations & Scope
          </h3>
          <ul className="list-disc pl-5 flex flex-col gap-1.5 text-gray-300">
            <li>Do NOT access, alter, or destroy user account data or organization vaults.</li>
            <li>Do NOT perform Distributed Denial of Service (DDoS) testing against production servers.</li>
            <li>Do NOT execute social engineering or phishing attacks against XTRACY personnel.</li>
            <li>Allow a reasonable timeframe (90 days) for remediation before public disclosure.</li>
          </ul>
        </div>
      </GlassCard>

      {/* Vulnerability Reporting Form */}
      <GlassCard className="p-8 border-brand-cyan/40 flex flex-col gap-6">
        <h3 className="text-base font-bold text-white uppercase tracking-wider text-brand-cyan flex items-center gap-2">
          <Send className="w-4 h-4" /> Submit Vulnerability Report
        </h3>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex flex-col gap-2">
            <strong className="text-emerald-300 font-bold uppercase text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Vulnerability Report Received
            </strong>
            <p>
              Thank you for contributing to XTRACY&apos;s platform security. Our security team will review your submission and respond to <code className="text-white bg-darkBg p-1 rounded font-mono">{reporterEmail}</code> within 48 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitReport} className="flex flex-col gap-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-300">Researcher Email:</label>
                <input
                  type="email"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  placeholder="security-researcher@domain.com"
                  className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs focus:border-brand-cyan"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-300">Target Component / Scope:</label>
                <select
                  value={targetComponent}
                  onChange={(e) => setTargetComponent(e.target.value)}
                  className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs font-bold"
                >
                  <option value="WEB_APP">XTRACY Next.js Web App</option>
                  <option value="API_ROUTER">API Route Handler (/api/*)</option>
                  <option value="WEBCRYPTO_VAULT">WebCrypto Safe Vault</option>
                  <option value="SSRF_ENGINE">X-Scan SSRF Engine</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-gray-300">Vulnerability Summary:</label>
              <input
                type="text"
                value={vulnerabilitySummary}
                onChange={(e) => setVulnerabilitySummary(e.target.value)}
                placeholder="e.g. Missing security header or validation edge case"
                className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs focus:border-brand-cyan"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-gray-300">Steps to Reproduce & Technical Details:</label>
              <textarea
                value={stepsToReproduce}
                onChange={(e) => setStepsToReproduce(e.target.value)}
                placeholder="Provide step-by-step instructions or HTTP request samples..."
                rows={4}
                className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs focus:border-brand-cyan resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="self-end px-8 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center gap-2"
            >
              <Bug className="w-4 h-4" />
              <span>{submitting ? 'Submitting Report...' : 'Submit Security Disclosure'}</span>
            </button>
          </form>
        )}
      </GlassCard>
    </div>
  );
}
