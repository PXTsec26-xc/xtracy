'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Globe, ShieldAlert, LogOut, Info } from 'lucide-react';

const COUNTRIES = [
  { code: 'GLOBAL', name: 'Global / International' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'EU', name: 'European Union' },
  { code: 'IN', name: 'India' },
];

export const GlobalSafetyBar: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState('GLOBAL');

  const handleQuickExit = () => {
    window.location.replace('https://www.google.com');
  };

  return (
    <div className="w-full bg-darkBg-card/90 border-b border-gray-800 text-xs py-2 px-4 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Global Safety Network Label */}
        <div className="flex items-center gap-2 text-gray-300">
          <Globe className="w-4 h-4 text-brand-cyan animate-pulse" />
          <span className="font-bold tracking-wide text-white uppercase text-[11px]">
            🌐 XTRACY Global Safety Network
          </span>
          <span className="hidden md:inline-block text-[10px] text-gray-400 border-l border-gray-700 pl-2">
            XTRACY does not replace local emergency services.
          </span>
        </div>

        {/* Right: Actions & Country Selector & Quick Exit */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1 bg-darkBg-panel px-2.5 py-1 rounded-lg border border-gray-800">
            <span className="text-[10px] text-gray-400 font-semibold">Region:</span>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-transparent text-white font-bold text-[11px] focus:outline-none cursor-pointer"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-darkBg text-white">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <Link
            href={`/global-safety?countryCode=${selectedCountry}`}
            className="px-2.5 py-1 rounded-lg bg-brand-blue/20 hover:bg-brand-blue/30 border border-brand-cyan/40 text-brand-cyan font-bold text-[11px] transition-all flex items-center gap-1"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Safety Resources</span>
          </Link>

          <button
            type="button"
            onClick={handleQuickExit}
            className="px-2.5 py-1 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 font-bold text-[11px] transition-all flex items-center gap-1"
            title="Instantly exit to Google.com for privacy"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Quick Exit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
