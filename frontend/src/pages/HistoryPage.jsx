import React, { useState, useEffect } from 'react';
import { 
  FileSearch, Download, Trash2, Eye, ShieldAlert, ShieldCheck, 
  HelpCircle, RefreshCw, ChevronLeft, ChevronRight, Filter, ExternalLink, 
  X, FileText, Image, Video, Mic, Search, AlertCircle, Sparkles, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getScanHistory, deleteScanRecord } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ForensicBars from '../components/ForensicBars';

export default function HistoryPage() {
  const { isAdmin } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  // Filters
  const [filterVerdict, setFilterVerdict] = useState('ALL');
  const [filterModality, setFilterModality] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Delete confirm modal
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  const fetchRecords = async (pageNum = 0) => {
    setLoading(true);
    try {
      const res = await getScanHistory(pageNum, 15);
      if (res) {
        setRecords(res.content || []);
        setTotalPages(res.totalPages || 1);
        setTotalElements(res.totalElements || 0);
        setPage(res.number || 0);
      }
    } catch (err) {
      console.warn('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords(0);
  }, []);

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    try {
      await deleteScanRecord(deleteCandidate.id);
      setRecords(records.filter(r => r.id !== deleteCandidate.id));
      if (selectedRecord?.id === deleteCandidate.id) setSelectedRecord(null);
      setDeleteCandidate(null);
      fetchRecords(page);
    } catch (err) {
      alert('Failed to delete scan record: ' + err.message);
    }
  };

  const exportJson = () => {
    if (records.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `sentinel_audit_ledger_${Date.now()}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const exportCsv = () => {
    if (records.length === 0) return;
    const headers = ['ID', 'Filename', 'MediaType', 'Verdict', 'FakeProbability', 'Confidence', 'ProcessingTimeMs', 'Timestamp'];
    const rows = records.map(r => [
      r.id,
      `"${r.filename}"`,
      r.mediaType,
      r.verdict,
      r.fakeProbability,
      r.confidenceScore,
      r.processingTimeMs,
      r.createdAt
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sentinel_audit_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

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
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech font-bold uppercase bg-rose-950 text-rose-300 border border-rose-700">DEEPFAKE</span>;
      case 'REAL':
      case 'AUTHENTIC':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-700">AUTHENTIC</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech font-bold uppercase bg-amber-950 text-amber-300 border border-amber-700">SUSPICIOUS</span>;
    }
  };

  const filteredRecords = records.filter(r => {
    const matchesVerdict = filterVerdict === 'ALL' || r.verdict?.toUpperCase() === filterVerdict;
    const matchesModality = filterModality === 'ALL' || r.mediaType?.toUpperCase() === filterModality;
    const matchesSearch = !searchQuery || r.filename?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesVerdict && matchesModality && matchesSearch;
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest block mb-1">
            IMMUTABLE FORENSIC AUDIT LEDGER
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
            Audit Ledger <span className="text-gradient">Records</span> ({totalElements})
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={exportJson}
            disabled={records.length === 0}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 text-xs font-mono-tech flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={exportCsv}
            disabled={records.length === 0}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-mono-tech flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => fetchRecords(page)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 text-xs font-mono-tech flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="glass-card p-5 rounded-3xl border border-slate-800/80 bg-slate-900/50 flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <input
            type="text"
            placeholder="Search filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 pl-9 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs font-mono-tech focus:border-cyan-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Modality & Verdict Filter Buttons */}
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-start lg:justify-end text-xs font-mono-tech">
          
          {/* Modality Pills */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800">
            {['ALL', 'IMAGE', 'VIDEO', 'AUDIO'].map(m => (
              <button
                key={m}
                onClick={() => setFilterModality(m)}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  filterModality === m ? 'bg-indigo-950 text-indigo-300 font-bold border border-indigo-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Verdict Pills */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800">
            {['ALL', 'REAL', 'DEEPFAKE', 'SUSPICIOUS'].map(v => (
              <button
                key={v}
                onClick={() => setFilterVerdict(v)}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  filterVerdict === v ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Ledger Table */}
      {loading ? (
        <div className="glass-card p-16 rounded-3xl text-center text-slate-400 font-mono-tech text-xs border border-slate-800">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Querying MySQL persistence ledger...
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="glass-card p-16 rounded-3xl text-center text-slate-400 font-sans border border-slate-800">
          <FileSearch className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-heading font-bold text-white mb-1">No Matching Audit Records</h3>
          <p className="text-xs text-slate-400">Try clearing filters or search queries to view all detections.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-mono-tech text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-5">ID</th>
                  <th className="py-4 px-5">Target Media</th>
                  <th className="py-4 px-4">Modality</th>
                  <th className="py-4 px-4">Verdict</th>
                  <th className="py-4 px-4">Confidence</th>
                  <th className="py-4 px-4">Latency</th>
                  <th className="py-4 px-4">Operator</th>
                  <th className="py-4 px-4">Timestamp</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans text-xs">
                {filteredRecords.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setSelectedRecord(r)}
                    className="hover:bg-slate-900/60 transition-colors group cursor-pointer font-mono-tech"
                  >
                    <td className="py-4 px-5 text-cyan-400 font-bold">
                      #{r.id}
                    </td>

                    <td className="py-4 px-5 font-semibold text-white font-sans">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                          {getMediaIcon(r.mediaType)}
                        </div>
                        <span className="max-w-[180px] truncate">{r.filename}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-400">
                      {r.mediaType}
                    </td>

                    <td className="py-4 px-4">
                      {getVerdictBadge(r.verdict)}
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-white font-bold">{r.confidenceScore}%</span>
                    </td>

                    <td className="py-4 px-4 text-slate-400">
                      {r.processingTimeMs} ms
                    </td>

                    <td className="py-4 px-4 text-slate-400">
                      {r.username || 'Anonymous'}
                    </td>

                    <td className="py-4 px-4 text-slate-400 text-[11px]">
                      {r.createdAt ? new Date(r.createdAt).toLocaleString() : 'N/A'}
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedRecord(r)}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-cyan-300 border border-slate-800 cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteCandidate(r);
                          }}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-rose-400 border border-slate-800 cursor-pointer"
                          title="Delete from Database"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between font-mono-tech text-xs text-slate-400">
            <span>
              Page {page + 1} of {totalPages} ({totalElements} total records)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 0}
                onClick={() => fetchRecords(page - 1)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => fetchRecords(page + 1)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forensic Detail Inspection Modal */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl glass-card p-6 sm:p-8 space-y-6 border-cyan-500/30 bg-slate-900/95 max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
            >
              <button
                onClick={() => setSelectedRecord(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-white">{selectedRecord.filename}</h3>
                  <p className="text-xs font-mono-tech text-slate-400">AUDIT RECORD #{selectedRecord.id} • {selectedRecord.mediaType}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-tech text-xs">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">VERDICT</span>
                  <span className="font-bold text-white text-sm">{selectedRecord.verdict}</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">CONFIDENCE</span>
                  <span className="font-bold text-cyan-400 text-sm">{selectedRecord.confidenceScore}%</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">SYNTHETIC PROB</span>
                  <span className="font-bold text-rose-400 text-sm">{selectedRecord.fakeProbability}%</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">PROCESSING TIME</span>
                  <span className="font-bold text-purple-300 text-sm">{selectedRecord.processingTimeMs || 65} ms</span>
                </div>
              </div>

              {selectedRecord.forensicSummary && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
                  <strong className="text-cyan-300 block mb-1 font-mono-tech">FORENSIC INTELLIGENCE SUMMARY:</strong>
                  {selectedRecord.forensicSummary}
                </div>
              )}

              {selectedRecord.metricsJson && (
                <div>
                  <span className="text-xs font-mono-tech text-slate-400 block mb-2">RAW FORENSIC METRICS JSON:</span>
                  <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono-tech text-cyan-300 overflow-x-auto max-h-44 whitespace-pre-wrap">
                    {(() => {
                      try {
                        return JSON.stringify(JSON.parse(selectedRecord.metricsJson), null, 2);
                      } catch {
                        return selectedRecord.metricsJson;
                      }
                    })()}
                  </pre>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-heading font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-6 sm:p-7 rounded-3xl border border-rose-500/40 bg-slate-900/95 max-w-md w-full space-y-5"
            >
              <div className="flex items-center gap-3 text-rose-400">
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-white">Delete Audit Record</h3>
                  <p className="text-xs font-mono-tech text-slate-400">Record #{deleteCandidate.id}</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Are you sure you want to permanently delete <strong className="text-white">"{deleteCandidate.filename}"</strong> from the MySQL database? This action cannot be undone.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setDeleteCandidate(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 text-xs font-mono-tech cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-heading font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
