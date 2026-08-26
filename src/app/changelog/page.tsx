'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Sparkles, Shield, CheckCircle2 } from 'lucide-react';

export default function ChangelogPage() {
  const releases = [
    {
      version: 'XTRACY NEXUS 2.0',
      date: 'August 2026',
      title: 'Global Cyber Safety & Intelligence Platform Upgrade',
      highlights: [
        'XTRACY Global Safety Center: Removed India-only hardcoding; added international country/region selector and verified official emergency resources.',
        'XTRACY NEXUS: Unified cybersecurity analysis workspace allowing users to initiate and investigate CASE records.',
        'Modular Intelligence Engine: Standardized 6-part explainability (Facts, Heuristics, External Intel, AI Interpretation, Unknowns, Limitations).',
        'Top 10 Cyber Tools Hub: X-Scan Intelligence, PhishLens, Link DNA, X-File Inspector, Account Exposure Check, Privacy Exposure Score, Web Security Header Analyzer, Password Health Lab, Incident Response Pathfinder, Digital Safety Simulator.',
        'XTRACY AI Security Copilot 2.0: Context-aware AI modes with strict ethical safety guardrails.',
        'Meet The Founder: Introduced founder Elliot, mission vision, and journey timeline.',
        'XTRACY Trust Center: /trust & /security covering Privacy Policy, Terms, Acceptable Use, AI Transparency, and Vulnerability Disclosure.',
        'Organization Mode: /organization with tenant data isolation and role-based permissions.',
      ],
    },
    {
      version: 'XTRACY 1.0.0',
      date: 'August 2026',
      title: 'Core Platform & Emergency Infrastructure Baseline',
      highlights: [
        'Initial Next.js 14 App Router deployment, dark glass design system, WebCrypto AES-GCM 256-bit client vault, CISA KEV JSON live dataset integration, and PWA offline service worker.',
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-brand-cyan" />
            XTRACY Platform Changelog
          </h1>
          <Badge type="productStatus" value="RELEASE NOTES" size="sm" />
        </div>
        <p className="text-xs text-gray-400">
          Chronological milestone log of major XTRACY platform upgrades and feature releases.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {releases.map((rel) => (
          <GlassCard key={rel.version} className="p-6 border-brand-blue/30 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-brand-blue text-white font-black text-xs">
                  {rel.version}
                </span>
                <h3 className="text-base font-bold text-white">{rel.title}</h3>
              </div>
              <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {rel.date}
              </span>
            </div>

            <ul className="flex flex-col gap-2 text-xs text-gray-300">
              {rel.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
