import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Lock, User, Mail, ShieldAlert, LogIn, UserPlus, 
  Eye, EyeOff, KeyRound, CheckCircle2, ArrowRight, Cpu, Scan, ArrowLeft,
  Radio, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_CREDENTIALS } from '../config';

export default function AuthPage({ mode = 'login', onNavigate, onAuthSuccess }) {
  const auth = useAuth();
  const loginUser = auth.loginUser || auth.login;
  const registerUser = auth.registerUser || auth.register;

  const [currentMode, setCurrentMode] = useState(mode);
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
  const leftCanvasRef = useRef(null);
  const rightCanvasRef = useRef(null);

  useEffect(() => {
    setCurrentMode(mode);
    setError('');
    setSuccessMsg('');
  }, [mode]);

  const switchMode = (newMode) => {
    setCurrentMode(newMode);
    setError('');
    setSuccessMsg('');
    if (onNavigate) {
      onNavigate(newMode);
    }
  };

  // Ambient Background Particle Canvas
  useEffect(() => {
    const canvas = leftCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.offsetWidth || 600);
    let height = (canvas.height = canvas.parentElement.offsetHeight || 800);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 35 }, () => ({
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

      // Cyber Grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.035)';
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
  }, []);

  // Right Side Neural Canvas Visualizer
  useEffect(() => {
    const canvas = rightCanvasRef.current;
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

    const nodes = Array.from({ length: 24 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
    }));

    let scanY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Scanning Beam line
      scanY = (scanY + 1.2) % height;
      const gradient = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      gradient.addColorStop(0, 'rgba(0, 217, 255, 0)');
      gradient.addColorStop(0.5, 'rgba(0, 217, 255, 0.15)');
      gradient.addColorStop(1, 'rgba(0, 217, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanY - 30, width, 60);

      ctx.strokeStyle = 'rgba(0, 217, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.stroke();

      // Neural Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 217, 255, ${0.25 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw Nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#00d9ff';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00d9ff';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (currentMode === 'signup') {
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
      } else if (currentMode === 'login') {
        if (!formData.username || !formData.username.trim()) {
          throw new Error('Please enter your email address or username.');
        }
        if (!formData.password) {
          throw new Error('Please enter your password.');
        }
        if (typeof loginUser !== 'function') {
          throw new Error('Authentication service is currently unavailable.');
        }
        await loginUser(formData.username.trim(), formData.password);
      } else if (currentMode === 'forgot') {
        setSuccessMsg(`Password reset instructions sent to ${formData.email}. Please check your inbox.`);
        setLoading(false);
        return;
      }

      if (onAuthSuccess) {
        onAuthSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="isolated-centered-auth-page"
      initial={{ opacity: 0, filter: 'blur(8px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(8px)' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="auth-page-root"
    >
      {/* Return Home Floating Link */}
      <button
        onClick={() => onNavigate && onNavigate('home')}
        className="absolute top-6 left-6 z-30 flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700/80 text-xs font-mono-tech transition-all cursor-pointer shadow-lg hover:shadow-cyan-500/10"
      >
        <ArrowLeft className="w-4 h-4 text-cyan-400" />
        <span>Return Home</span>
      </button>

      {/* Ambient Background Radial Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-purple-500/10 rounded-full blur-[170px] pointer-events-none" />

      {/* CENTERED CARD CONTAINER (1180px Max Width, Two 50% Columns via explicit CSS) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="auth-card-frame"
      >

        {/* LEFT SIDE — AUTHENTICATION FORM */}
        <div className="auth-card-left">
          <canvas ref={leftCanvasRef} className="absolute inset-0 pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10 space-y-3 mb-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono-tech uppercase tracking-wider font-bold shadow-[0_0_20px_rgba(0,217,255,0.25)]">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>AI FORENSIC ACCESS CONTROL</span>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-white leading-tight">
                TRUTHSCAN <span className="gradient-text-cyan font-black">AI</span>
              </h1>
              <p className="text-xs font-mono-tech tracking-[0.18em] text-cyan-400 font-bold uppercase">
                AI-POWERED MEDIA FORENSICS & VERIFICATION
              </p>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Secure access to AI-powered deepfake analysis and media authenticity verification.
            </p>
          </div>

          {/* Dynamic Form Area */}
          <div className="relative z-10 my-auto w-full">
            <div className="auth-form-container">
              <AnimatePresence mode="wait">
                {currentMode === 'login' && (
                  <motion.div
                    key="form-login"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mb-1">
                      Analyst Authentication
                    </h2>
                    <p className="text-xs text-slate-400 font-mono-tech mb-4 font-semibold uppercase tracking-wider">
                      ENTER YOUR SECURITY CREDENTIALS
                    </p>

                    {/* DEMO ACCOUNT QUICKFILL BANNER */}
                    <div className="mb-4 p-3.5 rounded-xl bg-cyan-950/50 border border-cyan-500/40 text-xs font-mono-tech flex flex-col gap-2 shadow-[0_0_20px_rgba(0,217,255,0.1)]">
                      <div className="flex items-center justify-between text-cyan-300 font-bold">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          DEMO LOGIN CREDENTIALS
                        </span>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, username: DEMO_CREDENTIALS.email, password: DEMO_CREDENTIALS.password })}
                          className="text-[10px] px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/35 text-cyan-300 border border-cyan-400/50 cursor-pointer font-bold transition-all"
                        >
                          Autofill Demo
                        </button>
                      </div>
                      <div className="text-[11px] text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-t border-cyan-500/20 pt-2">
                        <span>Email: <code className="text-cyan-300 font-bold">{DEMO_CREDENTIALS.email}</code></span>
                        <span>Pass: <code className="text-cyan-300 font-bold">{DEMO_CREDENTIALS.password}</code></span>
                      </div>
                    </div>

                    {error && (
                      <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-mono-tech flex items-center gap-2.5 mb-4">
                        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    {successMsg && (
                      <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono-tech flex items-center gap-2.5 mb-4">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{successMsg}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="w-full">
                      <div className="mb-4">
                        <label className="block text-xs font-mono-tech text-slate-300 mb-1.5 font-bold uppercase">
                          USERNAME / HANDLE
                        </label>
                        <div className="relative w-full">
                          <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 z-10" />
                          <input
                            type="text"
                            required
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="glass-input auth-input-field pl-10 text-sm text-white"
                            placeholder="Enter your username"
                          />
                        </div>
                      </div>

                      <div className="mb-3.5">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-mono-tech text-slate-300 font-bold uppercase">
                            SECURITY KEY / PASSWORD
                          </label>
                          <button
                            type="button"
                            onClick={() => switchMode('forgot')}
                            className="text-xs font-mono-tech text-cyan-400 hover:underline cursor-pointer font-semibold"
                          >
                            Forgot password?
                          </button>
                        </div>
                        <div className="relative w-full">
                          <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 z-10" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="glass-input auth-input-field pl-10 pr-10 text-sm text-white"
                            placeholder="Enter your password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer z-10"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono-tech text-slate-400 mb-5">
                        <label className="flex items-center gap-2 cursor-pointer font-medium">
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
                        className="btn-cyber-primary auth-submit-btn mb-4 uppercase font-heading font-extrabold tracking-wider text-sm cursor-pointer"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                            <span>AUTHENTICATING...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <LogIn className="w-4 h-4" />
                            <span>AUTHENTICATE SESSION</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    </form>

                    <div className="pt-3 border-t border-slate-800/80 text-center text-xs font-mono-tech text-slate-400">
                      New analyst?{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('signup')}
                        className="text-cyan-400 font-bold hover:underline cursor-pointer"
                      >
                        Create Account
                      </button>
                    </div>
                  </motion.div>
                )}

                {currentMode === 'signup' && (
                  <motion.div
                    key="form-signup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-extrabold font-heading text-white mb-1">
                      Create Sentinel Account
                    </h2>
                    <p className="text-xs text-slate-400 font-mono-tech mb-5 font-semibold uppercase tracking-wider">
                      Secure your access to AI-powered deepfake detection.
                    </p>

                    {error && (
                      <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-mono-tech flex items-center gap-2.5 mb-4">
                        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3 w-full">
                      <div>
                        <label className="block text-[11px] font-mono-tech text-slate-300 mb-1 font-bold uppercase">
                          FULL NAME
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="glass-input auth-input-field text-xs text-white px-3.5"
                          placeholder="e.g. John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono-tech text-slate-300 mb-1 font-bold uppercase">
                          EMAIL ADDRESS
                        </label>
                        <div className="relative w-full">
                          <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 z-10" />
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="glass-input auth-input-field pl-10 text-xs text-white"
                            placeholder="analyst@deepfakesentinel.io"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono-tech text-slate-300 mb-1 font-bold uppercase">
                          USERNAME / HANDLE
                        </label>
                        <div className="relative w-full">
                          <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 z-10" />
                          <input
                            type="text"
                            required
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="glass-input auth-input-field pl-10 text-xs text-white"
                            placeholder="e.g. analyst_01"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-mono-tech text-slate-300 mb-1 font-bold uppercase">
                            SECURITY KEY
                          </label>
                          <div className="relative w-full">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              className="glass-input auth-input-field pr-9 text-xs text-white px-3"
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer z-10"
                            >
                              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono-tech text-slate-300 mb-1 font-bold uppercase">
                            CONFIRM KEY
                          </label>
                          <div className="relative w-full">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              required
                              value={formData.confirmPassword}
                              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                              className="glass-input auth-input-field pr-9 text-xs text-white px-3"
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer z-10"
                            >
                              {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-cyber-primary auth-submit-btn mt-2 uppercase font-heading font-extrabold tracking-wider text-xs cursor-pointer"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                            <span>CREATING ACCOUNT...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <UserPlus className="w-4 h-4" />
                            <span>CREATE SENTINEL ACCOUNT</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    </form>

                    <div className="pt-3 border-t border-slate-800/80 text-center text-xs font-mono-tech text-slate-400 mt-3">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('login')}
                        className="text-cyan-400 font-bold hover:underline cursor-pointer"
                      >
                        Sign In
                      </button>
                    </div>
                  </motion.div>
                )}

                {currentMode === 'forgot' && (
                  <motion.div
                    key="form-forgot"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-extrabold font-heading text-white mb-1">
                      Reset Your Access
                    </h2>
                    <p className="text-xs text-slate-400 font-mono-tech mb-6 font-semibold uppercase tracking-wider">
                      ENTER YOUR EMAIL TO RESTORE ACCESS
                    </p>

                    {error && (
                      <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-mono-tech flex items-center gap-2.5 mb-5">
                        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    {successMsg && (
                      <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono-tech flex items-center gap-2.5 mb-5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{successMsg}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="w-full">
                      <div className="mb-6">
                        <label className="block text-xs font-mono-tech text-slate-300 mb-1.5 font-bold uppercase">
                          ACCOUNT EMAIL ADDRESS
                        </label>
                        <div className="relative w-full">
                          <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 z-10" />
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="glass-input auth-input-field pl-10 text-sm text-white"
                            placeholder="analyst@deepfakesentinel.io"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-cyber-primary auth-submit-btn mb-5 uppercase font-heading font-extrabold tracking-wider text-sm cursor-pointer"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                            <span>DISPATCHING...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <KeyRound className="w-4 h-4" />
                            <span>SEND RESET LINK</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    </form>

                    <div className="pt-4 border-t border-slate-800/80 text-center text-xs font-mono-tech text-slate-400">
                      Remembered your security key?{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('login')}
                        className="text-cyan-400 font-bold hover:underline cursor-pointer"
                      >
                        Sign In
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer Badge */}
          <div className="relative z-10 pt-4 border-t border-slate-800/80 text-xs font-mono-tech text-slate-500 flex items-center justify-between">
            <span>SECURITY LEVEL: HIGH</span>
            <span>SPRING BOOT 3 • JWT</span>
          </div>
        </div>

        {/* RIGHT SIDE — CINEMATIC AI SECURITY VISUAL */}
        <div className="auth-card-right">
          <canvas ref={rightCanvasRef} className="absolute inset-0 pointer-events-none" />

          {/* Top HUD Badge */}
          <div className="relative z-10 w-full flex items-center justify-between font-mono-tech text-[11px] text-cyan-400/80">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30">
              <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              <span>LIVE AI STREAM</span>
            </div>
            <span>MODE: NEURAL FORENSICS</span>
          </div>

          {/* Center Interactive Shield Visualizer */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center py-6">
            
            {/* Concentric Rotating SVG HUD Rings */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              
              {/* Outer Rotating Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-dashed border-cyan-500/30 shadow-[0_0_30px_rgba(0,217,255,0.15)]"
              />

              {/* Middle Counter-rotating Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-4 rounded-full border border-cyan-400/20 border-t-cyan-400/80 border-b-indigo-500/80"
              />

              {/* Inner Glowing Shield Container */}
              <motion.div
                animate={{ y: [-6, 6, -6], scale: [1, 1.03, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-cyan-950/80 border border-cyan-400/60 flex items-center justify-center text-cyan-300 shadow-[0_0_50px_rgba(0,217,255,0.4)] relative overflow-hidden"
              >
                <Shield className="w-16 h-16 sm:w-18 sm:h-18 text-cyan-400 drop-shadow-[0_0_15px_rgba(0,217,255,0.8)]" />
                
                {/* Facial Scan Crosshair Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                  <Scan className="w-24 h-24 text-cyan-300 animate-pulse" />
                </div>
              </motion.div>

            </div>

            {/* Subtitle Descriptor */}
            <div className="text-center mt-6 space-y-1">
              <p className="text-sm font-heading font-extrabold text-white tracking-wide">
                DEEPFAKE FORENSIC DETECTOR
              </p>
              <p className="text-xs font-mono-tech text-cyan-300/80">
                REAL-TIME BIOMETRIC SCANNING ENGINE
              </p>
            </div>

          </div>

          {/* AI Status Technical Card */}
          <div className="relative z-10 w-full p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 font-mono-tech text-xs grid grid-cols-2 gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-300 text-[11px] font-bold">MEDIA INTEGRITY VERIFIED</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-slate-300 text-[11px] font-bold">FACE ANALYSIS READY</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-slate-300 text-[11px] font-bold">DEEPFAKE MODEL ONLINE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-300 text-[11px] font-bold">CONFIDENCE ENGINE ACTIVE</span>
            </div>
          </div>

        </div>

      </motion.div>
    </motion.div>
  );
}
