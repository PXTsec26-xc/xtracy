import React from 'react';
import { RiskLevel, RelevanceLevel, ConfidenceLevel } from '@/types';
import { ShieldCheck, AlertTriangle, AlertOctagon, Info, CheckCircle2 } from 'lucide-react';

interface BadgeProps {
  label?: string;
  type?: 'risk' | 'relevance' | 'confidence' | 'productStatus';
  value?: RiskLevel | RelevanceLevel | ConfidenceLevel | 'WORKING' | 'DEMO DATA' | 'LOCAL ONLY' | string;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  type = 'risk',
  value = 'LOW',
  size = 'md',
  className = '',
}) => {
  let colorStyle = 'bg-gray-800 text-gray-300 border-gray-700';
  let Icon = Info;

  const valStr = String(value).toUpperCase();

  if (valStr === 'CRITICAL' || valStr === 'HIGH' || valStr === 'HIGH RISK' || valStr === 'URGENT') {
    colorStyle = 'bg-red-950/70 text-red-400 border-red-800/60 shadow-[0_0_12px_rgba(239,68,68,0.25)]';
    Icon = AlertOctagon;
  } else if (valStr === 'MEDIUM' || valStr === 'CAUTION' || valStr === 'IMPORTANT' || valStr === 'POSSIBLY RELEVANT' || valStr === 'DEVELOPING') {
    colorStyle = 'bg-amber-950/70 text-amber-400 border-amber-800/60';
    Icon = AlertTriangle;
  } else if (valStr === 'LOW' || valStr === 'SAFE' || valStr === 'WORKING' || valStr === 'OFFICIALLY CONFIRMED' || valStr === 'VERIFIED' || valStr === 'NOT RELEVANT') {
    colorStyle = 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60';
    Icon = CheckCircle2;
  } else if (valStr === 'DEMO DATA' || valStr === 'DEMO') {
    colorStyle = 'bg-sky-950/70 text-sky-400 border-sky-800/60';
    Icon = ShieldCheck;
  } else if (valStr === 'LOCAL ONLY') {
    colorStyle = 'bg-purple-950/70 text-purple-400 border-purple-800/60';
    Icon = Info;
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md transition-all ${padding} ${colorStyle} ${className}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {label ? `${label}: ${value}` : value}
    </span>
  );
};
