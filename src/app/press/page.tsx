import React from 'react';
import { Metadata } from 'next';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { OfficialProjectInfo } from '@/components/common/OfficialProjectInfo';
import { XtracyLogo } from '@/components/common/XtracyLogo';
import {
  Newspaper,
  Shield,
  Download,
  Mail,
  User,
  CheckCircle2,
  ExternalLink,
  Terminal,
  Award,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Press Kit & Media Resources | XTRACY Platform',
  description:
    'Official media resources, press kit, founder biography, brand assets, and verified factsheet for XTRACY. Founded by Elliot PXT sec26 (Founder of PhantomXTrace).',
  alternates: {
    canonical: 'https://xtracy.vercel.app/press',
  },
  openGraph: {
    title: 'Press Kit & Media Resources | XTRACY',
    description:
      'Official media kit, founder biography, and brand specifications for XTRACY. Founded by Elliot PXT sec26.',
    url: 'https://xtracy.vercel.app/press',
    siteName: 'XTRACY',
  },
};

export default function PressPage() {
  const quickFacts = [
    { label: 'Official Product Name', value: 'XTRACY' },
    { label: 'Product Category', value: 'Defensive Cybersecurity & Digital Intelligence Platform' },
    { label: 'Founder & Creator', value: 'Elliot PXT sec26' },
    { label: 'Designation / Role', value: 'Founder of PhantomXTrace (PXT)' },
    { label: 'Research Initiative', value: 'PhantomXTrace (PXT)' },
    { label: 'Live Deployment', value: 'https://xtracy.vercel.app' },
    { label: 'Source Repository', value: 'https://github.com/PXTsec26-xc/xtracy' },
    { label: 'Flagship Tool Count', value: '18 Functional Defensive Tools' },
    { label: 'Security Unit Tests', value: '26 Strict Automated Tests (0 Failures)' },
    { label: 'Client Vault Engine', value: 'WebCrypto AES-GCM 256-bit + PBKDF2' },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Newspaper className="w-8 h-8 text-brand-cyan" />
              Press Kit &amp; Media Resources
            </h1>
            <Badge type="productStatus" value="MEDIA ASSETS" size="sm" />
          </div>
          <span className="text-xs text-sky-400 font-mono font-semibold">
            Founder of PhantomXTrace (PXT)
          </span>
        </div>
        <p className="text-xs text-gray-400">
          Official platform boilerplate, verified founder biography, brand assets, and factsheet for press and researchers.
        </p>
      </div>

      {/* Attribution Banner */}
      <div className="p-4 rounded-xl bg-darkBg-card/80 border border-gray-800 text-xs text-gray-300 flex items-center justify-between flex-wrap gap-2">
        <span className="font-semibold text-white">
          Founded by Elliot PXT sec26. Developed under the PhantomXTrace (PXT) identity.
        </span>
        <span className="text-[10px] font-mono text-brand-cyan uppercase">
          OFFICIAL MEDIA DOSSIER
        </span>
      </div>

      {/* Official Boilerplate */}
      <GlassCard className="p-8 border-brand-cyan/40 shadow-2xl flex flex-col gap-4 text-xs leading-relaxed text-gray-300">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-brand-cyan" />
          Official Product Boilerplate
        </h2>
        <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 text-xs text-gray-200 leading-relaxed font-sans">
          &quot;XTRACY is an independent defensive cybersecurity and digital safety intelligence platform conceived and authored by Elliot PXT sec26 under the PhantomXTrace (PXT) initiative. Built to eliminate speculative &apos;security theater&apos;, XTRACY provides deterministic URL analysis, live DNS intelligence, HTTP security header auditing, and tamper-evident evidence chaining via RFC 8785 canonical manifests and browser-native WebCrypto AES-GCM 256-bit encryption. The platform adheres to strict local-first privacy, guaranteeing that sensitive vault contents never leave user device memory in plaintext.&quot;
        </div>
      </GlassCard>

      {/* Verified Factsheet */}
      <GlassCard className="p-6 border-gray-800 flex flex-col gap-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 text-emerald-400">
          <Award className="w-5 h-5" /> Verified Platform Factsheet
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          {quickFacts.map((f, i) => (
            <div key={i} className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-0.5">
              <span className="text-[10px] text-gray-400 uppercase">{f.label}</span>
              <strong className="text-white text-xs">{f.value}</strong>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Brand Assets & Logo Specifications */}
      <GlassCard className="p-6 border-gray-800 flex flex-col gap-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 text-sky-400">
          <Shield className="w-5 h-5" /> Brand Identity &amp; Logo Assets
        </h3>
        <p className="text-xs text-gray-300 leading-relaxed">
          The XTRACY brand lockup consists of the stylized geometric &apos;X&apos; vector emblem and the bold high-legibility wordmark:
        </p>
        <div className="p-6 rounded-2xl bg-darkBg-panel border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <XtracyLogo size="lg" showSubtitle={true} />
          <div className="text-xs font-mono text-gray-400 flex flex-col gap-1 text-right">
            <div><span className="text-gray-500">Primary Palette:</span> Midnight Navy (#09101d)</div>
            <div><span className="text-gray-500">Accent Colors:</span> Cyan (#38bdf8) / Sky (#0284c7)</div>
            <div><span className="text-gray-500">Design Language:</span> Executive Glassmorphic Interface</div>
          </div>
        </div>
      </GlassCard>

      {/* Press & Research Contact */}
      <GlassCard className="p-6 border-brand-blue/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Mail className="w-7 h-7 text-brand-cyan shrink-0" />
          <div className="flex flex-col gap-0.5 text-xs">
            <strong className="text-white text-sm">Press &amp; Security Inquiries</strong>
            <span className="text-gray-400">
              For technical inquiries, interview requests, or academic research collaborations.
            </span>
          </div>
        </div>
        <a
          href="https://github.com/PXTsec26-xc/xtracy/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-electric text-white font-extrabold text-xs shadow-glowBlue transition-all flex items-center gap-1.5 shrink-0"
        >
          <span>Open Inquiry</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </GlassCard>

      {/* Official Project Information Card */}
      <OfficialProjectInfo />
    </div>
  );
}
