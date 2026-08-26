'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { FeatureStatusBadge } from '@/components/ui/FeatureStatusBadge';
import { ShieldCheck, Lock, AlertTriangle, CheckCircle2, FileText, Code, Terminal, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TransparencyCenterPage() {
  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-brand-cyan" />
              Security & Technical Transparency Center
            </h1>
            <Badge type="productStatus" value="TECHNICAL HONESTY" size="sm" />
          </div>
          <FeatureStatusBadge status="LOCAL" label="● VERIFIABLE ARCHITECTURE" />
        </div>
        <p className="text-xs text-gray-400">
          Transparent threat model, cryptographic architecture, security boundaries, and technical verification instructions.
        </p>
      </div>

      {/* Threat Model Section */}
      <GlassCard className="p-8 border-brand-cyan/40 flex flex-col gap-6 text-xs leading-relaxed text-gray-300">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-brand-cyan">
          XTRACY Threat Model & Security Boundaries
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* What XTRACY Protects Against */}
          <div className="p-5 rounded-2xl bg-darkBg-panel border border-gray-800 flex flex-col gap-3">
            <strong className="text-emerald-400 text-sm font-bold uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> What XTRACY Protects Against
            </strong>
            <ul className="list-disc pl-4 space-y-1.5 text-gray-300">
              <li><strong>Unnoticed Evidence Alteration:</strong> SHA-256 fingerprints detect modified file copies instantly.</li>
              <li><strong>Timeline & Sequence Reordering:</strong> Sequential hash-chaining flags broken record continuity.</li>
              <li><strong>Server-Side Data Breaches:</strong> WebCrypto AES-GCM 256-bit vault notes remain encrypted locally before storage.</li>
              <li><strong>Server-Side Request Forgery (SSRF):</strong> URL fetchers block internal IP ranges (`127.0.0.1`, `169.254.169.254`).</li>
            </ul>
          </div>

          {/* What XTRACY Does NOT Protect Against */}
          <div className="p-5 rounded-2xl bg-darkBg-panel border border-gray-800 flex flex-col gap-3">
            <strong className="text-amber-400 text-sm font-bold uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> What XTRACY Does NOT Protect Against
            </strong>
            <ul className="list-disc pl-4 space-y-1.5 text-gray-300">
              <li><strong>Compromised Host Device:</strong> Malware or keyloggers running directly on the user&apos;s computer.</li>
              <li><strong>Fabricated Initial Inputs:</strong> If a user inputs false information initially, cryptographic hashing only verifies integrity of that input over time.</li>
              <li><strong>Legal Chain-of-Custody Guarantees:</strong> XTRACY provides technical tamper-evidence, not formal law-enforcement acquisition.</li>
            </ul>
          </div>
        </div>
      </GlassCard>

      {/* "Verify Our Claims" Section */}
      <GlassCard className="p-8 border-gray-800 flex flex-col gap-4 text-xs">
        <h3 className="text-base font-bold text-white uppercase tracking-wider text-brand-cyan flex items-center gap-2">
          <Code className="w-5 h-5" /> Verify Our Technical Claims
        </h3>
        <p className="text-gray-300 leading-relaxed">
          Security claims should be independently verifiable. You can audit XTRACY client-side cryptography and SSRF protections directly in your browser:
        </p>

        <div className="flex flex-col gap-2 font-mono text-[11px] text-gray-300">
          <div className="p-3 rounded-xl bg-darkBg-panel border border-gray-800">
            1. Open Browser DevTools (F12) -&gt; Network Tab.
          </div>
          <div className="p-3 rounded-xl bg-darkBg-panel border border-gray-800">
            2. Unlock the Safe Vault or generate a Password Health Lab passphrase. Observe that master passwords and generated passphrases are NEVER sent over HTTP.
          </div>
          <div className="p-3 rounded-xl bg-darkBg-panel border border-gray-800">
            3. Test X-Scan Intelligence against loopback target `http://127.0.0.1`. Observe immediate SSRF security block response.
          </div>
        </div>
      </GlassCard>

      {/* Links to Security & Trust Center */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <Link
          href="/security"
          className="px-6 py-3 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-700 text-brand-cyan font-bold text-xs flex items-center gap-1.5 transition-all"
        >
          <FileText className="w-4 h-4" />
          <span>Responsible Vulnerability Disclosure Policy</span>
        </Link>

        <Link
          href="/trust"
          className="px-6 py-3 rounded-xl bg-brand-blue hover:bg-brand-electric text-white font-extrabold text-xs shadow-glowBlue transition-all flex items-center gap-1.5"
        >
          <span>Visit XTRACY Trust Center</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
