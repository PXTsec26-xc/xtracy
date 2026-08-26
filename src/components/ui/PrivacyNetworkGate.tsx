'use client';

import React from 'react';
import { GlassCard } from './GlassCard';
import { ShieldAlert, Globe, Lock, Check, X } from 'lucide-react';

interface PrivacyNetworkGateProps {
  isOpen: boolean;
  destination: string;
  dataCategory: string;
  purpose: string;
  containsSensitiveEvidence?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PrivacyNetworkGate: React.FC<PrivacyNetworkGateProps> = ({
  isOpen,
  destination,
  dataCategory,
  purpose,
  containsSensitiveEvidence = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <GlassCard className="max-w-md w-full p-6 border-brand-cyan/50 flex flex-col gap-4 text-xs animate-fadeIn">
        <div className="flex items-center gap-2 text-brand-cyan font-bold uppercase tracking-wider text-sm">
          <Globe className="w-5 h-5 text-brand-cyan" /> External Request Review
        </div>

        <p className="text-gray-300 leading-relaxed">
          XTRACY enforces a transparent Privacy Network Gate. Review external lookup details before proceeding:
        </p>

        <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-2 font-mono text-[11px]">
          <div>
            <span className="text-gray-400">Destination Service:</span>{' '}
            <strong className="text-white">{destination}</strong>
          </div>
          <div>
            <span className="text-gray-400">Data Category:</span>{' '}
            <strong className="text-brand-cyan">{dataCategory}</strong>
          </div>
          <div>
            <span className="text-gray-400">Request Purpose:</span>{' '}
            <strong className="text-gray-300">{purpose}</strong>
          </div>
          <div>
            <span className="text-gray-400">Sensitive Evidence Included:</span>{' '}
            <strong className={containsSensitiveEvidence ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
              {containsSensitiveEvidence ? 'YES (USER CONFIRMATION REQUIRED)' : 'NO (PUBLIC QUERY ONLY)'}
            </strong>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs transition-all flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel Request</span>
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Continue & Send</span>
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
