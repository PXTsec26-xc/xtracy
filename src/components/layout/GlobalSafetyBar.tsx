'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Globe, ShieldAlert, LogOut } from 'lucide-react';
import { COUNTRY_PROFILES } from '@/lib/globalSafetyData';

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
          <Globe className="w-4 h-4 text-brand-cyan shrink-0" aria-hidden="true" />
          <span className="font-bold tracking-wide text-white uppercase text-[11px]">
            XTRACY Global Safety Network
          </span>
          <span className="hidden md:inline-block text-[10px] text-gray-400 border-l border-gray-700 pl-2">
            Educational directory — does not replace local emergency services.
          </span>
        </div>

        {/* Right: Actions & Country Selector & Quick Exit */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap justify-center">
          <div className="flex items-center gap-1.5 bg-darkBg-panel px-2.5 py-1 rounded-lg border border-gray-800">
            <label htmlFor="global-safety-bar-country" className="text-[10px] text-gray-400 font-semibold">
              Region:
            </label>
            <select
              id="global-safety-bar-country"
              aria-label="Select country or region for safety resources"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-transparent text-white font-bold text-[11px] max-w-[165px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded cursor-pointer"
            >
              {COUNTRY_PROFILES.map((c) => (
                <option key={c.countryCode} value={c.countryCode} className="bg-darkBg text-white">
                  {c.countryName}
                </option>
              ))}
            </select>
          </div>

          <Link
            href={`/global-safety?countryCode=${selectedCountry}`}
            className="px-2.5 py-1 rounded-lg bg-brand-blue/20 hover:bg-brand-blue/30 border border-brand-cyan/40 text-brand-cyan font-bold text-[11px] transition-all flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
          >
            <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Safety Resources</span>
          </Link>

          <button
            type="button"
            onClick={handleQuickExit}
            className="px-2.5 py-1 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 font-bold text-[11px] transition-all flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            title="Immediately leave this page for Google.com"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Quick Exit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
