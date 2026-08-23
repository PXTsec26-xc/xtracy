import React from 'react';
import { ScamAnalyzerForm } from '@/components/scam/ScamAnalyzerForm';
import { Badge } from '@/components/ui/Badge';
import { Search } from 'lucide-react';

export const metadata = {
  title: 'XTRACY Scam Check — Suspicious Content Analyzer',
};

export default function ScanPage() {
  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-4xl mx-auto">
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Search className="w-7 h-7 text-brand-cyan" />
            Quick Scan Center (XTRACY Scam Check)
          </h1>
          <Badge type="productStatus" value="WORKING" size="sm" />
        </div>
        <p className="text-xs text-gray-400">
          Paste suspicious URLs, SMS text, or emails to detect urgency traps, phishing signatures, and credential harvesting patterns.
        </p>
      </div>

      <ScamAnalyzerForm />
    </div>
  );
}
