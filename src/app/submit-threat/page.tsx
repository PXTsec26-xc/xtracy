import React from 'react';
import { CommunitySubmissionForm } from '@/components/feed/CommunitySubmissionForm';
import { Badge } from '@/components/ui/Badge';
import { ShieldAlert, Users } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Report Suspicious Threat or Scam | XTRACY Community Defense',
};

export default function SubmitThreatPage() {
  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <ShieldAlert className="w-8 h-8 text-amber-400" />
              Community Threat & Scam Submission
            </h1>
            <Badge type="productStatus" value="COMMUNITY POWERED" size="sm" />
          </div>
          <Link
            href="/community-feed"
            className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-brand-cyan hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Browse Community Directory</span>
          </Link>
        </div>
        <p className="text-xs text-gray-400">
          Report suspicious URLs, phishing emails, smishing SMS text, fake social accounts, or deepfakes to protect the community.
        </p>
      </div>

      <CommunitySubmissionForm />
    </div>
  );
}
