'use client';

import React from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { X, Check, Shield, Laptop, Smartphone, Globe, Mail, Share2, Server } from 'lucide-react';

export const SafetyProfileModal: React.FC = () => {
  const { profile, isModalOpen, closeModal, toggleItem, updateProfile } = useProfileStore();

  if (!isModalOpen) return null;

  const categories = [
    {
      key: 'operatingSystems' as const,
      label: 'Operating Systems',
      icon: Laptop,
      options: ['Android', 'iPhone / iOS', 'Windows', 'macOS', 'Linux'],
    },
    {
      key: 'devices' as const,
      label: 'Primary Devices',
      icon: Smartphone,
      options: ['Smartphone', 'Laptop', 'Desktop PC', 'Tablet', 'Smart Home / IoT'],
    },
    {
      key: 'browsers' as const,
      label: 'Web Browsers',
      icon: Globe,
      options: ['Chrome', 'Firefox', 'Safari', 'Edge', 'Brave', 'Opera'],
    },
    {
      key: 'emailProviders' as const,
      label: 'Email Providers',
      icon: Mail,
      options: ['Gmail', 'Outlook', 'ProtonMail', 'Yahoo', 'iCloud Mail', 'Custom Domain'],
    },
    {
      key: 'socialMedia' as const,
      label: 'Social Media Apps',
      icon: Share2,
      options: ['Instagram', 'WhatsApp', 'Facebook', 'TikTok', 'X / Twitter', 'LinkedIn', 'Telegram', 'Snapchat'],
    },
    {
      key: 'onlineServices' as const,
      label: 'Online Services & Financial Categories',
      icon: Server,
      options: ['Google Workspace', 'AWS / Cloud Services', 'iCloud', 'Digital Banking', 'Crypto Wallets', 'PayPal / Payment Apps'],
    },
  ];

  const roles = [
    'Everyday User',
    'Student',
    'Professional',
    'Business Owner',
    'Developer',
    'Cybersecurity Learner',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <GlassCard className="max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-6 border-brand-blue/30 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Digital Safety Profile
                <Badge type="productStatus" value="LOCAL ONLY" size="sm" />
              </h2>
              <p className="text-xs text-gray-400">
                Select your devices, apps, and services to customize your "Does This Affect Me?" personal relevance engine.
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-brand-cyan">
            Select Your Primary User Archetype
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {roles.map((r) => {
              const active = profile.userRole === r;
              return (
                <button
                  key={r}
                  onClick={() => updateProfile({ userRole: r as any })}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    active
                      ? 'bg-brand-blue/30 border-brand-cyan text-brand-cyan shadow-glowBlue'
                      : 'bg-darkBg-panel/60 border-gray-800 text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories Selection */}
        <div className="flex flex-col gap-6">
          {categories.map(({ key, label, icon: Icon, options }) => {
            const selectedList = profile[key] as string[];
            return (
              <div key={key} className="flex flex-col gap-2 bg-darkBg-panel/40 p-4 rounded-xl border border-gray-800/80">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-gray-300">
                  <Icon className="w-4 h-4 text-brand-cyan" />
                  <span>{label}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {options.map((opt) => {
                    const isSelected = selectedList.includes(opt);
                    return (
                      <button
                        key={opt}
                        onClick={() => toggleItem(key, opt)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30 border border-brand-cyan'
                            : 'bg-gray-900/80 text-gray-400 border border-gray-800 hover:text-gray-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-gray-800 pt-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Check className="w-4 h-4" /> Saved automatically in browser LocalStorage. Zero telemetry.
          </span>
          <button
            onClick={closeModal}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white font-bold hover:shadow-glowBlue transition-all"
          >
            Apply Profile & Close
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
