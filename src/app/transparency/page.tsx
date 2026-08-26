import React from 'react';
import { Metadata } from 'next';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { OfficialProjectInfo } from '@/components/common/OfficialProjectInfo';
import { ShieldCheck, Code, Lock, Eye, Terminal, ExternalLink, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Transparency Center | XTRACY Security & Privacy Architecture',
  description:
    'Detailed technical disclosures on XTRACY analysis methodology, local WebCrypto encryption, SSRF protection rules, data handling, and known limitations.',
  alternates: {
    canonical: 'https://xtracy.vercel.app/transparency',
  },
};

export default function TransparencyPage() {
  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Eye className="w-8 h-8 text-emerald-400" />
              XTRACY Transparency Center
            </h1>
            <Badge type="productStatus" value="TECHNICAL DISCLOSURES" size="sm" />
          </div>
          <span className="text-xs text-gray-400 font-mono">Elliot (PXT sec26 Sahil)</span>
        </div>
        <p className="text-xs text-gray-400">
          Independent security disclosures, analysis methodology, data processing rules, and platform limitations.
        </p>
      </div>

      {/* Hero Card */}
      <GlassCard className="p-8 border-emerald-500/40 shadow-2xl flex flex-col gap-4 text-xs leading-relaxed text-gray-300">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          Technical Transparency & Verification Standard
        </h2>

        <p>
          XTRACY operates on strict defensive engineering standards. We disclose our analysis algorithms, cryptographic primitives, boundary rules, and limitations so users can independently verify every capability.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <a
            href="https://github.com/PXTsec26-xc/xtracy"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 hover:border-emerald-400 transition-all flex items-center justify-between group"
          >
            <div className="flex flex-col gap-0.5">
              <strong className="text-white text-xs group-hover:text-emerald-400">Public Source Code Repository</strong>
              <span className="text-[10px] text-gray-400 font-mono">github.com/PXTsec26-xc/xtracy</span>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-emerald-400" />
          </a>

          <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-0.5 font-mono">
            <span className="text-[10px] text-gray-400 uppercase">Deployed Platform Version:</span>
            <strong className="text-emerald-400 text-xs">XTRACY NEXUS 2.1 (Production)</strong>
          </div>
        </div>
      </GlassCard>

      {/* Capability Scope: What XTRACY Can & Cannot Verify */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6 border-emerald-500/30 flex flex-col gap-3">
          <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> What XTRACY Can Analyze & Detect
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-xs text-gray-300 leading-relaxed">
            <li><strong>Brand Impersonation Lures</strong>: Subdomains and hyphenated domains mimicking major financial, tech, or retail brands.</li>
            <li><strong>Credential & Urgency Pressure Keywords</strong>: Phishing patterns in SMS, WhatsApp, email, or URL strings.</li>
            <li><strong>Structural URL Anomalies</strong>: Punycode homoglyphs, IP hostnames, excessive subdomains, and URL shorteners.</li>
            <li><strong>Client-Side Cryptography</strong>: Browser-native AES-GCM 256-bit vault encryption and SHA-256 hash chaining.</li>
            <li><strong>SSRF Boundaries</strong>: Automatic loopback, RFC1918 private network, and cloud metadata blocking.</li>
          </ul>
        </GlassCard>

        <GlassCard className="p-6 border-amber-500/30 flex flex-col gap-3">
          <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Platform Limitations & Scope
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-xs text-gray-300 leading-relaxed">
            <li><strong>No Guaranteed Safety</strong>: Automated heuristics provide decision support; clean scores do not guarantee complete safety.</li>
            <li><strong>No Direct Law Enforcement Action</strong>: XTRACY does not automatically file complaints with police or government agencies.</li>
            <li><strong>No Court Certification</strong>: SHA-256 checksums provide data integrity tracking, not certified legal evidence.</li>
            <li><strong>No Central Data Storage</strong>: Vault contents and private scam queries remain under local browser control.</li>
          </ul>
        </GlassCard>
      </div>

      {/* Official Project Information Card */}
      <OfficialProjectInfo />
    </div>
  );
}
