'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataTrustBadge } from '@/components/ui/DataTrustBadge';
import { DbSecurityAlert } from '@/lib/server/models';
import { Bell, ShieldAlert, CheckCircle2, Calendar, Radio } from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<DbSecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/alerts')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAlerts(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Bell className="w-8 h-8 text-amber-400 animate-pulse" />
              Notification & In-App Alert Center
            </h1>
            <Badge type="productStatus" value="LIVE BROADCAST" size="sm" />
          </div>
          <DataTrustBadge status="LIVE" sourceName="XTRACY Alert Broadcast" />
        </div>
        <p className="text-xs text-gray-400">
          Critical cybersecurity warnings, CISA KEV vulnerability alerts, smishing campaign advisories, and system notifications.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs text-gray-400">Fetching latest alerts...</div>
      ) : (
        <div className="flex flex-col gap-4">
          {alerts.map((alt) => (
            <GlassCard key={alt.id} className="p-6 border-amber-500/30 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <div className="flex items-center gap-2">
                  <Badge type="risk" value={alt.severity} size="sm" />
                  <h3 className="text-base font-bold text-white">{alt.title}</h3>
                </div>
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(alt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <p className="text-xs text-gray-200 leading-relaxed">{alt.message}</p>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
