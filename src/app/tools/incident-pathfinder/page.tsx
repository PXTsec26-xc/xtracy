'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Compass, AlertTriangle, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function IncidentPathfinderToolPage() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const scenarios = [
    {
      id: 'phishing-clicked',
      title: 'I clicked a suspicious phishing link',
      urgentSteps: [
        'Disconnect device from Wi-Fi immediately if malware download started.',
        'Do NOT type any passwords or OTPs on the target page.',
        'Clear browser cookies and session history.',
      ],
      laterSteps: ['Run a full antivirus scan.', 'Monitor primary email for unauthorized password reset requests.'],
    },
    {
      id: 'password-entered',
      title: 'I entered my password on a suspicious website',
      urgentSteps: [
        'Change password immediately on the official website directly.',
        'If you reuse this password on other services, change those passwords immediately.',
        'Revoke active login sessions from account security settings.',
      ],
      laterSteps: ['Enable 2FA via an authenticator app.', 'Check account activity logs.'],
    },
    {
      id: 'financial-fraud',
      title: 'I shared financial information or sent money to a scammer',
      urgentSteps: [
        'Call your bank or credit card hotline immediately to freeze cards/accounts.',
        'Report financial fraud to official national reporting portals (e.g. 1930 in India, IC3 in US).',
      ],
      laterSteps: ['File a formal incident report with local law enforcement.', 'Monitor bank statements.'],
    },
  ];

  const current = scenarios.find((s) => s.id === selectedScenario);

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Compass className="w-8 h-8 text-brand-cyan" />
            Incident Response Pathfinder
          </h1>
          <Badge type="productStatus" value="PLAYBOOK GENERATOR" size="sm" />
        </div>
        <p className="text-xs text-gray-400">
          Guided step-by-step emergency playbooks for phishing link clicks, password leaks, and account compromise.
        </p>
      </div>

      {/* Scenario Selection */}
      <div className="flex flex-col gap-3">
        <label className="font-bold text-gray-300 text-xs uppercase tracking-wider">
          Select Your Incident Scenario:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {scenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => setSelectedScenario(sc.id)}
              className={`p-4 rounded-xl border text-left text-xs font-bold transition-all flex flex-col gap-2 ${
                selectedScenario === sc.id
                  ? 'bg-brand-blue/20 text-brand-cyan border-brand-cyan shadow-glowBlue'
                  : 'bg-darkBg-panel text-gray-300 border-gray-800 hover:border-gray-700'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>{sc.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step-by-Step Playbook Display */}
      {current && (
        <GlassCard className="p-6 border-brand-cyan/30 flex flex-col gap-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Response Playbook: {current.title}
          </h3>

          <div className="flex flex-col gap-3 text-xs">
            <strong className="text-red-400 font-bold uppercase tracking-wider text-[10px]">
              🚨 IMMEDIATE HARM REDUCTION ACTIONS (Do Right Now):
            </strong>
            {current.urgentSteps.map((step, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-red-950/40 border border-red-800 text-red-200 font-medium">
                {idx + 1}. {step}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 text-xs">
            <strong className="text-brand-cyan font-bold uppercase tracking-wider text-[10px]">
              🛡️ SUBSEQUENT RECOVERY ACTIONS:
            </strong>
            {current.laterSteps.map((step, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 text-gray-200">
                {idx + 1}. {step}
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
