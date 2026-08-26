'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, CheckSquare, Square, Award, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';

export default function DigitalCheckupToolPage() {
  const [answers, setAnswers] = useState({
    mfa: true,
    uniquePasswords: true,
    passwordManager: false,
    recoveryMethods: true,
    deviceUpdates: true,
    backups: false,
    phishingAwareness: true,
    browserPrivacy: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const toggleAnswer = (key: keyof typeof answers) => {
    setAnswers({ ...answers, [key]: !answers[key] });
  };

  const calculateScore = () => {
    const positiveCount = Object.values(answers).filter(Boolean).length;
    return Math.floor((positiveCount / Object.keys(answers).length) * 100);
  };

  const score = calculateScore();

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            Digital Safety Checkup
          </h1>
          <Badge type="productStatus" value="PERSONAL CHECKUP" size="sm" />
        </div>
        <p className="text-xs text-gray-400">
          Personalized digital safety posture evaluation generating prioritized defensive action plans.
        </p>
      </div>

      <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs font-semibold flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Privacy Notice: Digital Safety Checkup NEVER requests passwords, recovery codes, or sensitive account credentials.</span>
      </div>

      {/* Assessment Form */}
      <GlassCard className="p-6 border-gray-800 flex flex-col gap-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-emerald-400">
          Security Practices Questionnaire
        </h3>

        <div className="flex flex-col gap-3 text-xs">
          {[
            { key: 'mfa', label: 'I have Multi-Factor Authentication (MFA/2FA) active on primary email and banking.' },
            { key: 'uniquePasswords', label: 'I use unique, strong passphrases for every major online account.' },
            { key: 'passwordManager', label: 'I store passwords in an encrypted password manager or offline safe vault.' },
            { key: 'recoveryMethods', label: 'I have verified my emergency account recovery email and phone numbers.' },
            { key: 'deviceUpdates', label: 'I install smartphone and computer operating system updates within 48 hours.' },
            { key: 'backups', label: 'I maintain regular encrypted backups of essential documents and photos.' },
            { key: 'phishingAwareness', label: 'I verify sender handles and domain names before clicking email or SMS links.' },
            { key: 'browserPrivacy', label: 'I block third-party tracking cookies and audit browser extensions periodically.' },
          ].map(({ key, label }) => {
            const isChecked = answers[key as keyof typeof answers];
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleAnswer(key as keyof typeof answers)}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 hover:border-emerald-400/40 text-left transition-all"
              >
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-gray-500 shrink-0" />
                )}
                <span className={isChecked ? 'text-white font-medium' : 'text-gray-400'}>{label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setSubmitted(true)}
          className="self-end px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center gap-2 mt-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Generate Improvement Plan</span>
        </button>
      </GlassCard>

      {/* Generated Improvement Plan */}
      {submitted && (
        <GlassCard className="p-6 border-emerald-500/40 flex flex-col gap-6 text-xs animate-fadeIn">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <div>
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Current Digital Security Posture</span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-3xl font-black text-white">{score}/100</span>
                <Badge type="risk" value={score >= 75 ? 'STRONG' : score >= 50 ? 'MODERATE' : 'NEEDS_ATTENTION'} size="md" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-emerald-400">
              Prioritized Defensive Action Plan
            </h3>

            {!answers.mfa && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-200 flex flex-col gap-1">
                <strong className="text-red-300 font-bold uppercase text-[10px]">
                  PRIORITY 1: Enable Multi-Factor Authentication (MFA)
                </strong>
                <p>Activate 2FA via authenticator apps (e.g. Google Authenticator) on your primary email and bank accounts immediately.</p>
              </div>
            )}

            {!answers.backups && (
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800 text-amber-200 flex flex-col gap-1">
                <strong className="text-amber-300 font-bold uppercase text-[10px]">
                  PRIORITY 2: Set Up Offline or Encrypted Backups
                </strong>
                <p>Maintain offsite or offline backups of critical documents to mitigate ransomware risks.</p>
              </div>
            )}

            {!answers.passwordManager && (
              <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 text-gray-300 flex flex-col gap-1">
                <strong className="text-brand-cyan font-bold uppercase text-[10px]">
                  PRIORITY 3: Adopt an Encrypted Password Manager
                </strong>
                <p>Use a trusted password manager or XTRACY WebCrypto Safe Vault to store complex passphrases safely.</p>
              </div>
            )}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
