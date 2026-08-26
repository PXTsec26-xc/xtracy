import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, CheckCircle2, Lock, EyeOff } from 'lucide-react';

export const metadata = {
  title: 'Privacy-First Transparency Policy | XTRACY',
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-4xl mx-auto">
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            Privacy-First Transparency Policy
          </h1>
          <Badge type="productStatus" value="100% TRANSPARENT" size="sm" />
        </div>
        <p className="text-xs text-gray-400">
          How XTRACY protects your privacy, executes client-side logic, and enforces absolute data minimization.
        </p>
      </div>

      <GlassCard className="p-8 border-emerald-500/30 flex flex-col gap-6 text-xs leading-relaxed text-gray-200">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            1. Zero Unnecessary Data Collection
          </h3>
          <p className="text-gray-300">
            XTRACY does not track user identities, require user account registration for basic use, or collect personal identifiers. Your digital safety profile, selected operating systems, email providers, and social media platforms are stored purely in your browser&apos;s local Web Storage.
          </p>
        </div>

        <div className="flex flex-col gap-2 border-t border-gray-800 pt-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-brand-cyan" />
            2. Web Crypto API Encryption for Safe Vault
          </h3>
          <p className="text-gray-300">
            The XTRACY Safe Vault utilizes native browser Web Crypto API executing AES-GCM (256-bit) encryption with PBKDF2 key derivation from your master passphrase. Encryption and decryption occur locally inside your browser memory. Plaintext notes are never transmitted across the network.
          </p>
        </div>

        <div className="flex flex-col gap-2 border-t border-gray-800 pt-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-purple-400" />
            3. Client-Side Scam Check Processing
          </h3>
          <p className="text-gray-300">
            All text, URLs, and email content submitted into the XTRACY Quick Scan Center are evaluated locally using heuristic pattern matching rules. Nothing you paste is uploaded to remote servers or logged into external databases.
          </p>
        </div>

        <div className="flex flex-col gap-2 border-t border-gray-800 pt-4 bg-darkBg-panel/50 p-4 rounded-xl border border-gray-800">
          <h4 className="font-bold text-white uppercase text-xs text-brand-cyan">Honest Product Labeling Standard</h4>
          <p className="text-gray-400">
            We clearly label every module on XTRACY with badges indicating whether a feature is <strong>WORKING</strong> (fully functional client-side), <strong>DEMO DATA</strong> (simulated or pre-populated dataset), or <strong>LOCAL ENCRYPTED</strong>.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
