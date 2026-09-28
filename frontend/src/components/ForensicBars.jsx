import React from 'react';
import { Layers, Activity, Eye, Sliders, ShieldAlert, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForensicBars({ metrics }) {
  if (!metrics) return null;

  const items = [
    {
      label: 'Error Level Analysis (ELA)',
      desc: 'JPEG resave compression anomaly disparity',
      val: metrics.errorLevelAnalysisScore ?? 25.0,
      icon: Activity,
    },
    {
      label: 'Boundary Blend Seam',
      desc: 'Laplacian edge gradient discontinuity at facial contour',
      val: metrics.boundaryBlendScore ?? 20.0,
      icon: Layers,
    },
    {
      label: 'Frequency Artifacts (DCT/FFT)',
      desc: 'High-frequency grid noise typical of GAN/Diffusion synthesis',
      val: metrics.frequencyArtifactScore ?? 22.0,
      icon: Sparkles,
    },
    {
      label: 'Chrominance Inconsistency',
      desc: 'Color space channel divergence across facial pixels',
      val: metrics.colorInconsistencyScore ?? 18.0,
      icon: Sliders,
    },
    {
      label: 'Texture Noise Variance',
      desc: 'Over-smoothing or synthetic hyper-noise in dermal texture',
      val: metrics.textureNoiseVariance ?? 20.0,
      icon: ShieldAlert,
    },
    {
      label: 'Ocular Symmetry Deviation',
      desc: 'Pupil reflectometry and inter-orbital luminance deviation',
      val: metrics.eyeSymmetryScore ?? 15.0,
      icon: Eye,
    },
  ];

  const getBarColor = (score) => {
    if (score >= 60) return 'from-rose-500 to-red-600';
    if (score >= 35) return 'from-amber-400 to-yellow-500';
    return 'from-emerald-400 to-teal-500';
  };

  const getTextColor = (score) => {
    if (score >= 60) return 'text-rose-400';
    if (score >= 35) return 'text-amber-400';
    return 'text-emerald-400';
  };

  return (
    <div className="space-y-4 font-mono-tech">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          6-LAYER FORENSIC COMPUTER VISION SIEVE
        </span>
        <span className="text-[10px] text-slate-500">ANOMALY SCORE</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {items.map((item, idx) => {
          const Icon = item.icon;
          const score = Math.max(0, Math.min(100, item.val));
          return (
            <div key={item.label} className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 hover:border-cyan-500/30 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs font-semibold text-slate-200">{item.label}</span>
                </div>
                <span className={`text-xs font-bold ${getTextColor(score)}`}>
                  {score.toFixed(1)}%
                </span>
              </div>

              <p className="text-[10px] text-slate-400 font-sans mb-2 leading-tight">
                {item.desc}
              </p>

              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  className={`h-full rounded-full bg-gradient-to-r ${getBarColor(score)}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
