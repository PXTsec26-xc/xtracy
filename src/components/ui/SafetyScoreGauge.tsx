import React from 'react';

interface SafetyScoreGaugeProps {
  score: number; // 0 to 100
  status: 'Safe' | 'Caution' | 'High Risk';
}

export const SafetyScoreGauge: React.FC<SafetyScoreGaugeProps> = ({ score, status }) => {
  let statusColor = 'text-red-400 bg-red-950/80 border-red-800';
  if (status === 'Safe') {
    statusColor = 'text-emerald-400 bg-emerald-950/80 border-emerald-800';
  } else if (status === 'Caution') {
    statusColor = 'text-amber-400 bg-amber-950/80 border-amber-800';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="9"
            className="text-gray-800/80"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="url(#scoreGradient)"
            strokeWidth="9"
            strokeDasharray={251.32}
            strokeDashoffset={251.32 - (251.32 * score) / 100}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              {status === 'Safe' ? (
                <>
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#00F5D4" />
                </>
              ) : status === 'Caution' ? (
                <>
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#EAB308" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#F97316" />
                </>
              )}
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute flex flex-col items-center text-center">
          <span className="text-4xl font-black text-white tracking-tight">{score}</span>
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            Preparedness
          </span>
        </div>
      </div>

      <div className="mt-3">
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
          SAFETY STATUS: {status.toUpperCase()}
        </span>
      </div>
    </div>
  );
};
