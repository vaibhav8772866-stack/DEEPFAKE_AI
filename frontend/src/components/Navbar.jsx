import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Cpu, Database, Activity, Lock, User, LogOut, Menu, X, Sparkles, HelpCircle, Phone, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { checkHealth, getModelStatus } from '../services/api';

export default function Navbar({ activeTab, setActiveTab, onOpenAuth }) {
  const { user, logout, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [systemOnline, setSystemOnline] = useState(true);
  const [modelReady, setModelReady] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkSystem = async () => {
      try {
        const res = await checkHealth();
        if (res.status === 'UP') setSystemOnline(true);
      } catch (e) {
        setSystemOnline(false);
      }

      try {
        const mRes = await getModelStatus();
        setModelReady(mRes.onnxModelLoaded);
      } catch (e) {
        setModelReady(false);
      }
    };
    checkSystem();
    const interval = setInterval(checkSystem, 25000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'studio', label: 'Detection Studio' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'history', label: 'Audit Ledger' },
    { id: 'about', label: 'Architecture' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-2.5 bg-slate-950/92 backdrop-blur-2xl border-b border-cyan-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.6)]' 
          : 'py-3.5 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80'
      } px-4 lg:px-8`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all">
            <Shield className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 rounded-xl border border-cyan-400/30 animate-ping opacity-20 pointer-events-none" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                Deepfake<span className="text-cyan-400 font-black">Sentinel</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono-tech font-bold uppercase rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                v2.6 ONNX
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono-tech tracking-wider hidden sm:block">
              IN-JVM FORENSIC DEFENSE
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800/80 backdrop-blur-md">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-950/80 shadow-[0_0_12px_rgba(0,240,255,0.25)] border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span 
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#00d9ff]" 
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2.5">
          
          {/* Live System Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] font-mono-tech">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${systemOnline ? 'bg-emerald-400 opacity-75' : 'bg-rose-400 opacity-75'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${systemOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </span>
            <span className="text-slate-300">
              {systemOnline ? 'MYSQL & ONNX' : 'OFFLINE'}
            </span>
          </div>

          {/* Admin Panel Button */}
          <button
            onClick={() => {
              if (user && isAdmin) {
                setActiveTab('admin');
              } else {
                onOpenAuth();
              }
            }}
            className={`px-3 py-1.5 text-xs font-bold font-mono-tech rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-purple-900/60 text-purple-200 border border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'bg-purple-950/40 text-purple-300 border border-purple-800/60 hover:bg-purple-900/40'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>Admin</span>
          </button>

          {/* User Profile / Auth Action */}
          {user ? (
            <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-lg p-1 pr-2.5">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-black shadow">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-slate-200 hidden md:inline max-w-[80px] truncate">
                {user.username}
              </span>
              <button
                onClick={() => {
                  logout();
                  setActiveTab('login');
                }}
                title="Sign Out"
                className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors p-1 px-1.5 cursor-pointer text-xs font-mono-tech font-semibold hover:bg-rose-950/30 rounded"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 text-xs font-mono-tech flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900/80 border border-slate-800 cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-slate-800/80 flex flex-col gap-1.5 pb-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === item.id
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800'
                  : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              if (user && isAdmin) {
                setActiveTab('admin');
              } else {
                onOpenAuth();
              }
              setMobileOpen(false);
            }}
            className="text-left px-3 py-2 rounded-lg text-sm font-medium text-purple-300 bg-purple-950/40 border border-purple-900"
          >
            Admin Console
          </button>
        </div>
      )}
    </header>
  );
}
