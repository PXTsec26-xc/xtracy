import React from 'react';
import { StorageStatus } from '@/lib/server/models';
import { HardDrive, Laptop, Clock, ServerOff } from 'lucide-react';

interface DataStorageBadgeProps {
  status: StorageStatus;
  className?: string;
  showText?: boolean;
}

export const DataStorageBadge: React.FC<DataStorageBadgeProps> = ({
  status = 'LOCAL',
  className = '',
  showText = true,
}) => {
  let style = 'bg-cyan-950/80 text-cyan-400 border-cyan-800/80';
  let dotColor = 'bg-cyan-400';
  let Icon = Laptop;
  let label = 'LOCAL STORAGE';

  if (status === 'PERSISTENT') {
    style = 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
    dotColor = 'bg-emerald-400';
    Icon = HardDrive;
    label = 'PERSISTENT DB';
  } else if (status === 'TEMPORARY') {
    style = 'bg-amber-950/80 text-amber-400 border-amber-800/80';
    dotColor = 'bg-amber-400';
    Icon = Clock;
    label = 'SESSION ONLY';
  } else if (status === 'UNAVAILABLE') {
    style = 'bg-red-950/80 text-red-400 border-red-800/80';
    dotColor = 'bg-red-400';
    Icon = ServerOff;
    label = 'UNAVAILABLE';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase border backdrop-blur-md transition-all ${style} ${className}`}
      title={`Data Persistence Level: ${status}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <Icon className="w-3 h-3" />
      {showText && <span>{label}</span>}
    </span>
  );
};
