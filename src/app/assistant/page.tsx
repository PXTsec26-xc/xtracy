import React, { Suspense } from 'react';
import { AISecurityAssistant } from '@/components/assistant/AISecurityAssistant';
import { Badge } from '@/components/ui/Badge';
import { Sparkles } from 'lucide-react';

export const metadata = {
  title: 'XTRACY AI Security Assistant — Cyber Safety AI Guide',
};

export default function AssistantPage() {
  return (
    <div className="flex flex-col gap-8 animate-fadeIn">
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-brand-cyan" />
            XTRACY AI Security Assistant
          </h1>
          <Badge type="productStatus" value="DEFENSIVE AI COPILOT" size="sm" />
        </div>
        <p className="text-xs text-gray-400">
          Interactive defensive copilot for interpreting tool findings, diagnosing security headers, explaining DNS records, and guiding incident recovery.
        </p>
      </div>

      <Suspense fallback={<div className="p-8 text-center text-xs text-gray-400">Loading XTRACY AI Copilot...</div>}>
        <AISecurityAssistant />
      </Suspense>
    </div>
  );
}
