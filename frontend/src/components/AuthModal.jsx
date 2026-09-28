import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Lock, User, Mail, ShieldAlert, LogIn, UserPlus, 
  Eye, EyeOff, Shield, KeyRound, CheckCircle2, ArrowRight, Cpu, Scan
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const auth = useAuth();
  const loginUser = auth.loginUser || auth.login;
  const registerUser = auth.registerUser || auth.register;

  // Modes: 'login', 'signup', 'forgot'
  const [mode, setMode] = useState(initialMode === 'signup' ? 'signup' : 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  // Sync mode if initialMode prop changes when opened
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode === 'signup' ? 'signup' : 'login');
      setError('');
      setSuccessMsg('');
    }
  }, [isOpen, initialMode]);

  // Ambient canvas particle background inside the authentication modal
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.offsetWidth || 500);
    let height = (canvas.height = canvas.parentElement.offsetHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.8,
      alpha: Math.random() * 0.35 + 0.1,
      color: Math.random() > 0.4 ? '#00d9ff' : '#6366f1',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Cyber Grid Lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 36;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match. Please verify your security key.');
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        if (typeof registerUser !== 'function') {
          throw new Error('Registration service is currently unavailable.');
        }
        await registerUser(formData.username, formData.email, formData.password, formData.fullName);
        setSuccessMsg('Account created successfully. Authenticating session...');
      } else if (mode === 'login') {
        if (typeof loginUser !== 'function') {
          throw new Error('Authentication service is currently unavailable.');
        }
        await loginUser(formData.username, formData.password);
      } else if (mode === 'forgot') {
        // Simulate forgot password response
        setSuccessMsg(`Password reset instructions sent to ${formData.email}. Please check your inbox.`);
        setLoading(false);
        return;
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-950/90 backdrop-blur-xl overflow-y-auto">
        
        {/* Asymmetric Split Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl glass-panel border border-cyan-500/30 shadow-[0_0_80px_rgba(0,217,255,0.15)] rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* LEFT SIDE: BRANDING & AI CYBER ATMOSPHERE */}
          <div className="lg:col-span-6 bg-slate-950/90 p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800/80">
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

            {/* Cyan Glow Orbs */}
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />

            {/* Top Brand Header */}
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono-tech uppercase tracking-wider font-bold shadow-[0_0_20px_rgba(0,217,255,0.2)]">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>AI FORENSIC ACCESS CONTROL</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-white">
                  DEEPFAKE <span className="gradient-text-cyan font-black">DETECTION</span>
                </h2>
                <p className="text-xs font-mono-tech tracking-[0.18em] text-cyan-400/90 font-semibold uppercase">
                  AI-POWERED MEDIA AUTHENTICITY SYSTEM
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed break-words">
                Secure enterprise access for real-time deepfake analysis, biometric face localization, and ONNX Runtime neural verification.
              </p>
            </div>

            {/* Middle Feature Pills */}
            <div className="relative z-10 my-8 space-y-2.5 font-mono-tech text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-3">
                <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-slate-300 font-bold">IN-JVM ONNX INFERENCE ENGINE</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-3">
                <Scan className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-slate-300 font-bold">OPENCV HAAR FACIAL EXTRACTION</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300 font-bold">IMMUTABLE AUDIT LEDGER TRAIL</span>
              </div>
            </div>

            {/* Bottom Footer Badge */}
            <div className="relative z-10 pt-4 border-t border-slate-800/80 text-[11px] font-mono-tech text-slate-500 flex items-center justify-between">
              <span>SECURITY LEVEL: HIGH</span>
              <span>SPRING BOOT 3 • JWT</span>
            </div>
          </div>

          {/* RIGHT SIDE: AUTHENTICATION FORM */}
          <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-center relative z-10 bg-slate-900/40 backdrop-blur-md">
            
            <AnimatePresence mode="wait">
              {mode === 'login' && (
                <motion.div
                  key="form-login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-2xl font-extrabold font-heading text-white">Analyst Authentication</h3>
                    <p className="text-xs text-slate-400 font-mono-tech mt-1">ENTER YOUR SECURITY CREDENTIALS</p>
                  </div>

                  {error && (
                    <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-mono-tech flex items-center gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {successMsg && (
                    <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono-tech flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{successMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono-tech text-slate-300 mb-1.5 font-bold uppercase">
                        USERNAME / HANDLE
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className="glass-input w-full pl-10 text-xs text-white"
                          placeholder="e.g. analyst_01"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-mono-tech text-slate-300 font-bold uppercase">
                          SECURITY KEY / PASSWORD
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setError('');
                            setMode('forgot');
                          }}
                          className="text-[11px] font-mono-tech text-cyan-400 hover:underline cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="glass-input w-full pl-10 pr-10 text-xs text-white"
                          placeholder="••••••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono-tech text-slate-400 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded bg-slate-950 border-slate-800 text-cyan-400 focus:ring-0"
                        />
                        <span>Remember session</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-cyber-primary text-xs py-3.5 mt-2 uppercase font-heading font-extrabold tracking-wider"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                          <span>AUTHENTICATING...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <LogIn className="w-4 h-4" />
                          <span>AUTHENTICATE SESSION</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  </form>

                  <div className="pt-4 border-t border-slate-800 text-center text-xs font-mono-tech text-slate-400">
                    New analyst?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setError('');
                        setMode('signup');
                      }}
                      className="text-cyan-400 font-bold hover:underline cursor-pointer"
                    >
                      Create Account
                    </button>
                  </div>
                </motion.div>
              )}

              {mode === 'signup' && (
                <motion.div
                  key="form-signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div>
                    <h3 className="text-2xl font-extrabold font-heading text-white">CREATE YOUR ACCOUNT</h3>
                    <p className="text-xs text-slate-400 font-mono-tech mt-1">
                      Secure your access to AI-powered deepfake detection.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-mono-tech flex items-center gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-mono-tech text-slate-300 mb-1 font-bold uppercase">
                        FULL NAME
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="glass-input w-full text-xs text-white"
                        placeholder="e.g. John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono-tech text-slate-300 mb-1 font-bold uppercase">
                        EMAIL ADDRESS
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="glass-input w-full pl-10 text-xs text-white"
                          placeholder="analyst@deepfakesentinel.io"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono-tech text-slate-300 mb-1 font-bold uppercase">
                        USERNAME / HANDLE
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className="glass-input w-full pl-10 text-xs text-white"
                          placeholder="e.g. analyst_01"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono-tech text-slate-300 mb-1 font-bold uppercase">
                          PASSWORD
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="glass-input w-full pr-9 text-xs text-white"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono-tech text-slate-300 mb-1 font-bold uppercase">
                          CONFIRM PASSWORD
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="glass-input w-full pr-9 text-xs text-white"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                          >
                            {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-cyber-primary text-xs py-3.5 mt-3 uppercase font-heading font-extrabold tracking-wider"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                          <span>CREATING ACCOUNT...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <UserPlus className="w-4 h-4" />
                          <span>CREATE ACCOUNT</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  </form>

                  <div className="pt-3 border-t border-slate-800 text-center text-xs font-mono-tech text-slate-400">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setError('');
                        setMode('login');
                      }}
                      className="text-cyan-400 font-bold hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                </motion.div>
              )}

              {mode === 'forgot' && (
                <motion.div
                  key="form-forgot"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-2xl font-extrabold font-heading text-white">RESET YOUR ACCESS</h3>
                    <p className="text-xs text-slate-400 font-mono-tech mt-1">
                      Enter your email and we'll help you restore access.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-mono-tech flex items-center gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {successMsg && (
                    <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono-tech flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{successMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono-tech text-slate-300 mb-1.5 font-bold uppercase">
                        ACCOUNT EMAIL ADDRESS
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="glass-input w-full pl-10 text-xs text-white"
                          placeholder="analyst@deepfakesentinel.io"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-cyber-primary text-xs py-3.5 mt-2 uppercase font-heading font-extrabold tracking-wider"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                          <span>DISPATCHING...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <KeyRound className="w-4 h-4" />
                          <span>DISPATCH RESET INSTRUCTIONS</span>
                        </div>
                      )}
                    </button>
                  </form>

                  <div className="pt-4 border-t border-slate-800 text-center text-xs font-mono-tech text-slate-400">
                    Remembered your security key?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setError('');
                        setMode('login');
                      }}
                      className="text-cyan-400 font-bold hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
