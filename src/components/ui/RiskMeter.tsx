import React from 'react';

interface RiskMeterProps {
  score: number; // 0 to 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ score, riskLevel }) => {
  let color = 'from-emerald-500 to-teal-400';
  let text = 'text-emerald-400';
  if (riskLevel === 'HIGH') {
    color = 'from-red-600 to-orange-500';
    text = 'text-red-400';
  } else if (riskLevel === 'MEDIUM') {
    color = 'from-amber-500 to-yellow-400';
    text = 'text-amber-400';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Outer Ring */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-800"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="url(#riskGradient)"
            strokeWidth="8"
            strokeDasharray={263.89}
            strokeDashoffset={263.89 - (263.89 * score) / 100}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              {riskLevel === 'HIGH' ? (
                <>
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#F97316" />
                </>
              ) : riskLevel === 'MEDIUM' ? (
                <>
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#EAB308" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#00F5D4" />
                </>
              )}
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center text-center">
          <span className={`text-3xl font-black ${text}`}>{score}</span>
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            Risk Score
          </span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
          riskLevel === 'HIGH' ? 'bg-red-950/80 text-red-400 border-red-800' :
          riskLevel === 'MEDIUM' ? 'bg-amber-950/80 text-amber-400 border-amber-800' :
          'bg-emerald-950/80 text-emerald-400 border-emerald-800'
        }`}>
          {riskLevel} RISK LEVEL
        </span>
      </div>
    </div>
  );
};
