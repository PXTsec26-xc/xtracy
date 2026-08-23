import React from 'react';
import { DataTrustInfo, DataTrustStatus } from '@/types';
import { ShieldCheck, Database, RefreshCw, AlertCircle, Info } from 'lucide-react';

interface DataTrustBadgeProps {
  trustInfo?: DataTrustInfo;
  status?: DataTrustStatus;
  sourceName?: string;
  className?: string;
  showDetails?: boolean;
}

export const DataTrustBadge: React.FC<DataTrustBadgeProps> = ({
  trustInfo,
  status = 'LIVE',
  sourceName,
  className = '',
  showDetails = false,
}) => {
  const currentStatus = trustInfo?.status || status;
  const source = trustInfo?.sourceName || sourceName || 'XTRACY Verified Source';

  let colorStyle = 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
  let dotColor = 'bg-emerald-400';
  let Icon = ShieldCheck;

  if (currentStatus === 'CACHED') {
    colorStyle = 'bg-cyan-950/80 text-cyan-400 border-cyan-800/80';
    dotColor = 'bg-cyan-400';
    Icon = Database;
  } else if (currentStatus === 'FALLBACK') {
    colorStyle = 'bg-amber-950/80 text-amber-400 border-amber-800/80';
    dotColor = 'bg-amber-400';
    Icon = AlertCircle;
  } else if (currentStatus === 'DEMO') {
    colorStyle = 'bg-sky-950/80 text-sky-400 border-sky-800/80';
    dotColor = 'bg-sky-400';
    Icon = Info;
  }

  return (
    <div className={`inline-flex flex-col gap-1 ${className}`}>
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase border backdrop-blur-md transition-all ${colorStyle}`}
        title={`Data Trust Level: ${currentStatus} (${source})`}
      >
        <span className={`w-2 h-2 rounded-full ${dotColor} animate-pulse`} />
        <Icon className="w-3 h-3" />
        <span>{currentStatus}</span>
      </span>

      {showDetails && (
        <span className="text-[10px] text-gray-400 flex items-center gap-1">
          <span>Source: {source}</span>
          {trustInfo?.lastRefreshed && (
            <span>• Refreshed {new Date(trustInfo.lastRefreshed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          )}
        </span>
      )}
    </div>
  );
};
