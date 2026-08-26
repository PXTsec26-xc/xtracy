'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Lock, FileText, Cpu, AlertOctagon, HelpCircle, Server, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function TrustCenterPage() {
  const [activeTab, setActiveTab] = useState<'privacy' | 'security' | 'architecture' | 'ai' | 'retention'>('privacy');

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
              XTRACY Trust Center
            </h1>
            <Badge type="productStatus" value="TRANSPARENCY HUB" size="sm" />
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/security"
              className="px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 text-brand-cyan text-xs font-bold transition-all"
            >
              Security Disclosure &rarr;
            </Link>
            <a
              href="/.well-known/security.txt"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 text-xs font-bold transition-all"
            >
              security.txt
            </a>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Our commitments to privacy by default, transparent data retention, AI ethics, acceptable use, and platform architecture.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-800 text-xs font-bold">
        {[
          { key: 'privacy', label: 'Privacy Policy', icon: Lock },
          { key: 'security', label: 'Security Architecture', icon: Server },
          { key: 'architecture', label: 'Evidence Methodology', icon: FileText },
          { key: 'ai', label: 'AI Transparency', icon: Cpu },
          { key: 'retention', label: 'Data Retention & Controls', icon: HelpCircle },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === key
                ? 'bg-brand-blue/20 text-brand-cyan border-brand-cyan/40 font-black shadow-glowBlue'
                : 'bg-darkBg-panel/60 text-gray-400 hover:text-white border-gray-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Content Panels */}
      <GlassCard className="p-8 border-gray-800 flex flex-col gap-4 text-xs leading-relaxed text-gray-300">
        {activeTab === 'privacy' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-white">Privacy Policy & Data Principles</h2>
            <p>
              XTRACY is designed with <strong>Privacy by Default</strong>. We collect only the minimum necessary information required to operate digital safety features and analyze security indicators.
            </p>
            <h3 className="text-sm font-bold text-brand-cyan">1. Zero Sensitive Credential Collection</h3>
            <p>
              We do not track physical GPS locations, scrape mobile contact books, or monitor background activity. Passwords submitted to Password Health Lab are analyzed 100% locally in browser memory and are <strong>never transmitted to XTRACY servers</strong>.
            </p>
            <h3 className="text-sm font-bold text-brand-cyan">2. WebCrypto Safe Vault Encryption</h3>
            <p>
              Vault notes are encrypted client-side using AES-GCM 256-bit with PBKDF2 key derivation (100,000 iterations). Only ciphertext, IV, and salt values are stored server-side. XTRACY staff cannot decrypt vault contents.
            </p>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-white">Security Architecture</h2>
            <p>
              XTRACY enforces strict Server-Side Request Forgery (SSRF) protections, rate limiting, parameterized queries, and output encoding across all tools and API route handlers.
            </p>
            <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-2 font-mono text-[11px]">
              <strong className="text-emerald-400 font-sans uppercase font-bold text-[10px]">Implemented Security Controls:</strong>
              <div>✓ SSRF Filter: Blocks 127.0.0.1, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.169.254, ::1</div>
              <div>✓ Password Hashing: SHA-256 PBKDF2 key derivation</div>
              <div>✓ Data Isolation: Tenant isolation (`isolatedTenantId`) in Organization Mode</div>
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-white">Evidence-Based Methodology Standard</h2>
            <p>
              Every security finding generated by XTRACY tools strictly includes: Finding Title, Severity, Observed Evidence, Why It Matters, Defensive Recommendation, Confidence Level, and Analysis Limitations.
            </p>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-white">AI Transparency</h2>
            <p>
              XTRACY AI Security Copilot strictly separates answers into <code>[OBSERVED DATA]</code>, <code>[AI INTERPRETATION]</code>, and <code>[RECOMMENDED ACTION]</code> to prevent hallucination of scan evidence.
            </p>
          </div>
        )}

        {activeTab === 'retention' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-white">Data Retention & User Control</h2>
            <p>
              Authenticated users maintain 100% control over their account data and can export JSON data packages or execute complete account data deletion anytime via the <Link href="/privacy-control" className="text-brand-cyan underline">Privacy Control Center</Link>.
            </p>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
