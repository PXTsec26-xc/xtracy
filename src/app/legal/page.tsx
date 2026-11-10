import React from 'react';
import { Metadata } from 'next';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { OfficialProjectInfo } from '@/components/common/OfficialProjectInfo';
import { Scale, ShieldCheck, AlertTriangle, FileText, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Legal Terms & Defensive Usage Policy | XTRACY',
  description:
    'Official legal terms, defensive acceptable use policy, limitation of liability, disclaimers, and intellectual property notices for XTRACY. Founded by Elliot PXT sec26 (Founder of PhantomXTrace).',
  alternates: {
    canonical: 'https://xtracy.vercel.app/legal',
  },
  openGraph: {
    title: 'Legal Terms & Defensive Usage Policy | XTRACY',
    description:
      'Official legal terms, defensive scope, and intellectual property terms for XTRACY. Founded by Elliot PXT sec26.',
    url: 'https://xtracy.vercel.app/legal',
    siteName: 'XTRACY',
  },
};

export default function LegalPage() {
  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Scale className="w-8 h-8 text-brand-cyan" />
              Legal Terms &amp; Defensive Usage Policy
            </h1>
            <Badge type="productStatus" value="LEGAL DISCLOSURE" size="sm" />
          </div>
          <span className="text-xs text-sky-400 font-mono font-semibold">
            Founder of PhantomXTrace (PXT)
          </span>
        </div>
        <p className="text-xs text-gray-400">
          Terms of service, authorized defensive usage boundaries, limitation of liability, and intellectual property rights.
        </p>
      </div>

      {/* Official Attribution Banner */}
      <div className="p-4 rounded-xl bg-darkBg-card/80 border border-gray-800 text-xs text-gray-300 flex items-center justify-between flex-wrap gap-2">
        <span className="font-semibold text-white">
          Founded by Elliot PXT sec26. Developed under the PhantomXTrace (PXT) identity.
        </span>
        <span className="text-[10px] font-mono text-brand-cyan uppercase">
          DEFENSIVE LEGAL BASELINE
        </span>
      </div>

      {/* Section 1: Authorized Defensive Use */}
      <GlassCard className="p-8 border-brand-cyan/40 shadow-2xl flex flex-col gap-4 text-xs leading-relaxed text-gray-300">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-brand-cyan" />
          1. Authorized Defensive Scope &amp; Acceptable Use Policy
        </h2>
        <p>
          XTRACY is designed and deployed solely for authorized defensive cybersecurity, security awareness education, digital footprint assessment, and cryptographic evidence organization.
        </p>
        <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 font-mono text-xs flex flex-col gap-2">
          <strong className="text-red-400 uppercase text-[11px] font-sans">Strictly Prohibited Activities:</strong>
          <ul className="list-disc pl-5 space-y-1 text-gray-300">
            <li>Using XTRACY tools to identify targets for unauthorized intrusion or network attack.</li>
            <li>Conducting denial-of-service, flood testing, or load attacks against external servers or XTRACY infrastructure.</li>
            <li>Harvesting personal credentials, session tokens, or unauthorized private keys.</li>
            <li>Attempting to bypass the Server-Side Request Forgery (SSRF) boundary filter or internal address blocks.</li>
          </ul>
        </div>
      </GlassCard>

      {/* Section 2: Disclaimers & Limitations of Liability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6 border-amber-500/30 flex flex-col gap-3">
          <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> 2. Security Diagnostic Disclaimer
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Automated heuristic diagnostics, domain lookups, and risk scores provided by XTRACY represent automated technical evaluations based on observable signals at the time of query. They do not constitute a legal opinion, guaranteed safety assurance, or certified security certification.
          </p>
        </GlassCard>

        <GlassCard className="p-6 border-amber-500/30 flex flex-col gap-3">
          <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
            <Lock className="w-5 h-5" /> 3. Forensic &amp; Legal Admissibility
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            XTRACY EvidencePulse™ generates SHA-256 digests and RFC 8785 canonical manifests to verify data continuity mathematically. XTRACY is not an accredited law-enforcement laboratory or forensic body. The user remains responsible for statutory chain-of-custody procedures.
          </p>
        </GlassCard>
      </div>

      {/* Section 3: Intellectual Property & Copyright Notice */}
      <GlassCard className="p-6 border-gray-800 flex flex-col gap-3 text-xs leading-relaxed text-gray-300">
        <h3 className="text-base font-bold text-white flex items-center gap-2 text-brand-cyan">
          <FileText className="w-5 h-5" /> 4. Intellectual Property &amp; Authorship Notice
        </h3>
        <p>
          Original software source code, algorithmic logic, and technical documentation authored for XTRACY are the intellectual property of <strong>Elliot PXT sec26</strong> under the <strong>PhantomXTrace (PXT)</strong> research identity.
        </p>
        <p>
          Original project materials are subject to applicable intellectual property rights and third-party permissive licences (MIT, ISC, Apache-2.0). Nothing in these terms claims exclusive ownership over standard public domain algorithms, mathematical hash standards, or third-party open-source components.
        </p>
        <p className="text-gray-400 text-[11px]">
          Statements regarding original authorship represent the founder&apos;s declaration and development records, which are distinct from statutory registration certificates.
        </p>
      </GlassCard>

      {/* Official Project Information Card */}
      <OfficialProjectInfo />

      {/* Quick Navigation Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Link
          href="/intellectual-property"
          className="p-3 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-800 text-center text-xs font-bold text-brand-cyan transition-all"
        >
          Intellectual Property Details →
        </Link>
        <Link
          href="/ownership"
          className="p-3 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-800 text-center text-xs font-bold text-emerald-400 transition-all"
        >
          Ownership Declaration →
        </Link>
        <Link
          href="/governance"
          className="p-3 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-800 text-center text-xs font-bold text-sky-400 transition-all"
        >
          Security Governance →
        </Link>
      </div>
    </div>
  );
}
