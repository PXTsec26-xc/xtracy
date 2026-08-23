'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/store/useAuthStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataStorageBadge } from '@/components/ui/DataStorageBadge';
import { FootprintItem } from '@/app/api/footprint/route';
import { Globe, Plus, CheckSquare, Square, Trash2, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function DigitalFootprintPage() {
  const { token } = useAuthStore();
  const [items, setItems] = useState<FootprintItem[]>([]);
  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState<any>('Social Media');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch('/api/footprint', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setItems(data.data);
      })
      .catch(() => {});
  }, [token]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName || !token) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/footprint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ serviceName, category, exposureRisk: 'MEDIUM' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setItems([data.data, ...items]);
        setServiceName('');
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCheck = (footprintId: string, taskIdx: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === footprintId) {
          const updated = [...item.privacyChecklist];
          updated[taskIdx].done = !updated[taskIdx].done;
          return { ...item, privacyChecklist: updated };
        }
        return item;
      })
    );
  };

  return (
    <ProtectedRoute fallbackTitle="Sign In for Digital Footprint Tracker" fallbackDescription="Track your voluntary online accounts, audit public privacy exposure, and complete privacy checklists.">
      <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black text-white flex items-center gap-2">
                <Globe className="w-8 h-8 text-brand-cyan" />
                Digital Footprint & Privacy Exposure Tracker
              </h1>
              <Badge type="productStatus" value="VOLUNTARY & PRIVATE" size="sm" />
            </div>
            <DataStorageBadge status="PERSISTENT" />
          </div>
          <p className="text-xs text-gray-400">
            Audit voluntarily tracked online accounts, remove unnecessary public oversharing, and complete account cleanup checklists.
          </p>
        </div>

        {/* Add Account Form */}
        <GlassCard className="p-6 border-brand-blue/30 shadow-2xl flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-brand-cyan">
            Track Online Service or Account
          </h3>

          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 text-xs">
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="e.g. LinkedIn, Amazon, Paytm, Netflix..."
              className="flex-1 px-4 py-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white placeholder-gray-500 text-xs focus:border-brand-cyan"
              required
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="px-4 py-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs"
            >
              <option value="Social Media">Social Media</option>
              <option value="Email Provider">Email Provider</option>
              <option value="Digital Banking">Digital Banking</option>
              <option value="Cloud Storage">Cloud Storage</option>
              <option value="Other">Other Service</option>
            </select>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Track Account</span>
            </button>
          </form>
        </GlassCard>

        {/* Tracked Footprint List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((fp) => (
            <GlassCard key={fp.id} className="p-6 border-gray-800 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white">{fp.serviceName}</h3>
                  <span className="text-[11px] text-brand-cyan">{fp.category}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                  fp.exposureRisk === 'HIGH' ? 'bg-red-950/80 text-red-400 border-red-800' : 'bg-amber-950/80 text-amber-400 border-amber-800'
                }`}>
                  Risk: {fp.exposureRisk}
                </span>
              </div>

              <div className="flex flex-col gap-2 text-xs">
                <span className="font-bold text-gray-300 uppercase text-[10px]">Privacy & Account Hygiene Checklist:</span>
                {fp.privacyChecklist.map((task, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleCheck(fp.id, idx)}
                    className="flex items-start gap-2 text-left p-2.5 rounded-lg bg-darkBg-panel/60 border border-gray-800 hover:border-brand-cyan/40 transition-all"
                  >
                    {task.done ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                    )}
                    <span className={task.done ? 'line-through text-gray-500' : 'text-gray-200'}>
                      {task.task}
                    </span>
                  </button>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
