import React from 'react';
import { motion } from 'framer-motion';

export default function GaugeChart({ probability = 0, verdict = 'REAL' }) {
  const clamped = Math.max(0, Math.min(100, probability));
  const rotation = (clamped / 100) * 180 - 90;

  const getColor = () => {
    if (clamped >= 60) return { stroke: '#ff2e63', fill: 'rgba(255, 46, 99, 0.15)', text: 'text-rose-400' };
    if (clamped >= 35) return { stroke: '#fbbf24', fill: 'rgba(251, 191, 36, 0.15)', text: 'text-amber-400' };
    return { stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.15)', text: 'text-emerald-400' };
  };

  const colors = getColor();

  return (
    <div className="flex flex-col items-center justify-center p-4 relative select-none">
      <div className="relative w-48 h-28 flex items-center justify-center overflow-hidden">
        
        {/* SVG Semi-Circle Dial */}
        <svg className="w-48 h-48 -rotate-180 transform absolute top-0" viewBox="0 0 200 200">
          
          {/* Track Background */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#1e293b"
            strokeWidth="16"
            strokeDasharray="251.2"
            strokeDashoffset="125.6"
            strokeLinecap="round"
          />

          {/* Active Gradient Meter */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke={colors.stroke}
            strokeWidth="16"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (clamped / 100) * 125.6}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${colors.stroke})`,
            }}
          />
        </svg>

        {/* Center Digital Value */}
        <div className="absolute bottom-2 flex flex-col items-center">
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-3xl font-extrabold font-heading ${colors.text}`}
          >
            {clamped.toFixed(1)}%
          </motion.span>
          <span className="text-[10px] font-mono-tech text-slate-400 uppercase tracking-wider">
            SYNTHETIC PROBABILITY
          </span>
        </div>

      </div>

      {/* Dial Legend */}
      <div className="w-full flex justify-between px-3 text-[10px] font-mono-tech text-slate-500 mt-1">
        <span className="text-emerald-400">0% (AUTHENTIC)</span>
        <span className="text-amber-400">50%</span>
        <span className="text-rose-400">100% (DEEPFAKE)</span>
      </div>
    </div>
  );
}
