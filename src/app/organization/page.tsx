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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black text-white flex items-center gap-2">
                <Building2 className="w-8 h-8 text-brand-cyan" />
                XTRACY for Organizations
              </h1>
              <Badge type="productStatus" value="STRICT TENANT ISOLATION" size="sm" />
            </div>
            <DataStorageBadge status="PERSISTENT" />
          </div>
          <p className="text-xs text-gray-400">
            Team threat management, member role-based access control (Owner, Admin, Analyst, Viewer), and organization case privacy.
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

            {/* Member Management */}
            <GlassCard className="md:col-span-2 p-6 border-gray-800 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-brand-cyan flex items-center gap-2">
                <Users className="w-4 h-4" /> Team Member Roster & Role Permissions
              </h3>

              <div className="flex flex-col gap-2 text-xs">
                {org.members?.map((m: any) => (
                  <div key={m.id} className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex items-center justify-between">
                    <div>
                      <strong className="text-white block">{m.name}</strong>
                      <span className="text-[11px] text-gray-400">{m.email}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-brand-blue/20 text-brand-cyan font-bold text-[10px] border border-brand-cyan/40">
                      ROLE: {m.role}
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
