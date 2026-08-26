import React from 'react';
import { IncidentFlowAccordion } from '@/components/emergency/IncidentFlowAccordion';
import { IndiaEmergencyCenter } from '@/components/emergency/IndiaEmergencyCenter';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'I Think I Have Been Hacked — Cyber Emergency Response Center | XTRACY',
};

export default function EmergencyPage() {
  return (
    <div className="flex flex-col gap-10 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            Cyber Emergency Response Center (&quot;I Think I&apos;ve Been Hacked&quot;)
          </h1>
          <Badge type="productStatus" value="WORKING TRIAGE" size="sm" />
        </div>
        <p className="text-xs text-gray-400">
          Immediate India national emergency numbers (112, 181, 100, 1930) and structured decision flows for account compromise, malware, and extortion.
        </p>
      </div>

      {/* India Emergency Response Contact Center (Priority 1) */}
      <IndiaEmergencyCenter />

      {/* Interactive Incident Triage Scenarios */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Interactive Incident Triage & Recovery Flows
        </h2>
        <IncidentFlowAccordion />
      </section>
    </div>
  );
}
