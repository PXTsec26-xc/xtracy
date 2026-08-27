'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { XtracyLogo } from '@/components/common/XtracyLogo';
import { Shield, Lock, CheckCircle2, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-[rgba(56,189,248,0.15)] bg-[rgba(9,16,29,0.75)] backdrop-blur-2xl pt-12 pb-8 text-gray-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Mission */}
        <div className="flex flex-col gap-3 md:col-span-1">
          <XtracyLogo size="md" showSubtitle={true} />
          <p className="text-gray-300 text-xs font-semibold uppercase tracking-wider font-mono">
            ANALYZE. UNDERSTAND. RESPOND.
          </p>
          <p className="text-gray-400 text-[11px] leading-relaxed">
            Executive defensive cybersecurity platform providing real URL analysis, DNS intelligence, HTTP security header audits, and digital footprint inspection.
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge type="productStatus" value="18 REAL TOOLS" size="sm" />
            <Badge type="productStatus" value="SSRF PROTECTED" size="sm" />
          </div>
        </div>

        {/* Flagship Tools */}
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
          <Link href="/tools" className="text-sky-400 hover:underline font-semibold">
            View All 18 Security Tools →
          </Link>
        </div>

        {/* Intelligence & Resources */}
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
        </div>

        {/* Safety Disclaimer */}
        <div className="flex flex-col gap-2 bg-darkBg-card/70 p-4 rounded-2xl border border-gray-800/80">
          <div className="flex items-center gap-1.5 font-bold text-gray-200">
            <Info className="w-4 h-4 text-sky-400" />
            <span>Defensive Safety Mandate</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-normal">
            XTRACY is strictly dedicated to authorized defensive cybersecurity, security awareness, and public threat intelligence. Offensive exploits, credential harvesting, and unauthorized intrusion utilities are strictly forbidden.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-gray-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-gray-400">
        <p>© {new Date().getFullYear()} XTRACY Cybersecurity Intelligence Platform. Built for defense and public safety.</p>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Real Engines
          </span>
          <span className="flex items-center gap-1 text-indigo-400">
            <Lock className="w-3.5 h-3.5" /> AES-GCM Encrypted Vault
          </span>
        </div>
      </div>
    </footer>
  );
};
