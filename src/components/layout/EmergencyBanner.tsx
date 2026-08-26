'use client';

import React from 'react';
import { QuickExitButton } from '@/components/ui/QuickExitButton';
import { AlertCircle, PhoneCall, HeartHandshake } from 'lucide-react';
import Link from 'next/link';

export const EmergencyBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-red-950 via-darkBg-card to-purple-950 border-b border-red-800/50 text-gray-200 text-xs px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 backdrop-blur-md sticky top-0 z-50">
      {/* Left Notice */}
      <div className="flex items-center gap-2 text-center sm:text-left">
        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 animate-pulse" />
        <p className="line-clamp-1">
          <span className="font-bold text-red-300">INDIA EMERGENCY RESPONSE:</span> Call{' '}
          <a href="tel:112" className="font-black text-white underline bg-red-600 px-1.5 py-0.5 rounded">
            112 (Universal)
          </a>{' '}
          | Women&apos;s Helpline{' '}
          <a href="tel:181" className="font-bold text-purple-300 underline">
            181
          </a>{' '}
          | Cybercrime{' '}
          <a href="tel:1930" className="font-bold text-emerald-300 underline">
            1930
          </a>
        </p>
      </div>

      {/* Right Action Links */}
      <div className="flex items-center gap-3 shrink-0">
        <Link
          href="/emergency"
          className="inline-flex items-center gap-1 text-red-300 hover:text-white font-bold"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Emergency Contacts</span>
        </Link>
        <QuickExitButton variant="navbar" />
      </div>
    </div>
  );
};
