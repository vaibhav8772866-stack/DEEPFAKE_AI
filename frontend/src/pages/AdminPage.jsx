import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, Users, Cpu, Database, RefreshCw, 
  ToggleLeft, ToggleRight, Key, AlertTriangle, CheckCircle2, Server, Lock,
  LayoutDashboard, Play, FileText, Search, Trash2, Eye, Activity, Sliders, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getAllUsers, updateUserRole, toggleUserStatus, getModelStatus, reloadModel, getSystemHealth, getScanHistory, deleteRecord } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DetectionStudioPage from './DetectionStudioPage';

export default function AdminPage() {
  const { user } = useAuth();
  const [adminTab, setAdminTab] = useState('dashboard'); // dashboard | studio | users | logs
  
  // Data states
  const [users, setUsers] = useState([]);
  const [modelStatus, setModelStatus] = useState(null);
  const [sysHealth, setSysHealth] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const [reloadMsg, setReloadMsg] = useState(null);
  
  // Log Inspection modal
  const [inspectRecord, setInspectRecord] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [uList, mStatus, health, historyData] = await Promise.all([
        getAllUsers().catch(() => []),
        getModelStatus().catch(() => null),
        getSystemHealth().catch(() => null),
        getScanHistory(0, 50).catch(() => ({ content: [] }))
      ]);
      setUsers(uList || []);
      setModelStatus(mStatus);
      setSysHealth(health);
      setLogs(historyData?.content || []);
    } catch (err) {
      console.warn('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleReloadModel = async () => {
    setReloading(true);
    setReloadMsg(null);
    try {
      const res = await reloadModel();
      setReloadMsg({ type: 'success', text: res?.statusMessage || 'ONNX Session reloaded successfully.' });
      const mStatus = await getModelStatus();
      setModelStatus(mStatus);
    } catch (err) {
      setReloadMsg({ type: 'error', text: err.response?.data?.message || err.message || 'Failed to reload model.' });
    } finally {
      setReloading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await toggleUserStatus(userId);
      fetchAdminData();
    } catch (err) {
      alert('Error changing user status: ' + err.message);
    }
  };

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'ROLE_ADMIN' ? 'ROLE_ANALYST' : 'ROLE_ADMIN';
    if (!window.confirm(`Change role to ${newRole}?`)) return;
    try {
      await updateUserRole(userId, newRole);
      fetchAdminData();
    } catch (err) {
      alert('Error updating role: ' + err.message);
    }
  };

  const handleDeleteLog = async (id) => {
    if (!window.confirm(`Permanently remove scan record #${id} from MySQL?`)) return;
    try {
      await deleteRecord(id);
      setLogs(logs.filter(l => l.id !== id));
      if (inspectRecord?.id === id) setInspectRecord(null);
    } catch (err) {
      alert('Failed to delete record: ' + err.message);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Admin Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono-tech text-purple-400 uppercase tracking-widest block mb-1">
            ENTERPRISE GOVERNANCE & TELEMETRY CONTROL
          </span>
          <h1 className="text-3xl font-heading font-extrabold text-white">
            System Administration Console
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 text-xs font-mono-tech flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Control Plane</span>
          </button>
        </div>
      </div>

      {/* Admin Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 max-w-2xl">
        <button
          onClick={() => setAdminTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
            adminTab === 'dashboard' 
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Admin Dashboard
        </button>

        <button
          onClick={() => setAdminTab('studio')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
            adminTab === 'studio' 
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-500/20 font-extrabold' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Play className="w-4 h-4" />
          Admin Studio
        </button>

        <button
          onClick={() => setAdminTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
            adminTab === 'users' 
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          User Management ({users.length})
        </button>

        <button
          onClick={() => setAdminTab('logs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
            adminTab === 'logs' 
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          Audit Logs ({logs.length})
        </button>
      </div>

      {/* VIEW 1: ADMIN DASHBOARD */}
      {adminTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* ONNX Model Engine Control Card (7 Cols) */}
            <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-2xl border border-slate-800/80 bg-slate-900/50 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-heading font-bold text-white">ONNX Neural Model Runtime</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-mono-tech border font-bold ${
                  modelStatus?.onnxModelLoaded 
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' 
                    : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                }`}>
                  {modelStatus?.onnxModelLoaded ? 'ACTIVE INFERENCE' : 'STANDBY MODE'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono-tech text-xs">
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 text-[10px] block">ENGINE SPEC</span>
                  <span className="text-white font-bold">{modelStatus?.inferenceEngine || 'Microsoft ONNX Runtime Java'}</span>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 text-[10px] block">FACIAL CASCADE</span>
                  <span className="text-cyan-400 font-bold">{modelStatus?.cascadeLoaded ? 'Haar Cascade XML (Loaded)' : 'Heuristic Mode'}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono-tech text-slate-300">
                <span className="text-slate-400 text-[10px] block mb-1">CURRENT STATUS MESSAGE:</span>
                {modelStatus?.statusMessage}
              </div>

              {reloadMsg && (
                <div className={`p-3 rounded-xl text-xs font-mono-tech flex items-center gap-2 ${
                  reloadMsg.type === 'success' ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300' : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
                }`}>
                  {reloadMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span>{reloadMsg.text}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <p className="text-[11px] font-mono-tech text-slate-400">
                  Target: <code>ai-model/models/model_q4.onnx</code>
                </p>

                <button
                  onClick={handleReloadModel}
                  disabled={reloading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${reloading ? 'animate-spin' : ''}`} />
                  <span>{reloading ? 'Reloading Engine...' : 'Hot-Reload ONNX Session'}</span>
                </button>
              </div>
            </div>

            {/* Runtime JVM Health Card (5 Cols) */}
            <div className="lg:col-span-5 glass-card p-6 sm:p-7 rounded-2xl border border-slate-800/80 bg-slate-900/50 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-purple-400" />
                    <h3 className="text-base font-heading font-bold text-white">JVM Runtime Telemetry</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono-tech bg-purple-950 text-purple-300 border border-purple-800">
                    {sysHealth?.jvmVersion || 'JAVA 26'}
                  </span>
                </div>

                <div className="space-y-2.5 font-mono-tech text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Application Core:</span>
                    <span className="text-white font-bold">Spring Boot 3.2.5</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Database Engine:</span>
                    <span className="text-emerald-400 font-bold">MySQL 8.0 (Native)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Memory Allocation:</span>
                    <span className="text-cyan-400 font-bold">
                      {sysHealth ? `${sysHealth.usedMemoryMb} MB / ${sysHealth.totalMemoryMb} MB` : 'Dynamic Pool'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Available Cores:</span>
                    <span className="text-purple-300 font-bold">{sysHealth?.availableProcessors || '8 Cores'}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/40 text-[11px] font-mono-tech text-purple-300">
                Governance Mode: Full Administrator Authorization
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW 2: ADMIN DETECTION STUDIO */}
      {adminTab === 'studio' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300 font-mono-tech flex items-center gap-3">
            <Sliders className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Admin Forensic Mode: Multi-spectral inspection enabled with direct MySQL audit recording.</span>
          </div>
          <DetectionStudioPage onScanComplete={fetchAdminData} />
        </div>
      )}

      {/* VIEW 3: USER MANAGEMENT */}
      {adminTab === 'users' && (
        <div className="glass-card overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-heading font-bold text-white">System Operators & Analysts</h3>
            </div>
            <span className="text-xs font-mono-tech px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300">
              {users.length} REGISTERED ACCOUNTS
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-mono-tech text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-5">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4">Last Login</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans text-xs">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-cyan-400">
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{u.fullName || u.username}</p>
                          <p className="text-[11px] font-mono-tech text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono-tech">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        u.role === 'ROLE_ADMIN' ? 'bg-purple-950 text-purple-300 border-purple-700' : 'bg-slate-900 text-slate-300 border-slate-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-mono-tech ${
                        u.enabled ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.enabled ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        {u.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono-tech text-slate-400 text-[11px]">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>

                    <td className="py-4 px-4 font-mono-tech text-slate-400 text-[11px]">
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleRoleChange(u.id, u.role)}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-purple-300 border border-slate-800 text-[11px] font-mono-tech cursor-pointer transition-colors"
                        >
                          Toggle Role
                        </button>
                        <button
                          onClick={() => handleToggleStatus(u.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 text-[11px] font-mono-tech cursor-pointer transition-colors"
                        >
                          {u.enabled ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: AUDIT LEDGER / LOGS */}
      {adminTab === 'logs' && (
        <div className="glass-card overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-heading font-bold text-white">MySQL Forensic Detection Logs</h3>
            </div>
            <span className="text-xs font-mono-tech px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300">
              {logs.length} PERSISTED RECORDS
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-mono-tech text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">Filename</th>
                  <th className="py-3.5 px-4">Media</th>
                  <th className="py-3.5 px-4">Verdict</th>
                  <th className="py-3.5 px-4">Confidence</th>
                  <th className="py-3.5 px-4">Processing Time</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans text-xs">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-4 px-4 font-mono-tech text-cyan-400 font-bold">#{l.id}</td>
                    <td className="py-4 px-4 font-semibold text-white">{l.filename}</td>
                    <td className="py-4 px-4 font-mono-tech text-slate-400">{l.mediaType}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech font-bold uppercase border ${
                        l.verdict === 'DEEPFAKE' 
                          ? 'bg-rose-950 text-rose-300 border-rose-700' 
                          : l.verdict === 'SUSPICIOUS' 
                          ? 'bg-amber-950 text-amber-300 border-amber-700' 
                          : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      }`}>
                        {l.verdict}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono-tech text-white font-bold">{l.confidenceScore}%</td>
                    <td className="py-4 px-4 font-mono-tech text-slate-400">{l.processingTimeMs} ms</td>
                    <td className="py-4 px-4 font-mono-tech text-slate-400 text-[11px]">
                      {new Date(l.createdAt).toLocaleString()}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setInspectRecord(l)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 cursor-pointer"
                          title="Inspect JSON Telemetry"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLog(l.id)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-800 cursor-pointer"
                          title="Delete from MySQL"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Raw JSON Inspection Modal */}
      {inspectRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card max-w-2xl w-full p-6 rounded-2xl border border-slate-800 bg-slate-900/95 space-y-4 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                Raw MySQL Forensic Record #{inspectRecord.id}
              </h3>
              <button
                onClick={() => setInspectRecord(null)}
                className="text-slate-400 hover:text-white text-sm font-mono-tech cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono-tech">
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div><span className="text-slate-500">Filename:</span> <span className="text-white">{inspectRecord.filename}</span></div>
                <div><span className="text-slate-500">Verdict:</span> <span className="text-cyan-400 font-bold">{inspectRecord.verdict}</span></div>
                <div><span className="text-slate-500">Fake Probability:</span> <span className="text-white">{inspectRecord.fakeProbability}%</span></div>
                <div><span className="text-slate-500">Confidence:</span> <span className="text-white">{inspectRecord.confidenceScore}%</span></div>
                <div><span className="text-slate-500">Processing Time:</span> <span className="text-white">{inspectRecord.processingTimeMs} ms</span></div>
                <div><span className="text-slate-500">Timestamp:</span> <span className="text-white">{new Date(inspectRecord.createdAt).toLocaleString()}</span></div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Metrics Payload JSON:</span>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-cyan-300 overflow-x-auto whitespace-pre-wrap">
                  {inspectRecord.metricsJson || 'No metrics payload attached.'}
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
