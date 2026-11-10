import React from 'react';
import { Metadata } from 'next';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { OfficialProjectInfo } from '@/components/common/OfficialProjectInfo';
import { Shield, Lock, Eye, Dna, User, ArrowRight, Sparkles, Scale, FileText } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About XTRACY | Independent Cybersecurity Intelligence Platform',
  description:
    'Learn about XTRACY, an independent cybersecurity and digital safety platform founded and created by Elliot PXT sec26 (Founder of PhantomXTrace) under the PhantomXTrace (PXT) identity.',
  alternates: {
    canonical: 'https://xtracy.vercel.app/about',
  },
  openGraph: {
    title: 'About XTRACY — Independent Cybersecurity Intelligence Platform',
    description:
      'Founded by Elliot PXT sec26. Developed under the PhantomXTrace (PXT) identity. Practical defensive security, zero-knowledge encryption, and evidence integrity.',
    url: 'https://xtracy.vercel.app/about',
    siteName: 'XTRACY',
  },
};

export default function AboutPage() {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'XTRACY',
    alternateName: 'PhantomXTrace',
    description:
      'XTRACY is an independent cybersecurity and digital safety intelligence platform founded and created by Elliot PXT sec26 (Founder of PhantomXTrace), focused on defensive security, privacy, and evidence integrity.',
    url: 'https://xtracy.vercel.app',
    founder: {
      '@type': 'Person',
      name: 'Elliot PXT sec26',
      alternateName: 'Founder of PhantomXTrace (PXT)',
      jobTitle: 'Founder of PhantomXTrace (PXT) & Creator of XTRACY',
      url: 'https://xtracy.vercel.app/founder',
    },
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Schema.org Organization JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Shield className="w-8 h-8 text-brand-cyan" />
              About XTRACY
            </h1>
            <Badge type="productStatus" value="ABOUT PLATFORM" size="sm" />
          </div>
          <span className="text-xs text-sky-400 font-mono font-semibold">
            Founder of PhantomXTrace (PXT)
          </span>
        </div>
        <p className="text-xs text-gray-400">
          Independent defensive cybersecurity intelligence platform dedicated to observable signals, privacy preservation, and cryptographic evidence integrity.
        </p>
      </div>

      {/* Hero Overview */}
      <GlassCard className="p-8 border-brand-cyan/40 shadow-2xl flex flex-col gap-4 text-xs leading-relaxed text-gray-300">
        <h2 className="text-xl font-black text-white">
          XTRACY — Independent Cybersecurity Intelligence Platform
        </h2>

        <p className="text-sm font-semibold text-white">
          Founded by Elliot PXT sec26. Developed under the PhantomXTrace (PXT) identity.
        </p>

        <p>
          XTRACY focuses on practical defensive security, privacy-aware threat analysis, evidence integrity, and tools designed to support safer digital investigations without black-box scoring, fake progress bars, or surveillance telemetry.
        </p>

        <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1 text-xs">
          <strong className="text-brand-cyan uppercase font-bold text-[11px]">PLATFORM MISSION MANDATE</strong>
          <p className="text-gray-200">
            &quot;Protect evidence. Preserve continuity. Verify independently. Keep sensitive control exclusively with the user.&quot;
          </p>
        </div>
      </GlassCard>

      {/* Core Principles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 border-gray-800 flex flex-col gap-3">
          <div className="p-3 rounded-xl bg-darkBg-panel text-brand-cyan border border-gray-800 w-fit">
            <Lock className="w-5 h-5" />
          </div>
          <strong className="text-base font-bold text-white">100% Privacy-First</strong>
          <p className="text-xs text-gray-400 leading-relaxed">
            WebCrypto AES-GCM client-side encryption. User passphrases and sensitive vault contents never leave browser memory in plaintext.
          </p>
        </GlassCard>

        <GlassCard className="p-6 border-gray-800 flex flex-col gap-3">
          <div className="p-3 rounded-xl bg-darkBg-panel text-emerald-400 border border-gray-800 w-fit">
            <Dna className="w-5 h-5" />
          </div>
          <strong className="text-base font-bold text-white">Evidence Integrity</strong>
          <p className="text-xs text-gray-400 leading-relaxed">
            SHA-256 hash chaining, RFC 8785 canonical manifests, and CaseSeal Merkle tree roots for tamper-evident tracking.
          </p>
        </GlassCard>

        <GlassCard className="p-6 border-gray-800 flex flex-col gap-3">
          <div className="p-3 rounded-xl bg-darkBg-panel text-purple-400 border border-gray-800 w-fit">
            <Eye className="w-5 h-5" />
          </div>
          <strong className="text-base font-bold text-white">Independent Verification</strong>
          <p className="text-xs text-gray-400 leading-relaxed">
            XTRACY Independent Verifier™ allows third parties to mathematically verify package structure and ECDSA signatures without passwords.
          </p>
        </GlassCard>
      </div>

      {/* Official Project Info Card */}
      <OfficialProjectInfo />

      {/* Meet the Founder Callout */}
      <GlassCard className="p-6 border-brand-blue/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <User className="w-8 h-8 text-brand-cyan shrink-0" />
          <div className="flex flex-col gap-0.5 text-xs">
            <strong className="text-white text-sm">Founder &amp; Creator — Elliot PXT sec26</strong>
            <span className="text-gray-400">
              Read the full biography, project chronology, founder statement, and architectural vision.
            </span>
          </div>
        </div>

        <Link
          href="/founder"
          className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-electric text-white font-extrabold text-xs shadow-glowBlue transition-all flex items-center gap-1.5 shrink-0"
        >
          <span>Meet The Founder</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </GlassCard>

      {/* Exploration Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/governance"
          className="p-3 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-800 text-center text-xs font-bold text-sky-400 transition-all"
        >
          Governance →
        </Link>
        <Link
          href="/transparency"
          className="p-3 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-800 text-center text-xs font-bold text-emerald-400 transition-all"
        >
          Transparency Center →
        </Link>
        <Link
          href="/legal"
          className="p-3 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-800 text-center text-xs font-bold text-brand-cyan transition-all"
        >
          Legal Terms →
        </Link>
        <Link
          href="/intellectual-property"
          className="p-3 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-800 text-center text-xs font-bold text-indigo-400 transition-all"
        >
          Intellectual Property →
        </Link>
      </div>
    </div>
  );
}
