import React from 'react';
import { Metadata } from 'next';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { OfficialProjectInfo } from '@/components/common/OfficialProjectInfo';
import { Shield, Lock, Eye, Dna, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About XTRACY | Cybersecurity & Digital Safety Platform',
  description:
    'Learn about XTRACY, an independent cybersecurity and digital safety platform founded and created by Elliot (PXT sec26 Sahil).',
  alternates: {
    canonical: 'https://xtracy.vercel.app/about',
  },
};

export default function AboutPage() {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'XTRACY',
    description:
      'XTRACY is an independent cybersecurity and digital safety platform founded and created by Elliot (PXT sec26 Sahil), focused on defensive security, privacy, and evidence integrity.',
    url: 'https://xtracy.vercel.app',
    founder: {
      '@type': 'Person',
      name: 'Elliot',
      alternateName: ['PXT sec26', 'Sahil'],
      jobTitle: 'Founder & Creator of XTRACY',
      url: 'https://xtracy.vercel.app/founder',
    },
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
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
          <span className="text-xs text-gray-400 font-mono">Elliot (PXT sec26 Sahil)</span>
        </div>
        <p className="text-xs text-gray-400">
          Independent cybersecurity and digital safety platform dedicated to defensive tools, privacy, and cryptographic evidence integrity.
        </p>
      </div>

      {/* Hero Overview */}
      <GlassCard className="p-8 border-brand-cyan/40 shadow-2xl flex flex-col gap-4 text-xs leading-relaxed text-gray-300">
        <h2 className="text-xl font-black text-white">
          XTRACY — Privacy-First Digital Evidence Intelligence Platform
        </h2>

        <p className="text-sm font-semibold text-white">
          XTRACY is an independent cybersecurity and digital safety platform founded and created by Elliot, also known through the project&apos;s PXT sec26 identity as Sahil.
        </p>

        <p>
          XTRACY focuses on practical defensive security, privacy-aware analysis, evidence integrity, and tools designed to support safer digital investigations and security awareness.
        </p>

        <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1 text-xs">
          <strong className="text-brand-cyan uppercase font-bold text-[11px]">PLATFORM MISSION STATEMENT</strong>
          <p className="text-gray-200">
            &quot;Protect evidence. Preserve continuity. Verify independently. Keep control with the user.&quot;
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
            WebCrypto AES-GCM client-side encryption. Passwords and sensitive vault contents never leave your browser.
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
            XTRACY Independent Verifier™ allows third parties to mathematically verify package structure and ECDSA signatures.
          </p>
        </GlassCard>
      </div>

      {/* Official Project Info Card */}
      <OfficialProjectInfo />

      {/* Link to Founder Page */}
      <GlassCard className="p-6 border-brand-blue/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <User className="w-6 h-6 text-brand-cyan" />
          <div className="flex flex-col gap-0.5 text-xs">
            <strong className="text-white text-sm">Want to know more about the founder?</strong>
            <span className="text-gray-400">Read about Elliot (PXT sec26 Sahil), Founder & Creator of XTRACY.</span>
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
    </div>
  );
}
