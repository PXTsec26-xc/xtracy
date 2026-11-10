'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { XtracyLogo } from '@/components/common/XtracyLogo';
import { Shield, Lock, CheckCircle2, Info, Scale, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-[rgba(56,189,248,0.15)] bg-[rgba(9,16,29,0.85)] backdrop-blur-2xl pt-12 pb-8 text-gray-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Brand, Founder & Mission */}
        <div className="flex flex-col gap-3 md:col-span-1">
          <XtracyLogo size="md" showSubtitle={true} />
          <p className="text-gray-300 text-xs font-semibold uppercase tracking-wider font-mono">
            ANALYZE. UNDERSTAND. RESPOND.
          </p>
          <div className="p-3 rounded-xl bg-darkBg-card/80 border border-gray-800 text-[11px] leading-relaxed text-gray-300">
            <span className="font-bold text-white block mb-0.5">Official Founder Attribution</span>
            Founded by <strong>Elliot PXT sec26</strong>. Developed under the <strong>PhantomXTrace (PXT)</strong> identity.
          </div>
          <p className="text-gray-400 text-[11px] leading-relaxed">
            Executive defensive cybersecurity platform providing real URL analysis, DNS intelligence, HTTP security header audits, and digital footprint inspection.
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge type="productStatus" value="18 REAL TOOLS" size="sm" />
            <Badge type="productStatus" value="SSRF PROTECTED" size="sm" />
          </div>
        </div>

        {/* Col 2: Flagship Tools */}
        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-sky-400 mb-1 font-mono">
            Flagship Tools
          </h4>
          <Link href="/tools/url-guard" className="hover:text-white transition-colors">
            XTRACY URL Guard
          </Link>
          <Link href="/tools/dns-intel" className="hover:text-white transition-colors">
            Domain &amp; DNS Intelligence
          </Link>
          <Link href="/tools/header-analyzer" className="hover:text-white transition-colors">
            Security Headers Audit
          </Link>
          <Link href="/tools/footprint-checker" className="hover:text-white transition-colors">
            Digital Footprint Checker
          </Link>
          <Link href="/scam-check" className="hover:text-white transition-colors">
            Real Scam Check Engine
          </Link>
          <Link href="/evidencepulse" className="hover:text-white transition-colors">
            EvidencePulse™ SHA-256
          </Link>
          <Link href="/tools" className="text-sky-400 hover:underline font-semibold pt-1">
            View All 18 Security Tools →
          </Link>
        </div>

        {/* Col 3: Intelligence & Governance */}
        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-sky-400 mb-1 font-mono">
            Defensive Intelligence
          </h4>
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Security Command Center
          </Link>
          <Link href="/intelligence" className="hover:text-white transition-colors">
            CISA KEV ThreatWatch Feed
          </Link>
          <Link href="/assistant" className="hover:text-white transition-colors">
            XTRACY AI Assistant
          </Link>
          <Link href="/global-safety" className="hover:text-white transition-colors">
            Global Cyber Emergency Portals
          </Link>
          <Link href="/governance" className="hover:text-white transition-colors">
            Security Governance &amp; Pilot Readiness
          </Link>
          <Link href="/transparency" className="hover:text-white transition-colors">
            Transparency Center
          </Link>
          <Link href="/test-lab" className="hover:text-white transition-colors">
            Security Test Lab (26 Tests)
          </Link>
        </div>

        {/* Col 4: Legal & Intellectual Property */}
        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-sky-400 mb-1 font-mono">
            Founder &amp; Legal
          </h4>
          <Link href="/founder" className="hover:text-white transition-colors font-semibold text-gray-200">
            Founder Profile — Elliot PXT sec26
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            About XTRACY &amp; PhantomXTrace
          </Link>
          <Link href="/intellectual-property" className="hover:text-white transition-colors">
            Intellectual Property &amp; Trademarks
          </Link>
          <Link href="/ownership" className="hover:text-white transition-colors">
            Declaration of Ownership
          </Link>
          <Link href="/legal" className="hover:text-white transition-colors">
            Legal Terms &amp; Defensive Policy
          </Link>
          <Link href="/press" className="hover:text-white transition-colors">
            Press Kit &amp; Media Assets
          </Link>
          <a
            href="https://github.com/PXTsec26-xc/xtracy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-400 hover:text-white pt-1"
          >
            <span>GitHub Repository</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Safety & IP Notice Bar */}
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-gray-800/80 flex flex-col gap-3 text-[11px] text-gray-400">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p>
            Founded by <strong>Elliot PXT sec26</strong>. Developed under the <strong>PhantomXTrace (PXT)</strong> identity. Original project materials Copyright © 2026. All rights reserved, subject to applicable third-party open-source licences.
          </p>
          <div className="flex items-center gap-4 text-[11px] shrink-0">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Real Engines
            </span>
            <span className="flex items-center gap-1 text-indigo-400">
              <Lock className="w-3.5 h-3.5" /> AES-GCM Encrypted Vault
            </span>
          </div>
        </div>
        <p className="text-[10px] text-gray-500 leading-normal">
          XTRACY is dedicated exclusively to authorized defensive cybersecurity, security awareness, and verifiable threat analysis. Automated heuristics provide decision support and do not guarantee complete protection or substitute for certified forensic investigations.
        </p>
      </div>
    </footer>
  );
};
