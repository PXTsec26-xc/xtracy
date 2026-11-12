import React from 'react';
import { Metadata } from 'next';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { OfficialProjectInfo } from '@/components/common/OfficialProjectInfo';
import {
  FileText,
  Shield,
  Lock,
  Scale,
  Award,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  Code,
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Intellectual Property & Brand Protection | XTRACY',
  description:
    'Comprehensive intellectual property disclosures, trademark status, copyright framework, and third-party license compliance for XTRACY. Founded by Elliot PXT sec26 (Founder of PhantomXTrace).',
  alternates: {
    canonical: 'https://xtracy.vercel.app/intellectual-property',
  },
  openGraph: {
    title: 'Intellectual Property & Brand Protection | XTRACY',
    description:
      'Intellectual property disclosures, copyright authorship, and trademark baseline for XTRACY. Founded by Elliot PXT sec26.',
    url: 'https://xtracy.vercel.app/intellectual-property',
    siteName: 'XTRACY',
  },
};

export default function IntellectualPropertyPage() {
  const trademarks = [
    { mark: 'XTRACY™', scope: 'Primary platform word mark for defensive cybersecurity intelligence software.' },
    { mark: 'XTRACY NEXUS™', scope: 'Central indicator classification and multi-vector risk engine.' },
    { mark: 'EvidencePulse™', scope: 'Cryptographic hash chaining and RFC 8785 manifest pipeline.' },
    { mark: 'CaseSeal™', scope: 'Digital signature and Merkle tree root verification packaging.' },
    { mark: 'PhantomXTrace™ / PXT™', scope: 'Sole founder brand and development identity (Elliot | PhantomXTrace (PXT)).' },
  ];

  const thirdPartyDeps = [
    { name: 'Next.js', version: '14.2.5', license: 'MIT', owner: 'Vercel, Inc.' },
    { name: 'React & React-DOM', version: '18.3.1', license: 'MIT', owner: 'Meta Platforms, Inc.' },
    { name: 'TypeScript', version: '5.5.4', license: 'Apache-2.0', owner: 'Microsoft Corporation' },
    { name: 'Tailwind CSS', version: '3.4.10', license: 'MIT', owner: 'Tailwind Labs, Inc.' },
    { name: 'Lucide React', version: '0.428.0', license: 'ISC', owner: 'Lucide Contributors' },
    { name: 'Zustand', version: '4.5.5', license: 'MIT', owner: 'Paul Henschel' },
    { name: 'Framer Motion', version: '11.3.28', license: 'MIT', owner: 'Framer B.V.' },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Scale className="w-8 h-8 text-brand-cyan" />
              Intellectual Property &amp; Brand Protection
            </h1>
            <Badge type="productStatus" value="IP FRAMEWORK" size="sm" />
          </div>
          <span className="text-xs text-sky-400 font-mono font-semibold">
            Founder of PhantomXTrace (PXT)
          </span>
        </div>
        <p className="text-xs text-gray-400">
          Formal intellectual property disclosures, trademark status, copyright authorship, and third-party open-source compliance.
        </p>
      </div>

      {/* Attribution Banner */}
      <div className="p-4 rounded-xl bg-darkBg-card/80 border border-gray-800 text-xs text-gray-300 flex items-center justify-between flex-wrap gap-2">
        <span className="font-semibold text-white">
          Founded by Elliot PXT sec26. Developed under the PhantomXTrace (PXT) identity.
        </span>
        <span className="text-[10px] font-mono text-brand-cyan uppercase">
          ORIGINAL AUTHORSHIP DECLARATION
        </span>
      </div>

      {/* Section 1: Authorship & Legal Clarification */}
      <GlassCard className="p-8 border-brand-cyan/40 shadow-2xl flex flex-col gap-4 text-xs leading-relaxed text-gray-300">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-brand-cyan" />
          1. Authorship Declaration &amp; Legal Scope
        </h2>
        <p>
          All original software source code, proprietary algorithms (including the XTRACY NEXUS classifier, Entity Graph engine, Temporal Intelligence model, Security Twin, SSRF boundary protection, and PhishLens scoring engine), user interface designs, and architectural dossiers were authored by <strong>Elliot PXT sec26</strong> under the <strong>PhantomXTrace (PXT)</strong> research identity.
        </p>
        <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 text-[11px] leading-relaxed flex flex-col gap-2">
          <strong className="text-sky-300 font-sans uppercase">Distinction Between Claims and Statutory Determinations:</strong>
          <p className="text-gray-400">
            Statements regarding original authorship represent the founder&apos;s declaration and verifiable development history documented in the repository. They are distinct from independently verified legal ownership determinations or government-issued registration certificates. Statutory registration preparation is actively underway.
          </p>
        </div>
      </GlassCard>

      {/* Section 2: Trademark Preparation & Common-Law Notice */}
      <GlassCard className="p-6 border-gray-800 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-gray-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2 text-sky-400">
            <Award className="w-5 h-5" /> 2. Proprietary Marks &amp; Common-Law Status
          </h3>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
            COMMON-LAW MARKS (PREPARATORY STAGE)
          </span>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          The following marks are established through first-in-time public deployment and continuous commercial use. No claim of statutory registration certificate issuance is made at this time:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          {trademarks.map((t, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1">
              <strong className="text-brand-cyan text-sm">{t.mark}</strong>
              <p className="text-gray-400 text-[11px] font-sans leading-relaxed">{t.scope}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Section 3: Third-Party Open Source Compliance */}
      <GlassCard className="p-6 border-gray-800 flex flex-col gap-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 text-emerald-400">
          <Code className="w-5 h-5" /> 3. Third-Party Open-Source License Register
        </h3>
        <p className="text-xs text-gray-300 leading-relaxed">
          XTRACY acknowledges and complies with the permissive open-source licenses of all runtime dependencies. The founder makes no claim of authorship or exclusive rights over third-party libraries:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-[10px] uppercase">
                <th className="py-2.5 px-3">Package</th>
                <th className="py-2.5 px-3">Version</th>
                <th className="py-2.5 px-3">SPDX License</th>
                <th className="py-2.5 px-3">Copyright Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {thirdPartyDeps.map((dep, idx) => (
                <tr key={idx} className="hover:bg-gray-800/20">
                  <td className="py-2 px-3 font-bold text-white">{dep.name}</td>
                  <td className="py-2 px-3 text-sky-400">{dep.version}</td>
                  <td className="py-2 px-3 text-emerald-400">{dep.license}</td>
                  <td className="py-2 px-3 text-gray-300 font-sans">{dep.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Official Project Information Card */}
      <OfficialProjectInfo />

      {/* Navigation Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Link
          href="/ownership"
          className="p-3 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-800 text-center text-xs font-bold text-emerald-400 transition-all"
        >
          Ownership Declaration →
        </Link>
        <Link
          href="/legal"
          className="p-3 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-800 text-center text-xs font-bold text-brand-cyan transition-all"
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
