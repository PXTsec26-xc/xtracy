'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/store/useAuthStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataStorageBadge } from '@/components/ui/DataStorageBadge';
import { Building2, Users, Briefcase, Lock, ShieldCheck } from 'lucide-react';

export default function OrganizationPage() {
  const { token } = useAuthStore();
  const [org, setOrg] = useState<any | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch('/api/organization', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setOrg(data.data);
      })
      .catch(() => {});
  }, [token]);

  return (
    <ProtectedRoute
      fallbackTitle="Sign In for Organization Mode"
      fallbackDescription="Access team cybersecurity dashboards, organization investigation cases, and member role management."
    >
      <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl font-black text-white flex items-center gap-2">
                <Building2 className="w-8 h-8 text-brand-cyan" />
                XTRACY Workspace Mode (UI Preview)
              </h1>
              <Badge type="productStatus" value="UI PREVIEW" size="sm" />
            </div>
            <DataStorageBadge status="TEMPORARY" />
          </div>
          <p className="text-xs text-gray-400">
            Interactive UI preview demonstrating role-based workspace views (Owner, Admin, Analyst, Viewer). XTRACY is independently developed and operated by sole founder Elliot (PhantomXTrace / PXT); sample seats shown here are illustrative UI placeholders, not an actual registered organization or workforce.
          </p>
        </div>

        {org && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-6 border-brand-blue/30 flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-brand-cyan uppercase font-mono font-bold">
                  {org.isolatedTenantId}
                </span>
                <h3 className="text-lg font-bold text-white">{org.name}</h3>
                <span className="text-xs text-gray-400 font-semibold">Your Role: {org.role}</span>
              </div>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-800">
                <span className="text-gray-400">Members: {org.membersCount}</span>
                <span className="text-gray-400">Cases: {org.casesCount}</span>
              </div>
            </GlassCard>

            {/* Sample Role Preview */}
            <GlassCard className="md:col-span-2 p-6 border-gray-800 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-brand-cyan flex items-center gap-2">
                <Users className="w-4 h-4" /> Sample Role Seats (UI Preview)
              </h3>
              <p className="text-[11px] text-amber-300/90 bg-amber-950/30 border border-amber-800/50 rounded-lg px-3 py-2">
                Preview notice: XTRACY is built and operated by sole founder Elliot (PhantomXTrace / PXT). No external employees or multi-member organization accounts exist in this workspace.
              </p>

              <div className="flex flex-col gap-2 text-xs">
                {org.members?.map((m: any) => (
                  <div key={m.id} className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex items-center justify-between">
                    <div>
                      <strong className="text-white block">{m.name}</strong>
                      <span className="text-[11px] text-gray-400">{m.email}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-brand-blue/20 text-brand-cyan font-bold text-[10px] border border-brand-cyan/40">
                      PREVIEW ROLE: {m.role}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
