'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { useAccessibilityStore } from '@/store/useAccessibilityStore';
import { Eye, Type, Contrast, ZapOff, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AccessibilityCenterPage() {
  const {
    textSize,
    highContrast,
    reducedMotion,
    enhancedFocus,
    setTextSize,
    toggleHighContrast,
    toggleReducedMotion,
    toggleEnhancedFocus,
    announce,
  } = useAccessibilityStore();

  const handleTextSizeChange = (size: 'normal' | 'large' | 'xlarge') => {
    setTextSize(size);
    announce(`Text size changed to ${size}.`);
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Eye className="w-8 h-8 text-brand-cyan" />
            XTRACY Accessibility Center
          </h1>
          <Badge type="productStatus" value="WCAG 2.1 COMPLIANCE" size="sm" />
        </div>
        <p className="text-xs text-gray-400">
          Customize display contrast, font sizing, keyboard focus outlines, motion settings, and screen reader announcements.
        </p>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Text Size Control */}
        <GlassCard className="p-6 border-gray-800 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Type className="w-5 h-5 text-brand-cyan" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Text Size Sizing</h3>
          </div>
          <p className="text-xs text-gray-400">Adjust the base font scaling for easier reading across all tools.</p>
          <div className="flex gap-2">
            {[
              { key: 'normal', label: 'Normal (100%)' },
              { key: 'large', label: 'Large (115%)' },
              { key: 'xlarge', label: 'X-Large (130%)' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleTextSizeChange(key as any)}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                  textSize === key
                    ? 'bg-brand-blue text-white border-brand-cyan shadow-glowBlue'
                    : 'bg-darkBg-panel text-gray-400 border-gray-800 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* High Contrast Mode */}
        <GlassCard className="p-6 border-gray-800 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Contrast className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">High Contrast Mode</h3>
            </div>
            <p className="text-xs text-gray-400">Enhance text borders and contrast ratios for low-vision readability.</p>
          </div>
          <button
            onClick={() => {
              toggleHighContrast();
              announce(`High contrast mode ${!highContrast ? 'enabled' : 'disabled'}.`);
            }}
            className={`w-full py-3 rounded-xl border font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              highContrast
                ? 'bg-amber-500 text-black border-amber-400 font-extrabold'
                : 'bg-darkBg-panel text-gray-300 border-gray-800 hover:border-gray-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{highContrast ? 'High Contrast Enabled' : 'Enable High Contrast'}</span>
          </button>
        </GlassCard>

        {/* Reduced Motion Mode */}
        <GlassCard className="p-6 border-gray-800 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <ZapOff className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Reduced Motion</h3>
            </div>
            <p className="text-xs text-gray-400">Disable background animations, transitions, and pulsing highlights.</p>
          </div>
          <button
            onClick={() => {
              toggleReducedMotion();
              announce(`Reduced motion mode ${!reducedMotion ? 'enabled' : 'disabled'}.`);
            }}
            className={`w-full py-3 rounded-xl border font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              reducedMotion
                ? 'bg-purple-600 text-white border-purple-400 font-extrabold'
                : 'bg-darkBg-panel text-gray-300 border-gray-800 hover:border-gray-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{reducedMotion ? 'Reduced Motion Active' : 'Disable Animations'}</span>
          </button>
        </GlassCard>

        {/* Enhanced Focus Ring */}
        <GlassCard className="p-6 border-gray-800 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Enhanced Focus Ring</h3>
            </div>
            <p className="text-xs text-gray-400">Display prominent high-visibility outlines when navigating via keyboard Tab.</p>
          </div>
          <button
            onClick={() => {
              toggleEnhancedFocus();
              announce(`Enhanced focus ring ${!enhancedFocus ? 'enabled' : 'disabled'}.`);
            }}
            className={`w-full py-3 rounded-xl border font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              enhancedFocus
                ? 'bg-emerald-600 text-white border-emerald-400 font-extrabold'
                : 'bg-darkBg-panel text-gray-300 border-gray-800 hover:border-gray-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{enhancedFocus ? 'Focus Ring Active' : 'Enable Focus Outlines'}</span>
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
