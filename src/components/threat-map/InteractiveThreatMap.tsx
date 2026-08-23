'use client';

import React, { useState } from 'react';
import { MOCK_INCIDENT_PINS } from '@/lib/mockData/incidentsMap';
import { IncidentPin, RiskLevel } from '@/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { MapPin, Globe, Filter, AlertCircle, Info } from 'lucide-react';

export const InteractiveThreatMap: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPin, setSelectedPin] = useState<IncidentPin | null>(MOCK_INCIDENT_PINS[0]);

  const categories = ['ALL', 'Ransomware', 'Phishing', 'Vulnerabilities', 'Data Breach', 'Scam Campaign'];

  const filteredPins = selectedCategory === 'ALL'
    ? MOCK_INCIDENT_PINS
    : MOCK_INCIDENT_PINS.filter((p) => p.category === selectedCategory);

  return (
    <div className="flex flex-col gap-6">
      {/* Filters Bar */}
      <GlassCard className="p-4 flex flex-wrap items-center justify-between gap-4 border-brand-blue/30">
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-brand-cyan">
          <Filter className="w-4 h-4" />
          <span>Incident Filters:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-blue text-white shadow-glowBlue border border-brand-cyan'
                  : 'bg-darkBg-panel/60 text-gray-400 border border-gray-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <Badge type="productStatus" value="DEMO / SAMPLE DATA" size="sm" />
      </GlassCard>

      {/* Map Visual Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Map Canvas Grid */}
        <GlassCard className="lg:col-span-2 p-6 min-h-[420px] flex flex-col justify-between relative border-brand-blue/30 overflow-hidden group">
          {/* Subtle World Map Grid Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#00b4d8_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

          {/* Map Header Overlay */}
          <div className="relative z-10 flex items-center justify-between border-b border-gray-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-brand-cyan animate-spin-slow" />
              <span className="font-bold text-white text-sm">Global Cyber Incident Grid</span>
            </div>
            <span className="text-xs text-gray-400">Showing {filteredPins.length} Incidents</span>
          </div>

          {/* Incident Pins Scatter Grid */}
          <div className="relative z-10 my-auto grid grid-cols-2 sm:grid-cols-3 gap-4 py-8">
            {filteredPins.map((pin) => {
              const active = selectedPin?.id === pin.id;
              return (
                <button
                  key={pin.id}
                  onClick={() => setSelectedPin(pin)}
                  className={`p-4 rounded-xl text-left flex flex-col gap-2 transition-all duration-300 backdrop-blur-lg border ${
                    active
                      ? 'bg-brand-blue/25 border-brand-cyan shadow-glowBlue scale-[1.03]'
                      : 'bg-darkBg-panel/60 border-gray-800/80 hover:border-brand-blue/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-brand-cyan uppercase tracking-wider">
                      {pin.region}
                    </span>
                    <Badge type="risk" value={pin.severity} size="sm" />
                  </div>
                  <h4 className="font-bold text-white text-xs line-clamp-1">{pin.title}</h4>
                  <span className="text-[10px] text-gray-400">{pin.date}</span>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="relative z-10 flex items-center gap-4 text-[11px] text-gray-400 pt-3 border-t border-gray-800/80">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Critical</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> High</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Medium</span>
          </div>
        </GlassCard>

        {/* Pin Details Drawer */}
        <GlassCard className="p-6 border-brand-blue/30 flex flex-col justify-between gap-4">
          {selectedPin ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <span className="text-xs font-bold text-brand-cyan uppercase">{selectedPin.region} Incident</span>
                <Badge type="risk" value={selectedPin.severity} size="sm" />
              </div>

              <h3 className="text-base font-bold text-white">{selectedPin.title}</h3>

              <div className="flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between text-gray-400">
                  <span>Category:</span>
                  <strong className="text-white">{selectedPin.category}</strong>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span>Date Observed:</span>
                  <strong className="text-white">{selectedPin.date}</strong>
                </div>
              </div>

              <p className="text-xs text-gray-200 bg-darkBg-panel/60 p-4 rounded-xl border border-gray-800 leading-relaxed">
                {selectedPin.summary}
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic text-center my-auto">Select a pin on the grid to inspect details.</p>
          )}

          <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 text-[11px] text-gray-400 flex items-start gap-1.5">
            <Info className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
            <p><strong>NOTE:</strong> Map entries represent aggregated verified incident indicators. No victim private information is displayed.</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
