import React, { useState } from 'react';
import { Shield, Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2, Cpu, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin({ onLoginSuccess }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(username, password);
      if (data && (data.roles?.includes('ROLE_ADMIN') || data.roles?.includes('ADMIN') || data.role === 'ROLE_ADMIN' || data.role === 'ADMIN')) {
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setError('ACCESS DENIED: Authenticated account lacks ROLE_ADMIN privilege.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans select-none">
      
      {/* Background Cyber Grid & Glows */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Center Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md glass-panel p-8 sm:p-10 border-cyan-500/30 shadow-[0_0_60px_rgba(0,217,255,0.18)] rounded-3xl"
      >
        {/* Laser Sweep */}
        <div className="laser-scanner" />

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-[0_0_30px_rgba(0,217,255,0.3)] mb-4">
            <Shield className="w-8 h-8 pulse-glow" />
          </div>
          <h1 className="text-2xl font-heading font-extrabold tracking-tight text-white">
            DEEPFAKE<span className="text-cyan-400">SENTINEL</span>
          </h1>
          <p className="text-xs font-mono-tech text-cyan-300 uppercase tracking-widest mt-1">
            ADMINISTRATOR CONSOLE
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-mono-tech flex items-center gap-2 mb-6"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-[11px] font-mono-tech uppercase text-slate-400 mb-1.5 font-bold">
              Administrator Username / Email
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full glass-input text-xs pl-10 py-3 text-white focus:border-cyan-400"
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono-tech uppercase text-slate-400 mb-1.5 font-bold">
              Master Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full glass-input text-xs pl-10 pr-10 py-3 text-white focus:border-cyan-400"
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-cyber-primary py-3.5 text-xs font-heading font-extrabold uppercase tracking-wider justify-center shadow-lg cursor-pointer mt-2"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>AUTHENTICATING IDENTITY...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>SIGN IN TO ADMIN CONSOLE</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </button>

        </form>

        {/* Bottom Security Disclaimer */}
        <div className="mt-8 pt-5 border-t border-slate-800/80 text-center font-mono-tech text-[10px] text-slate-500 space-y-1">
          <p>AUTHORIZED SECURITY PERSONNEL ONLY</p>
          <p>PROTECTED BY SPRING SECURITY & JWT TOKEN AUTH</p>
        </div>

      </motion.div>
    </div>
  );
}
