import React, { useState, useEffect } from 'react';
import { Image, Video, Mic, ShieldAlert, ShieldCheck, HelpCircle, Clock, ArrowRight, ExternalLink, Inbox } from 'lucide-react';
import { motion } from 'framer-motion';
import { getScanHistory } from '../services/api';

export default function RecentScansList({ onSelectScan, refreshTrigger, onGoToStudio }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await getScanHistory(0, 5);
        if (res && res.content) {
          setHistory(res.content);
        }
      } catch (err) {
        console.warn('History fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, [refreshTrigger]);

  const getMediaIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'VIDEO': return <Video className="w-4 h-4 text-indigo-400" />;
      case 'AUDIO': return <Mic className="w-4 h-4 text-purple-400" />;
      default: return <Image className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getVerdictBadge = (verdict) => {
    switch (verdict?.toUpperCase()) {
      case 'DEEPFAKE':
        return (
          <span className="badge-tech badge-deepfake">
            <ShieldAlert className="w-3 h-3" /> DEEPFAKE
          </span>
        );
      case 'REAL':
      case 'AUTHENTIC':
        return (
          <span className="badge-tech badge-authentic">
            <ShieldCheck className="w-3 h-3" /> AUTHENTIC
          </span>
        );
      default:
        return (
          <span className="badge-tech badge-suspicious">
            <HelpCircle className="w-3 h-3" /> SUSPICIOUS
          </span>
        );
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      
      {/* Section Header with Scroll Reveal */}
      <motion.div 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4"
      >
        <div>
          <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest block mb-1">
            IMMUTABLE AUDIT TRAIL
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
            Recent Forensic Analyses
          </h2>
        </div>
        <p className="text-xs text-slate-400 font-mono-tech">
          PERSISTED IN MYSQL • RECENT 5 SCANS
        </p>
      </motion.div>

      {loading ? (
        <div className="glass-card p-12 text-center text-slate-400 font-mono-tech text-xs">
          <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Querying MySQL scan records...
        </div>
      ) : history.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card p-12 text-center flex flex-col items-center justify-center rounded-3xl"
        >
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4 shadow-inner">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-base font-heading font-bold text-white mb-1">No Scans Recorded Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mb-6 font-sans">
            Your media forensic audit ledger is clean. Use the AI Detection Studio to run your first deepfake inspection.
          </p>
          <button
            onClick={onGoToStudio}
            className="btn-cyber-primary text-xs py-2.5 px-5 cursor-pointer"
          >
            <span>Launch Detection Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.97, y: 35 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel overflow-hidden border-slate-800 rounded-3xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-mono-tech text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Target Media</th>
                  <th className="py-3.5 px-4">Modality</th>
                  <th className="py-3.5 px-4">Forensic Verdict</th>
                  <th className="py-3.5 px-4">Confidence</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-5 text-right">Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans text-xs">
                {history.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-slate-900/60 transition-colors group cursor-pointer font-mono-tech"
                    onClick={() => onSelectScan && onSelectScan(record)}
                  >
                    <td className="py-4 px-5 font-semibold text-white font-sans">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                          {getMediaIcon(record.mediaType)}
                        </div>
                        <span className="max-w-[200px] truncate">{record.filename}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-300">
                      {record.mediaType}
                    </td>

                    <td className="py-4 px-4">
                      {getVerdictBadge(record.verdict)}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">{record.confidenceScore}%</span>
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className={`h-full rounded-full ${
                              record.verdict === 'DEEPFAKE' ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${record.confidenceScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-400 text-[11px]">
                      {record.createdAt ? new Date(record.createdAt).toLocaleString() : 'Just now'}
                    </td>

                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectScan) onSelectScan(record);
                        }}
                        className="p-1.5 rounded-lg bg-slate-900 text-slate-400 group-hover:text-cyan-300 group-hover:border-cyan-500/40 border border-slate-800 transition-all cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

    </section>
  );
}
