import React from 'react';
import { Metadata } from 'next';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { OfficialProjectInfo } from '@/components/common/OfficialProjectInfo';
import { ShieldCheck, Lock, Eye, AlertTriangle, FileText, CheckCircle2, Terminal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Security Governance & Pilot Readiness | XTRACY Platform',
  description:
    'XTRACY Security Governance, Responsible Vulnerability Disclosure policy, Remediation Tracking, Known Limitations, and Pilot Evaluation Readiness disclosures.',
  alternates: {
    canonical: 'https://xtracy.vercel.app/governance',
  },
};

export default function GovernancePage() {
  const remediationItems = [
    { id: 'REM-01', title: 'SSRF Protection Loopback Filter', status: 'RESOLVED', detail: 'Strict blocking for 127.0.0.1, RFC1918 private subnets, and cloud metadata (169.254.169.254).' },
    { id: 'REM-02', title: 'Client-Side WebCrypto AES-GCM Vault Encryption', status: 'RESOLVED', detail: 'Zero server-side plaintext storage of safe vault items or user credentials.' },
    { id: 'REM-03', title: 'RFC 8785 JSON Canonical Hashing', status: 'RESOLVED', detail: 'Deterministic canonical JSON encoding for tamper-evident hash chaining.' },
    { id: 'REM-04', title: 'External Threat Provider Abstraction Layer', status: 'RESOLVED', detail: 'API keys isolated to server-side environment variables with explicit fallback notices.' },
    { id: 'REM-05', title: 'Institutional Evaluation & Pilot Boundary Rules', status: 'ACCEPTED RISK', detail: 'Designed for defensive pilot evaluation and educational research; not for court certification.' },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-brand-cyan" />
              Security Governance &amp; Pilot Readiness
            </h1>
            <Badge type="productStatus" value="GOVERNANCE BASELINE" size="sm" />
          </div>
          <span className="text-xs text-gray-400 font-mono">Elliot (PXT sec26 Sahil)</span>
        </div>
        <p className="text-xs text-gray-400">
          Responsible vulnerability disclosure policies, remediation tracking, known platform limits, and pilot evaluation readiness.
        </p>
      </div>

      {/* Pilot Readiness Overview */}
      <GlassCard className="p-8 border-brand-cyan/40 shadow-2xl flex flex-col gap-4 text-xs leading-relaxed text-gray-300">
        <h2 className="text-xl font-black text-white">
          Institutional Evaluation &amp; Pilot Readiness Scope
        </h2>
        <p>
          XTRACY is prepared for limited evaluation by educational institutions, IT security learners, and security awareness teams under the evaluation classification:
        </p>
        <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 font-mono text-xs flex flex-col gap-1">
          <span className="text-gray-400 text-[10px] uppercase">Evaluation Target Classification:</span>
          <strong className="text-brand-cyan text-sm">LIMITED DEFENSIVE PILOT &amp; EDUCATIONAL EVALUATION</strong>
          <span className="text-gray-400 text-[10px] italic">Not an official law-enforcement deployment or certified forensic software.</span>
        </div>
      </GlassCard>

      {/* Remediation Tracking Grid */}
      <GlassCard className="p-6 border-gray-800 flex flex-col gap-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-brand-cyan flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Remediation Tracking &amp; Security Baseline
        </h3>

        <div className="flex flex-col gap-3 font-mono text-xs">
          {remediationItems.map((item) => (
            <div key={item.id} className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <strong className="text-white font-sans font-bold">{item.title}</strong>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                  item.status === 'RESOLVED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {item.status}
                </span>
              </div>
              <p className="text-gray-400 text-xs font-sans leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Vulnerability Disclosure Policy */}
      <GlassCard className="p-6 border-gray-800 flex flex-col gap-3 text-xs leading-relaxed text-gray-300">
        <h3 className="text-base font-bold text-white flex items-center gap-2 text-emerald-400">
          <Lock className="w-5 h-5" /> Responsible Vulnerability Disclosure Policy
        </h3>
        <p>
          We welcome security research from authorized researchers. If you discover a vulnerability in XTRACY, please report it responsibly:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 font-mono text-xs text-gray-400">
          <li>Do not execute destructive testing or denial-of-service against production targets.</li>
          <li>Do not access or attempt to access other users&apos; browser local storage.</li>
          <li>Submit technical details and reproduction steps via security@xtracy.vercel.app or GitHub Security Advisories.</li>
        </ul>
      </GlassCard>

      {/* Official Project Information Card */}
      <OfficialProjectInfo />
    </div>
  );
}
