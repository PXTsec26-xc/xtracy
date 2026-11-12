'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Gamepad2, CheckCircle2, XCircle, Award, RefreshCw, ArrowRight } from 'lucide-react';

interface Scenario {
  id: string;
  title: string;
  category: string;
  situation: string;
  options: {
    text: string;
    correct: boolean;
    explanation: string;
  }[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 'sc-1',
    title: 'Suspicious Bank Verification SMS',
    category: 'SMS Smishing',
    situation:
      'You receive an SMS: "ALERT: Your bank debit card will be blocked in 2 hours due to missing KYC. Verify immediately at http://sec-bank-update.xyz/login". What should you do?',
    options: [
      {
        text: 'Click the link right away and log in to avoid debit card blocking.',
        correct: false,
        explanation: 'Dangerous! The .xyz lookalike domain is an unverified credential phishing site.',
      },
      {
        text: 'Do not click the link. Open your bank’s official mobile app or type the verified URL directly.',
        correct: true,
        explanation: 'Correct! Financial institutions do not force urgent KYC logins via unverified SMS links.',
      },
      {
        text: 'Reply to the SMS asking for the agent’s employee badge number.',
        correct: false,
        explanation: 'Incorrect! Replying signals your phone number is monitored and triggers further scam outreach.',
      },
    ],
  },
  {
    id: 'sc-2',
    title: 'Unexpected Job Offer via Chat',
    category: 'Advance-Fee Job Scam',
    situation:
      'A recruiter on WhatsApp offers a remote job paying $500/day for 1 hour of work and asks you to deposit a $50 registration fee via gift cards. What is your response?',
    options: [
      {
        text: 'Pay the $50 registration fee since $500/day is a high return.',
        correct: false,
        explanation: 'Incorrect! Legitimate employers never charge candidates fees or gift cards before onboarding.',
      },
      {
        text: 'Refuse payment, block the sender, and report the account in-app.',
        correct: true,
        explanation: 'Correct! Upfront registration or training fees via gift cards or crypto are hallmark job scams.',
      },
    ],
  },
  {
    id: 'sc-3',
    title: 'Unexpected MFA Push Notification Storm',
    category: 'MFA Fatigue Attack',
    situation:
      'At 2:14 AM your phone receives six consecutive Multi-Factor Authentication approval prompts from your corporate SSO app while you are asleep. What should you do?',
    options: [
      {
        text: 'Tap "Approve" once so the notifications stop ringing.',
        correct: false,
        explanation: 'Critical mistake! Attackers already have your password and are hoping fatigue makes you approve access.',
      },
      {
        text: 'Tap "Deny" / "Report Suspicious", immediately rotate your password, and alert security support.',
        correct: true,
        explanation: 'Correct! Repeated unsolicited MFA prompts indicate compromised credentials under active attack.',
      },
    ],
  },
  {
    id: 'sc-4',
    title: 'Urgent Executive Wire Transfer Email',
    category: 'Business Email Compromise',
    situation:
      'An email appearing to come from the company CFO instructs you to urgently wire an invoice payment to a newly updated overseas vendor bank account and keep it confidential. How do you verify?',
    options: [
      {
        text: 'Process the transfer quickly to avoid delaying executive operations.',
        correct: false,
        explanation: 'High risk! Secrecy + urgency + changed payment details are classic BEC indicators.',
      },
      {
        text: 'Verify out-of-band by calling the CFO or vendor on an independently known phone number.',
        correct: true,
        explanation: 'Correct! Never verify payment instruction changes solely via reply-to email.',
      },
    ],
  },
  {
    id: 'sc-5',
    title: 'Unexpected ZIP Attachment Named "Invoice_Scan.zip"',
    category: 'Malware Delivery',
    situation:
      'You receive an unexpected invoice ZIP containing `Invoice_2026.pdf.exe` from an unknown sender address. Windows warns about an unrecognized publisher. What do you do?',
    options: [
      {
        text: 'Rename it to remove `.exe` and open it as a PDF.',
        correct: false,
        explanation: 'Unsafe! Double extensions hide executable malware binaries disguised as PDFs.',
      },
      {
        text: 'Do not execute it; quarantine/delete the message and inspect the file hash only in a sandbox if required.',
        correct: true,
        explanation: 'Correct! Double-extension `.pdf.exe` files are executable programs, never standard documents.',
      },
    ],
  },
  {
    id: 'sc-6',
    title: 'Public Airport Wi-Fi Captive Portal Prompt',
    category: 'Network MitM Risk',
    situation:
      'A free public Wi-Fi captive portal asks you to install a custom root CA certificate or update "Security Browser Plugin" to access the internet. What is the safe decision?',
    options: [
      {
        text: 'Install the profile so TLS websites stop showing certificate errors.',
        correct: false,
        explanation: 'Dangerous! Installing an untrusted root CA allows an attacker to intercept encrypted HTTPS traffic.',
      },
      {
        text: 'Decline installation immediately, disconnect from that Wi-Fi network, and use mobile cellular hotspot or trusted VPN.',
        correct: true,
        explanation: 'Correct! Legitimate captive portals never require installing root CA certificates or executable plugins.',
      },
    ],
  },
];

