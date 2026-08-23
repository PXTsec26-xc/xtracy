import React from 'react';
import { InteractiveThreatMap } from '@/components/threat-map/InteractiveThreatMap';
import { Badge } from '@/components/ui/Badge';
import { Globe } from 'lucide-react';

export const metadata = {
  title: 'Global Cyber Incident Map & Timeline | XTRACY',
};

export default function ThreatMapPage() {
  return (
    <div className="flex flex-col gap-8 animate-fadeIn">
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Globe className="w-8 h-8 text-brand-cyan animate-spin-slow" />
            Global Cyber Incident Map & Timeline
          </h1>
          <Badge type="productStatus" value="DEMO / SAMPLE DATA" size="sm" />
        </div>
        <p className="text-xs text-gray-400">
          Visual intelligence grid tracking global security incidents, breaches, and vulnerability disclosures.
        </p>
      </div>

      <InteractiveThreatMap />
    </div>
  );
}
