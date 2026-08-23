'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { QuickExitButton } from '@/components/ui/QuickExitButton';
import { X, ShieldAlert, Heart, Lock, FileText, PhoneCall, CheckCircle2, AlertOctagon } from 'lucide-react';

interface SituationOption {
  id: string;
  title: string;
  subtitle: string;
  steps: string[];
  evidenceSteps: string[];
  contacts: { name: string; detail: string; link: string }[];
}

export const EmergencyHelpModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const situations: SituationOption[] = [
    {
      id: 'sit-threats',
      title: 'Someone is threatening me online',
      subtitle: 'Receiving direct threats of violence, harm, exposure, or harassment.',
      steps: [
        'Do NOT reply or argue with the sender.',
        'Take full-screen screenshots showing date, time, and full username.',
        'Set your social accounts to Private.',
        'Block the account ONLY AFTER taking screenshots.',
        'Tell a trusted person or legal authority.',
      ],
      evidenceSteps: ['Screenshot messages with full header', 'Copy profile URL', 'Record timestamp in Safe Vault'],
      contacts: [
        { name: 'National Domestic Violence Hotline', detail: '1-800-799-7233 / Text "START" to 88788', link: 'https://www.thehotline.org' },
        { name: 'Cyber Civil Rights Helpline', detail: '1-844-878-2274', link: 'https://www.cybercivilrights.org' },
      ],
    },
    {
      id: 'sit-blackmail',
      title: 'I am being blackmailed / extorted with private photos',
      subtitle: 'Demands for money or additional images with threats to leak content.',
      steps: [
        'STOP ALL COMMUNICATION. Do NOT send money or crypto.',
        'DO NOT DELETE THE CHATS YET — screenshot everything first.',
        'Use StopNCII.org to upload image digital hashes (not the photos themselves) to prevent sharing across platforms.',
        'Use TakeItDown.ncmec.org if photos were taken when under 18.',
      ],
      evidenceSteps: ['Screenshot demands and payment wallet info', 'Note usernames', 'Keep chat logs local'],
      contacts: [
        { name: 'StopNCII.org', detail: 'Non-Consensual Image Hash Platform', link: 'https://stopncii.org' },
        { name: 'Take It Down (NCMEC)', detail: '1-800-843-5678', link: 'https://takeitdown.ncmec.org' },
      ],
    },
    {
      id: 'sit-fake-profile',
      title: 'Someone created a fake profile using my photos & identity',
      subtitle: 'Impersonation account created to damage reputation or message contacts.',
      steps: [
        'Do NOT message the fake account directly.',
        'Alert your close contacts that a fake account is active.',
        'Copy the exact URL of the fake profile.',
        'File an official Impersonation report on the platform.',
      ],
      evidenceSteps: ['Copy exact profile link', 'Screenshot posts/stories by fake account', 'Save date noticed'],
      contacts: [
        { name: 'Instagram Impersonation Hub', detail: 'Help Center Portal', link: 'https://instagram.com/hacked' },
        { name: 'Facebook Impersonation Help', detail: 'Meta Reporting', link: 'https://facebook.com/help' },
      ],
    },
    {
      id: 'sit-location',
      title: 'Someone knows my physical location without my consent',
      subtitle: 'Suspecting cyberstalking, hidden AirTag/Bluetooth tracker, or compromised account location.',
      steps: [
        'Scan for unknown Bluetooth devices/AirTags near you.',
        'Turn OFF location services for social media apps (Snapchat, Instagram, WhatsApp).',
        'Check Google Maps & Apple Find My shared location contacts.',
        'Log out of all unknown active account sessions.',
      ],
      evidenceSteps: ['Screenshot unrecognized location shares', 'Keep written log of incidents'],
      contacts: [
        { name: 'Safety Net Project (NNEDV)', detail: 'Tech Safety Resources', link: 'https://www.techsafety.org' },
      ],
    },
  ];

  const activeSituation = situations.find((s) => s.id === selectedId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <GlassCard className="max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-6 border-red-500/40 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-700/60 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                "I Need Help Now" — Immediate Emergency Guidance
              </h2>
              <p className="text-xs text-gray-300">
                Discreet digital safety triage. Select a situation to view calm, private defensive steps.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <QuickExitButton variant="prominent" />
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Disclaimer Warning Box */}
        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-200 flex items-start gap-2">
          <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-red-300">CRITICAL SAFETY NOTICE:</strong> XTRACY is an educational digital safety platform and CANNOT contact law enforcement or dispatch emergency response services. If you are in immediate physical danger, please call <strong>911</strong> or your local emergency hotline right now.
          </p>
        </div>

        {/* Situation Selector */}
        {!activeSituation ? (
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-cyan">
              Select What Is Happening (No Details Uploaded)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {situations.map((sit) => (
                <button
                  key={sit.id}
                  onClick={() => setSelectedId(sit.id)}
                  className="flex flex-col text-left p-4 rounded-xl bg-darkBg-panel/60 hover:bg-darkBg-panel border border-gray-800 hover:border-brand-cyan/40 transition-all group"
                >
                  <span className="font-bold text-white group-hover:text-brand-cyan text-sm">
                    {sit.title}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">{sit.subtitle}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Active Situation Steps */
          <div className="flex flex-col gap-5 animate-fadeIn">
            <button
              onClick={() => setSelectedId(null)}
              className="self-start text-xs font-bold text-brand-cyan hover:underline"
            >
              ← Back to Situation List
            </button>

            <div className="p-4 rounded-2xl bg-darkBg-panel/60 border border-brand-cyan/30 flex flex-col gap-4">
              <h3 className="text-base font-bold text-white text-brand-cyan">{activeSituation.title}</h3>
              
              <div>
                <h4 className="text-xs font-bold uppercase text-emerald-400 tracking-wider mb-2">
                  Immediate Defensive Steps To Take Right Now
                </h4>
                <div className="flex flex-col gap-2">
                  {activeSituation.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-200 bg-gray-900/80 p-2.5 rounded-lg border border-gray-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-amber-400 tracking-wider mb-2">
                  Evidence Preservation Guidelines
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-300">
                  {activeSituation.evidenceSteps.map((ev, i) => (
                    <li key={i}>{ev}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-purple-400 tracking-wider mb-2">
                  Trusted Official Helplines & Resources
                </h4>
                <div className="flex flex-col gap-2">
                  {activeSituation.contacts.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200">
                      <div>
                        <strong className="text-white">{c.name}: </strong>
                        <span>{c.detail}</span>
                      </div>
                      <a href={c.link} target="_blank" rel="noopener noreferrer" className="text-brand-cyan hover:underline text-[11px] font-bold">
                        Visit Official Site
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-gray-800 pt-4 text-xs">
          <span className="text-gray-400">All guidance operates client-side for confidential privacy.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold"
          >
            Close Emergency Window
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
