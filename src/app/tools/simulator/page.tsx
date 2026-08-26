'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Gamepad2, CheckCircle2, XCircle, Award, RefreshCw, ArrowRight } from 'lucide-react';

export default function SimulatorToolPage() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const scenarios = [
    {
      id: 'sc-1',
      title: 'Suspicious Bank Verification SMS',
      category: 'SMS Smishing',
      situation: 'You receive an SMS: "ALERT: Your bank debit card will be blocked in 2 hours due to missing KYC. Verify immediately at http://sec-bank-update.xyz/login". What should you do?',
      options: [
        { text: 'Click the link right away and log in to avoid debit card blocking.', correct: false, explanation: 'Dangerous! The website domain .xyz is an unverified phishing site.' },
        { text: 'Do not click the link. Open your bank’s official mobile app or type the verified URL directly.', correct: true, explanation: 'Correct! Banks never send urgent block threats via unverified SMS links.' },
        { text: 'Reply to the SMS asking for the agent’s employee badge number.', correct: false, explanation: 'Incorrect! Replying confirms your phone number is active to scammers.' },
      ],
    },
    {
      id: 'sc-2',
      title: 'Unexpected Job Offer via Chat',
      category: 'Recruiter Scam',
      situation: 'A recruiter on WhatsApp offers a remote job paying $500/day for 1 hour of work. They ask you to deposit a $50 registration fee via gift cards. What is your response?',
      options: [
        { text: 'Pay the $50 registration fee since $500/day is a high return.', correct: false, explanation: 'Incorrect! Legitimate employers never charge candidates money or gift cards to start a job.' },
        { text: 'Refuse payment, block the sender, and report the message.', correct: true, explanation: 'Correct! Advance fee job offers are 100% employment scams.' },
      ],
    },
  ];

  const scenario = scenarios[currentScenario];

  const handleSelect = (idx: number, isCorrect: boolean) => {
    setSelectedOption(idx);
    if (isCorrect) setScore((prev) => prev + 50);
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Gamepad2 className="w-8 h-8 text-emerald-400" />
              Digital Safety Decision Simulator
            </h1>
            <Badge type="productStatus" value="EDUCATIONAL SIMULATOR" size="sm" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-brand-blue/20 text-brand-cyan border border-brand-cyan/40 font-bold text-xs">
            <Award className="w-4 h-4" />
            <span>Score: {score} pts</span>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Interactive cyber safety decision scenarios evaluating risk recognition and safe online response strategies.
        </p>
      </div>

      {/* Main Simulator Card */}
      <GlassCard className="p-6 border-emerald-500/30 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <h3 className="text-base font-bold text-white">{scenario.title}</h3>
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
                onClick={() => handleSelect(idx, opt.correct)}
                className={`p-4 rounded-xl border text-left transition-all ${style}`}
              >
                <div className="flex items-center justify-between">
                  <span>{opt.text}</span>
                  {isSelected && (
                    opt.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />
                  )}
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

        {selectedOption !== null && currentScenario < scenarios.length - 1 && (
          <button
            type="button"
            onClick={() => {
              setCurrentScenario(currentScenario + 1);
              setSelectedOption(null);
            }}
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
