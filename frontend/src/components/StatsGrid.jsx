import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, FileSearch, Target, AlertTriangle, Sparkles, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { getDashboardStats } from '../services/api';
import AnimatedCounter from './AnimatedCounter';

export default function StatsGrid({ refreshTrigger }) {
  const [stats, setStats] = useState({
    totalScans: 0,
    totalDeepfakes: 0,
    totalReals: 0,
    totalSuspicious: 0,
    deepfakePercentage: 0.0,
    averageConfidence: 0.0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        if (data) {
          setStats({
            totalScans: data.totalScans || 0,
            totalDeepfakes: data.totalDeepfakes || 0,
            totalReals: data.totalReals || 0,
            totalSuspicious: data.totalSuspicious || 0,
            deepfakePercentage: data.deepfakePercentage || 0.0,
            averageConfidence: data.averageConfidence || 0.0,
          });
        }
      } catch (err) {
        console.warn('Dashboard stats error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [refreshTrigger]);

  const statCards = [
    {
      label: 'TOTAL SCANS',
      rawValue: stats.totalScans,
      isPercentage: false,
      decimals: 0,
      subtext: 'Cumulative Media Ingested',
      icon: FileSearch,
      gradient: 'from-cyan-500/20 to-blue-500/10',
      border: 'border-cyan-500/30',
      textGrad: 'text-cyan-400',
    },
    {
      label: 'REAL MEDIA',
      rawValue: stats.totalReals,
      isPercentage: false,
      decimals: 0,
      subtext: 'Verified Organic Media',
      icon: ShieldCheck,
      gradient: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/30',
      textGrad: 'text-emerald-400',
    },
    {
      label: 'DEEPFAKES',
      rawValue: stats.totalDeepfakes,
      isPercentage: false,
      decimals: 0,
      subtext: `${stats.deepfakePercentage}% Threat Ratio`,
      icon: ShieldAlert,
      gradient: 'from-rose-500/20 to-red-500/10',
      border: 'border-rose-500/30',
      textGrad: 'text-rose-400',
    },
    {
      label: 'SUSPICIOUS',
      rawValue: stats.totalSuspicious,
      isPercentage: false,
      decimals: 0,
      subtext: 'Requires Analyst Review',
      icon: AlertTriangle,
      gradient: 'from-amber-500/20 to-yellow-500/10',
      border: 'border-amber-500/30',
      textGrad: 'text-amber-400',
    },
    {
      label: 'AVG CONFIDENCE',
      rawValue: stats.averageConfidence,
      isPercentage: true,
      decimals: 1,
      subtext: 'In-Process Neural Precision',
      icon: Target,
      gradient: 'from-indigo-500/20 to-purple-500/10',
      border: 'border-indigo-500/30',
      textGrad: 'text-indigo-400',
    },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header with Scroll Reveal */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4"
      >
        <div>
          <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest block mb-1">
            TELEMETRY & AUDIT METRICS
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
            Forensic Intelligence Overview
          </h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono-tech text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>MYSQL REPOSITORY • REAL-TIME</span>
        </div>
      </motion.div>

      {/* 5-Card Staggered Reveal Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, scale: 0.96, y: 35 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              whileHover={{ y: -5, scale: 1.01 }}
              className={`glass-card p-5 flex flex-col justify-between h-44 relative overflow-hidden group rounded-2xl ${card.border}`}
            >
              {/* Card Ambient Glow */}
              <div className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-gradient-to-br ${card.gradient} blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none`} />

              {/* Card Top Row: Label + Icon */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono-tech font-bold text-slate-400 uppercase tracking-wider">
                  {card.label}
                </span>
                <div className={`w-8 h-8 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center ${card.textGrad} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Card Value (Hero Metric Counter) */}
              <div className="my-1">
                <h3 className={`text-2xl sm:text-3xl font-extrabold font-heading tracking-tight ${card.textGrad}`}>
                  <AnimatedCounter 
                    value={card.rawValue} 
                    isPercentage={card.isPercentage}
                    decimals={card.decimals}
                    duration={1.4}
                  />
                </h3>
              </div>

              {/* Card Subtext */}
              <div className="flex items-center gap-1.5 text-[10px] font-mono-tech text-slate-400 pt-2 border-t border-slate-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-cyan-400 transition-colors" />
                <span className="truncate">{card.subtext}</span>
              </div>

            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