export default function SimulatorToolPage() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [score, setScore] = useState(0);

  const scenario = SCENARIOS[currentScenario];
  const selectedOption = selectedOptions[scenario.id] ?? null;
  const maxScore = SCENARIOS.length * 50;

  const handleSelect = (idx: number, isCorrect: boolean) => {
    // Score once per scenario to prevent infinite re-click farming
    if (selectedOptions[scenario.id] !== undefined) return;
    setSelectedOptions((prev) => ({ ...prev, [scenario.id]: idx }));
    if (isCorrect) {
      setScore((prev) => prev + 50);
    }
  };

  const handleReset = () => {
    setCurrentScenario(0);
    setSelectedOptions({});
    setScore(0);
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Gamepad2 className="w-8 h-8 text-emerald-400" />
              Digital Safety Decision Simulator
            </h1>
            <Badge type="productStatus" value="EDUCATIONAL SIMULATOR" size="sm" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-blue/20 text-brand-cyan border border-brand-cyan/40 font-bold text-xs">
              <Award className="w-4 h-4" />
              <span>Score: {score} / {maxScore} pts</span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              aria-label="Reset decision simulator progress"
              className="px-3 py-1.5 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-700 text-gray-300 text-xs font-bold flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Interactive cyber safety decision scenarios ({SCENARIOS.length} modules) evaluating threat recognition and safe response habits.
        </p>
      </div>

      {/* Progress Pills */}
      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map((sc, idx) => {
          const answered = selectedOptions[sc.id] !== undefined;
          const active = idx === currentScenario;
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => setCurrentScenario(idx)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                active
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                  : answered
                  ? 'bg-gray-900 border-brand-cyan/40 text-brand-cyan'
                  : 'bg-darkBg-panel border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              Scenario {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Main Simulator Card */}
      <GlassCard className="p-6 border-emerald-500/30 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3 flex-wrap gap-2">
          <h2 className="text-base font-bold text-white">
            {currentScenario + 1}. {scenario.title}
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 text-[10px] font-bold border border-purple-800">
            {scenario.category}
          </span>
        </div>

        <p className="text-xs text-gray-200 font-medium leading-relaxed bg-darkBg-panel p-4 rounded-xl border border-gray-800">
          {scenario.situation}
        </p>

        <div className="flex flex-col gap-3 text-xs">
          {scenario.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            let style = 'bg-darkBg-panel/60 border-gray-800 text-gray-300 hover:border-emerald-400/40';

            if (isSelected) {
              style = opt.correct
                ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200 font-bold'
                : 'bg-red-950/80 border-red-600 text-red-200 font-bold';
            }

            return (
              <button
                key={idx}
                type="button"
                aria-pressed={isSelected}
                disabled={selectedOption !== null && !isSelected}
                onClick={() => handleSelect(idx, opt.correct)}
                className={`p-4 rounded-xl border text-left transition-all disabled:opacity-65 ${style}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span>{opt.text}</span>
                  {isSelected &&
                    (opt.correct ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    ))}
                </div>
                {isSelected && (
                  <p className="mt-2 text-[11px] font-normal border-t border-gray-800/80 pt-2 opacity-90">
                    {opt.explanation}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {selectedOption !== null && currentScenario < SCENARIOS.length - 1 && (
          <button
            type="button"
            onClick={() => setCurrentScenario(currentScenario + 1)}
            className="self-end px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-electric text-white font-extrabold text-xs shadow-glowBlue transition-all flex items-center gap-1.5"
          >
            <span>Next Scenario</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </GlassCard>
    </div>
  );
}
