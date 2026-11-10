import React from 'react';
import { Metadata } from 'next';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { OfficialProjectInfo } from '@/components/common/OfficialProjectInfo';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  Lock,
  GitBranch,
  Terminal,
  ExternalLink,
  ArrowRight,
  Scale,
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Declaration of Ownership & Codebase Origin | XTRACY',
  description:
    'Formal declaration of codebase origin, original authorship division, Git commit provenance, and intellectual property ownership records for XTRACY. Founded by Elliot PXT sec26 (Founder of PhantomXTrace).',
  alternates: {
    canonical: 'https://xtracy.vercel.app/ownership',
  },
  openGraph: {
    title: 'Declaration of Ownership & Codebase Origin | XTRACY',
    description:
      'Verified codebase origin and ownership division for XTRACY. Conceived and authored by Elliot PXT sec26 under PhantomXTrace (PXT).',
    url: 'https://xtracy.vercel.app/ownership',
    siteName: 'XTRACY',
  },
};

export default function OwnershipPage() {
  const commitMilestones = [
    { hash: 'e73e99e', date: '2026-10-01', author: 'Elliot', desc: 'docs: professionalize repository (26 security tests, STRIDE threat model, master dossier)' },
    { hash: '386330a', date: '2026-09-13', author: 'Elliot', desc: 'feat: complete XTRACY Final Ascension build with Graph Engine, Temporal Intel, Security Twin' },
    { hash: 'fac654c', date: '2026-08-27', author: 'Elliot', desc: 'style: implement Executive Security theme, glass UI system, and geometric logo' },
    { hash: '8b3a300', date: '2026-08-27', author: 'PXTsec26-xc', desc: 'Enhance founder section in README' },
    { hash: 'ff83a22', date: '2026-08-26', author: 'Elliot', desc: 'fix: calibrate PhishLens Social Engineering Analysis Engine' },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
              Declaration of Ownership &amp; Codebase Origin
            </h1>
            <Badge type="productStatus" value="PROVENANCE VERIFIED" size="sm" />
          </div>
          <span className="text-xs text-sky-400 font-mono font-semibold">
            Founder of PhantomXTrace (PXT)
          </span>
        </div>
        <p className="text-xs text-gray-400">
          Formal declaration of original software authorship, intellectual property division, and version control audit trail.
        </p>
      </div>

      {/* Attribution Banner */}
      <div className="p-4 rounded-xl bg-darkBg-card/80 border border-gray-800 text-xs text-gray-300 flex items-center justify-between flex-wrap gap-2">
        <span className="font-semibold text-white">
          Founded by Elliot PXT sec26. Developed under the PhantomXTrace (PXT) identity.
        </span>
        <span className="text-[10px] font-mono text-emerald-400 uppercase">
          CODEBASE PROVENANCE RECORD
        </span>
      </div>

      {/* Section 1: Declaration of Origin */}
      <GlassCard className="p-8 border-emerald-500/40 shadow-2xl flex flex-col gap-4 text-xs leading-relaxed text-gray-300">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-emerald-400" />
          1. Declaration of Original Authorship
        </h2>
        <p>
          I, <strong>Elliot PXT sec26</strong> (Founder of PhantomXTrace (PXT), operating under the research collective <strong>PhantomXTrace (PXT)</strong>), declare that the foundational architecture, custom risk heuristic algorithms, defensive network filters, client-side cryptographic integrations, and user interfaces of XTRACY were originally conceived, architected, and implemented by me.
        </p>
        <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 text-[11px] leading-relaxed flex flex-col gap-2">
          <strong className="text-emerald-300 font-sans uppercase">Legal Distinction Notice:</strong>
          <p className="text-gray-400">
            Original authorship claims made by the founder reflect the founder&apos;s formal declaration and verifiable Git development chronology. They are distinct from independently verified legal ownership determinations or government-issued registration certificates. Statutory filings for trademark and copyright registration are in active preparation.
          </p>
        </div>
      </GlassCard>

      {/* Section 2: Codebase Division (Original vs Third-Party) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6 border-brand-cyan/30 flex flex-col gap-3">
          <h3 className="text-base font-bold text-brand-cyan flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> Original Authored Materials
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-300">
            <li><strong>XTRACY NEXUS Engine</strong>: Deterministic multi-vector classification.</li>
            <li><strong>Entity Graph &amp; Temporal Engines</strong>: Threat relationship and decay modeling.</li>
            <li><strong>SSRF Boundary Module</strong>: DNS pre-resolution private IP blocking.</li>
            <li><strong>WebCrypto Local Vault</strong>: In-browser AES-GCM 256-bit encryption.</li>
            <li><strong>EvidencePulse™ &amp; CaseSeal™</strong>: RFC 8785 canonical manifests and Merkle trees.</li>
            <li><strong>Brand Design System</strong>: Geometric X logo emblem and glassmorphic UI layout.</li>
          </ul>
        </GlassCard>

        <GlassCard className="p-6 border-indigo-500/30 flex flex-col gap-3">
          <h3 className="text-base font-bold text-indigo-400 flex items-center gap-2">
            <Lock className="w-5 h-5" /> Permissive Third-Party Libraries
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-300">
            <li><strong>Next.js (v14)</strong>: MIT License (Vercel, Inc.)</li>
            <li><strong>React (v18)</strong>: MIT License (Meta Platforms, Inc.)</li>
            <li><strong>TypeScript (v5)</strong>: Apache-2.0 License (Microsoft Corporation)</li>
            <li><strong>Tailwind CSS (v3)</strong>: MIT License (Tailwind Labs, Inc.)</li>
            <li><strong>Lucide React</strong>: ISC License (Lucide Contributors)</li>
            <li><strong>Zustand &amp; Framer Motion</strong>: MIT Licenses</li>
          </ul>
        </GlassCard>
      </div>

      {/* Section 3: Git Commit Provenance Audit Trail */}
      <GlassCard className="p-6 border-gray-800 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-gray-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2 text-sky-400">
            <GitBranch className="w-5 h-5" /> 3. Verified Version Control Audit Trail
          </h3>
          <span className="text-[10px] font-mono text-gray-400">
            Preserved Unmodified Git History
          </span>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          The public Git repository (<a href="https://github.com/PXTsec26-xc/xtracy" target="_blank" rel="noopener noreferrer" className="text-brand-cyan hover:underline font-mono">github.com/PXTsec26-xc/xtracy</a>) maintains an unbroken chronological record verifying continuous development:
        </p>

        <div className="flex flex-col gap-2 font-mono text-xs">
          {commitMilestones.map((c) => (
            <div key={c.hash} className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-brand-cyan font-bold">{c.hash}</span>
                <span className="text-gray-400 text-[11px]">{c.date}</span>
                <span className="text-gray-200 text-xs font-sans">{c.desc}</span>
              </div>
              <span className="text-[10px] text-gray-400 bg-gray-900 px-2 py-0.5 rounded border border-gray-800 shrink-0">
                Author: {c.author}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Official Project Information Card */}
      <OfficialProjectInfo />

      {/* Navigation Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Link
          href="/intellectual-property"
          className="p-3 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-800 text-center text-xs font-bold text-brand-cyan transition-all"
        >
          Intellectual Property →
        </Link>
        <Link
          href="/legal"
          className="p-3 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-800 text-center text-xs font-bold text-indigo-400 transition-all"
        >
          Legal Terms →
        </Link>
        <Link
          href="/founder"
          className="p-3 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-800 text-center text-xs font-bold text-sky-400 transition-all"
        >
          Founder Profile →
        </Link>
      </div>
    </div>
  );
}
