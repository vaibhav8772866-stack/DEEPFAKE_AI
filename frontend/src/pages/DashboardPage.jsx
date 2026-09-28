import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ShieldAlert, Activity, TrendingUp, Cpu, Database, 
  RefreshCw, Layers, Zap, ArrowUpRight, FileSearch, Filter, Search,
  Image, Video, Mic, Calendar, Target, AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getDashboardStats, getScanHistory } from '../services/api';
import StatsGrid from '../components/StatsGrid';

export default function DashboardPage({ onGoToStudio }) {
  const [stats, setStats] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [tableSearch, setTableSearch] = useState('');
  const [tableFilter, setTableFilter] = useState('ALL');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [sData, hData] = await Promise.all([
          getDashboardStats().catch(() => null),
          getScanHistory(0, 10).catch(() => ({ content: [] }))
        ]);
        setStats(sData);
        setRecentScans(hData?.content || []);
      } catch (e) {
        console.warn('Dashboard fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [refreshKey]);

  const totalScans = stats?.totalScans || 0;
  const reals = stats?.totalReals || 0;
  const deepfakes = stats?.totalDeepfakes || 0;
  const suspicious = stats?.totalSuspicious || 0;

  const realPct = totalScans > 0 ? ((reals / totalScans) * 100).toFixed(1) : '0.0';
  const fakePct = totalScans > 0 ? ((deepfakes / totalScans) * 100).toFixed(1) : '0.0';
  const suspPct = totalScans > 0 ? ((suspicious / totalScans) * 100).toFixed(1) : '0.0';

  const filteredScans = recentScans.filter(s => {
    const matchesFilter = tableFilter === 'ALL' || s.verdict?.toUpperCase() === tableFilter;
    const matchesSearch = !tableSearch || s.filename?.toLowerCase().includes(tableSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest block mb-1">
            EXECUTIVE CYBER FORENSICS PLATFORM
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
            Security Intelligence <span className="text-gradient">Dashboard</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 text-xs font-mono-tech flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync MySQL Telemetry</span>
          </button>
          
          <button
            onClick={onGoToStudio}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <span>Launch Studio</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5-Card Statistics Grid */}
      <StatsGrid refreshTrigger={refreshKey} />

      {/* Analytics Row: Authenticity & Modality */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Authenticity Distribution (7 Cols) */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-3xl border border-slate-800/80 bg-slate-900/50 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-heading font-bold text-white">Authenticity Distribution</h3>
              <p className="text-xs text-slate-400 font-mono-tech mt-0.5">FORENSIC VERDICT BREAKDOWN</p>
            </div>
            <span className="text-xs font-mono-tech px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-cyan-300">
              {totalScans} AUDITED
            </span>
          </div>

          {/* Tri-Color Stacked Bar */}
          <div className="space-y-3 font-mono-tech text-xs">
            <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden flex gap-1 p-0.5 border border-slate-800">
              <div 
                style={{ width: `${realPct}%` }} 
                className="h-full bg-emerald-500 rounded-full transition-all duration-700" 
                title={`Authentic: ${realPct}%`}
              />
              <div 
                style={{ width: `${fakePct}%` }} 
                className="h-full bg-rose-500 rounded-full transition-all duration-700" 
                title={`Deepfakes: ${fakePct}%`}
              />
              <div 
                style={{ width: `${suspPct}%` }} 
                className="h-full bg-amber-500 rounded-full transition-all duration-700" 
                title={`Suspicious: ${suspPct}%`}
              />
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 block font-bold">AUTHENTIC</span>
                <p className="text-xl font-extrabold text-white mt-1">{reals}</p>
                <p className="text-[10px] text-slate-400">{realPct}% of total</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30">
                <span className="text-[10px] text-rose-400 block font-bold">DEEPFAKES</span>
                <p className="text-xl font-extrabold text-white mt-1">{deepfakes}</p>
                <p className="text-[10px] text-slate-400">{fakePct}% of total</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30">
                <span className="text-[10px] text-amber-400 block font-bold">SUSPICIOUS</span>
                <p className="text-xl font-extrabold text-white mt-1">{suspicious}</p>
                <p className="text-[10px] text-slate-400">{suspPct}% of total</p>
              </div>
            </div>
          </div>

          {/* Timeline chart */}
          {stats?.timeline && stats.timeline.length > 0 && (
            <div className="pt-4 border-t border-slate-800">
              <span className="text-xs font-mono-tech text-slate-400 block mb-3">DAILY SCAN VELOCITY:</span>
              <div className="h-28 flex items-end gap-2 px-1">
                {stats.timeline.slice(-8).map((t, idx) => {
                  const maxH = 90;
                  const total = t.total || 0;
                  const heightPx = Math.max(8, Math.min(maxH, total * 18));

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                      <div
                        style={{ height: `${heightPx}px` }}
                        className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-md shadow-[0_0_10px_rgba(0,229,255,0.25)] transition-all group-hover:brightness-125"
                      />
                      <span className="text-[9px] font-mono-tech text-slate-500 truncate max-w-[40px]">
                        {t.date ? t.date.slice(5) : `D${idx+1}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modality Ratio (5 Cols) */}
        <div className="lg:col-span-5 glass-card p-6 sm:p-7 rounded-3xl border border-slate-800/80 bg-slate-900/50 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <h3 className="text-lg font-heading font-bold text-white">Modality Ingestion</h3>
                <p className="text-xs text-slate-400 font-mono-tech mt-0.5">IMAGE • VIDEO • AUDIO</p>
              </div>
              <span className="text-xs font-mono-tech px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                MULTI-MODAL
              </span>
            </div>

            <div className="space-y-4 font-mono-tech text-xs">
              
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex justify-between text-slate-300 mb-2">
                  <span className="flex items-center gap-2 text-cyan-300 font-bold">
                    <Image className="w-3.5 h-3.5 text-cyan-400" /> Image Still Frames
                  </span>
                  <span className="text-white font-bold">{stats?.scansByMediaType?.IMAGE || 0} scans</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full"
                    style={{
                      width: `${totalScans > 0 ? ((stats?.scansByMediaType?.IMAGE || 0) / totalScans) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex justify-between text-slate-300 mb-2">
                  <span className="flex items-center gap-2 text-indigo-300 font-bold">
                    <Video className="w-3.5 h-3.5 text-indigo-400" /> Video Sequences
                  </span>
                  <span className="text-white font-bold">{stats?.scansByMediaType?.VIDEO || 0} scans</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-400 rounded-full"
                    style={{
                      width: `${totalScans > 0 ? ((stats?.scansByMediaType?.VIDEO || 0) / totalScans) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex justify-between text-slate-300 mb-2">
                  <span className="flex items-center gap-2 text-purple-300 font-bold">
                    <Mic className="w-3.5 h-3.5 text-purple-400" /> Acoustic Audio Signals
                  </span>
                  <span className="text-white font-bold">{stats?.scansByMediaType?.AUDIO || 0} scans</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-400 rounded-full"
                    style={{
                      width: `${totalScans > 0 ? ((stats?.scansByMediaType?.AUDIO || 0) / totalScans) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-[11px] font-mono-tech text-slate-400 flex items-center justify-between">
            <span>DATABASE: deepfake_sentinel</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>
        </div>

      </div>

      {/* Recent Detections Table */}
      <div className="glass-card overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/50">
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-heading font-bold text-white">Recent Forensic Detections</h3>
            <p className="text-xs font-mono-tech text-slate-400 mt-0.5">LATEST DETECTIONS COMMITTED TO MYSQL</p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search filename..."
                value={tableSearch}
                onChange={e => setTableSearch(e.target.value)}
                className="px-3 py-1.5 pl-8 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono-tech focus:border-cyan-500 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono-tech">
              {['ALL', 'REAL', 'DEEPFAKE', 'SUSPICIOUS'].map(f => (
                <button
                  key={f}
                  onClick={() => setTableFilter(f)}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    tableFilter === f ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-mono-tech text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-5">ID</th>
                <th className="py-3.5 px-5">Target Filename</th>
                <th className="py-3.5 px-4">Modality</th>
                <th className="py-3.5 px-4">Verdict</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4">Processing Time</th>
                <th className="py-3.5 px-5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans text-xs">
              {filteredScans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-mono-tech">
                    No matching detection records found.
                  </td>
                </tr>
              ) : (
                filteredScans.map(s => (
                  <tr key={s.id} className="hover:bg-slate-900/60 transition-colors font-mono-tech">
                    <td className="py-4 px-5 text-cyan-400 font-bold">#{s.id}</td>
                    <td className="py-4 px-5 text-white font-semibold font-sans truncate max-w-[200px]">{s.filename}</td>
                    <td className="py-4 px-4 text-slate-400">{s.mediaType}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        s.verdict === 'DEEPFAKE' 
                          ? 'bg-rose-950 text-rose-300 border-rose-700' 
                          : s.verdict === 'SUSPICIOUS' 
                          ? 'bg-amber-950 text-amber-300 border-amber-700' 
                          : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      }`}>
                        {s.verdict}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-white font-bold">{s.confidenceScore}%</td>
                    <td className="py-4 px-4 text-slate-400">{s.processingTimeMs} ms</td>
                    <td className="py-4 px-5 text-slate-400 text-[11px]">
                      {new Date(s.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
