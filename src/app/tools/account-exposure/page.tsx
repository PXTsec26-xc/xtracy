'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { KeyRound, ShieldAlert, Info, AlertTriangle } from 'lucide-react';

export default function AccountExposureToolPage() {
  const [email, setEmail] = useState('');
  const [checked, setChecked] = useState(false);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setChecked(true);
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <KeyRound className="w-8 h-8 text-amber-400" />
            Account Exposure Check
          </h1>
          <Badge type="productStatus" value="BREACH INTELLIGENCE ARCHITECTURE" size="sm" />
        </div>
        <p className="text-xs text-gray-400">
          Check email breach exposure through legitimate external breach intelligence API integrations.
        </p>
      </div>

      {/* Input Form */}
      <GlassCard className="p-6 border-amber-500/30 flex flex-col gap-4">
        <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-3 text-xs">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address (e.g. user@domain.com)"
            className="flex-1 p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs focus:border-amber-400"
            required
          />
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>Check Exposure</span>
          </button>
        </form>
      </GlassCard>

      {/* Honest Unconfigured State Banner (No Fake Results) */}
      {checked && (
        <GlassCard className="p-6 border-amber-500/40 flex flex-col gap-4 text-xs">
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800 text-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <strong className="text-amber-300 font-bold uppercase text-[11px]">
                INTELLIGENCE PROVIDER CONFIGURATION REQUIRED
              </strong>
              <p className="leading-relaxed">
                This breach intelligence source (HaveIBeenPwned / HIBP API key) is currently not configured on this server instance. XTRACY does not fabricate breach search results when external integrations are inactive.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 text-gray-300">
            <strong className="text-white font-bold">General Account Security Best Practices:</strong>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ensure 2FA (Two-Factor Authentication) is enabled on <code className="text-amber-300">{email}</code>.</li>
              <li>Use unique passphrases for primary banking and email accounts.</li>
              <li>Audit third-party app permissions periodically.</li>
            </ul>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
