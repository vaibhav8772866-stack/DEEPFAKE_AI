import React, { useState, useEffect } from 'react';
import { 
  Shield, Cpu, Users, FileText, Activity, Settings, LogOut, 
  ChevronRight, ExternalLink, Menu, X, Bell, Database, Scan, CheckCircle2, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { checkHealth, getModelStatus } from '../services/api';

export default function AdminLayout({ currentRoute, onNavigate, children }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [systemStatus, setSystemStatus] = useState({ backend: 'ONLINE', onnx: 'READY', db: 'CONNECTED' });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const [h, m] = await Promise.all([
          checkHealth().catch(() => ({ status: 'DOWN' })),
          getModelStatus().catch(() => ({ onnxModelLoaded: false }))
        ]);
        setSystemStatus({
          backend: h.status === 'UP' ? 'ONLINE' : 'DEGRADED',
          onnx: m.onnxModelLoaded ? 'READY' : 'STANDBY',
          db: 'CONNECTED'
        });
      } catch (e) {
        // Fallback status
      }
    };
    fetchStatus();
    const intv = setInterval(fetchStatus, 30000);
    return () => clearInterval(intv);
  }, []);

  const navItems = [
    { id: '/admin/dashboard', label: 'Overview', icon: Activity },
    { id: '/admin/detection-studio', label: 'Detection Studio', icon: Zap },
    { id: '/admin/users', label: 'User Management', icon: Users },
    { id: '/admin/detections', label: 'Detection Logs', icon: FileText },
    { id: '/admin/system', label: 'System Health', icon: Cpu },
    { id: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex font-sans select-none">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col justify-between w-64 border-r border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl p-5 sticky top-0 h-screen z-40">
        
        <div className="space-y-6">
          
          {/* Brand Header */}
          <div 
            onClick={() => onNavigate('/admin/dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(0,217,255,0.4)] transition-all">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-heading font-extrabold text-white text-base tracking-tight leading-tight">
                Deepfake<span className="text-cyan-400">Sentinel</span>
              </p>
              <span className="text-[10px] font-mono-tech font-bold text-cyan-400 tracking-wider">
                ADMIN CONSOLE
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                    isActive
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,217,255,0.2)] font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="adminSidebarPill"
                      className="absolute right-2 w-1.5 h-4 bg-cyan-400 rounded-full shadow-[0_0_8px_#00d9ff]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

        </div>

        {/* Bottom Profile / Logout */}
        <div className="pt-5 border-t border-slate-800/80 space-y-3">
          
          <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-black shrink-0">
                {user?.username?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.username || 'Administrator'}</p>
                <p className="text-[10px] font-mono-tech text-cyan-400 truncate">ROLE_ADMIN</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                onNavigate('/admin/login');
              }}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => onNavigate('/')}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] font-mono-tech text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <span>Public Application</span>
            <ExternalLink className="w-3 h-3" />
          </button>

        </div>

      </aside>

      {/* Main Admin Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Admin Header Bar */}
        <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-6 py-3 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2 text-xs font-mono-tech text-slate-400">
              <span className="text-cyan-400 font-bold">ADMIN</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white uppercase font-bold">
                {currentRoute.replace('/admin/', '').replace('-', ' ') || 'OVERVIEW'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            
            {/* Live Telemetry Beacon */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono-tech">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-300">CORE INFRASTRUCTURE:</span>
              <span className="text-emerald-400 font-bold">ONLINE</span>
            </div>

            <button
              onClick={() => onNavigate('/')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 text-xs font-mono-tech flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Exit Console</span>
              <ExternalLink className="w-3 h-3" />
            </button>

          </div>

        </header>

        {/* Mobile Navigation Drawer */}
        {sidebarOpen && (
          <div className="lg:hidden p-4 bg-slate-950 border-b border-slate-800 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                  currentRoute === item.id ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                logout();
                onNavigate('/admin/login');
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-950/30 border border-rose-900/50"
            >
              Logout
            </button>
          </div>
        )}

        {/* Nested Admin View */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
