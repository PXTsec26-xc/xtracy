'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { GraduationCap, ShieldCheck, CheckCircle2, XCircle, ArrowRight, Award } from 'lucide-react';

const SIMULATION_QUIZZES = [
  {
    id: 'quiz-1',
    title: 'Phishing Email Detection Challenge',
    category: 'Phishing Awareness',
    question: 'You receive an urgent email from "support@sec-bank-verify.com" claiming your debit card will be suspended in 2 hours unless you log in. What should you do?',
    options: [
      { text: 'Click the link in the email immediately and type your password.', correct: false, explanation: 'Incorrect! The domain "sec-bank-verify.com" is an unverified phishing site.' },
      { text: 'Do not click the link. Open your bank’s official mobile app or type the verified website URL directly.', correct: true, explanation: 'Correct! Never trust urgent links in unsolicited emails.' },
      { text: 'Reply to the email with your ATM PIN to confirm identity.', correct: false, explanation: 'Incorrect! Banks never ask for PINs or passwords via email.' },
    ],
  },
  {
    id: 'quiz-2',
    title: 'Smishing SMS & OTP Protection Quiz',
    category: 'Scam Recognition',
    question: 'An SMS arrives claiming you won Rs 25,000 and asks you to forward the OTP sent to your phone to "verify your claim". What is the rule for OTPs?',
    options: [
      { text: 'Share the OTP if the caller sounds friendly.', correct: false, explanation: 'Incorrect! OTPs grant full access to your bank account or WhatsApp.' },
      { text: 'NEVER share an OTP with anyone, under any circumstances.', correct: true, explanation: 'Correct! One-Time Passwords are confidential keys to your account.' },
      { text: 'Only share the OTP if they promise to send the money first.', correct: false, explanation: 'Incorrect! This is a classic financial fraud scam.' },
    ],
  },
];

export default function LearningCenterPage() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [completedScore, setCompletedScore] = useState(0);

  const handleSelect = (quizId: string, optIdx: number, isCorrect: boolean) => {
    setSelectedAnswers({ ...selectedAnswers, [quizId]: optIdx });
    if (isCorrect) {
      setCompletedScore((prev) => prev + 50);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-brand-cyan" />
              Cybersecurity Learning & Educational Simulations
            </h1>
            <Badge type="productStatus" value="100% EDUCATIONAL" size="sm" />
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-brand-blue/20 border border-brand-cyan/40 text-brand-cyan font-bold text-xs">
            <Award className="w-4 h-4" />
            <span>Learning Score: {completedScore} pts</span>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Non-operational interactive simulations, scam recognition exercises, and educational privacy quizzes.
        </p>
      </div>

      {/* Quiz List */}
      <div className="flex flex-col gap-6">
        {SIMULATION_QUIZZES.map((quiz) => {
          const chosenIdx = selectedAnswers[quiz.id];

          return (
            <GlassCard key={quiz.id} className="p-6 border-brand-blue/30 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <h3 className="text-base font-bold text-white">{quiz.title}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 text-[10px] font-bold border border-purple-800">
                  {quiz.category}
                </span>
              </div>

              <p className="text-xs text-gray-200 font-medium leading-relaxed">{quiz.question}</p>

              <div className="flex flex-col gap-2.5 text-xs">
                {quiz.options.map((opt, idx) => {
                  const isSelected = chosenIdx === idx;
                  let style = 'bg-darkBg-panel/60 border-gray-800 text-gray-300 hover:border-brand-cyan/40';

                  if (isSelected) {
                    style = opt.correct
                      ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200 font-bold'
                      : 'bg-red-950/80 border-red-600 text-red-200 font-bold';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelect(quiz.id, idx, opt.correct)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${style}`}
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
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
