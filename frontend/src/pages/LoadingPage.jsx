import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Cpu, Scan, CheckCircle2, Server } from 'lucide-react';

export default function LoadingPage({ onComplete }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setProgress(100);
      setStep(4);
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }

    // Step status timeline sequence
    const t1 = setTimeout(() => setStep(1), 700);   // VERIFYING MEDIA INTEGRITY
    const t2 = setTimeout(() => setStep(2), 1400);  // LOADING DEEPFAKE DETECTION MODEL
    const t3 = setTimeout(() => setStep(3), 2100);  // ANALYZING AUTHENTICITY PIPELINE
    const t4 = setTimeout(() => setStep(4), 2800);  // SYSTEM READY
    const t5 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3500); // Trigger transition into homepage

    // Fallback safety timeout
    const fallbackTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 4200);

    // Smooth counter progress timer from 0% to 100% over 3.0 seconds
    const startTime = Date.now();
    const duration = 3000;

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(progressInterval);
      }
    }, 25);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(fallbackTimer);
      clearInterval(progressInterval);
    };
  }, []);

  // Canvas particle background effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Create subtle floating tech particles
    const particles = Array.from({ length: 42 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 1.5 + 0.8,
      alpha: Math.random() * 0.35 + 0.1,
      color: Math.random() > 0.4 ? '#00d9ff' : '#6366f1',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle tech grid lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.035)';
      ctx.lineWidth = 1;
      const gridSize = 42;
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

      // Draw particles
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
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
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

  const statusMessages = [
    { text: 'INITIALIZING AI ENGINE...', color: 'text-cyan-400', icon: Cpu },
    { text: 'VERIFYING MEDIA INTEGRITY...', color: 'text-indigo-400', icon: Scan },
    { text: 'LOADING DEEPFAKE DETECTION MODEL...', color: 'text-purple-400', icon: Server },
    { text: 'ANALYZING AUTHENTICITY PIPELINE...', color: 'text-blue-400', icon: Cpu },
    { text: 'SYSTEM READY', color: 'text-emerald-400', icon: CheckCircle2 },
  ];

  return (
    <motion.div
      key="loading-page-component"
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.04, 
        filter: 'blur(8px)',
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } 
      }}
      className="fixed inset-0 z-[999999] bg-[#020617] text-slate-100 flex flex-col items-center justify-center overflow-hidden select-none font-sans"
    >
      {/* Particle & Grid Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Ambient Futuristic Cyan/Indigo Glowing Radial Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-purple-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Center Content Box */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-md w-full">
        
        {/* Shield Icon Reveal */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0, filter: 'blur(12px)' }}
          animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6"
        >
          <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-950/90 border border-cyan-500/40 shadow-[0_0_40px_rgba(0,217,255,0.3)]">
            <Shield className="w-10 h-10 text-cyan-400" />
            <span className="absolute inset-0 rounded-2xl border border-cyan-400/50 animate-ping opacity-25 pointer-events-none" />
          </div>

          {/* Scanning Beam passing across the logo */}
          <motion.div
            initial={{ left: '-20%', opacity: 0 }}
            animate={{ left: '120%', opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.4 }}
            className="absolute top-1/2 -translate-y-1/2 w-14 h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_14px_#00d9ff] pointer-events-none"
          />
        </motion.div>

        {/* Brand Title Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 15, filter: 'blur(8px)', scale: 0.96 }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          className="space-y-1.5 mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-white">
            DEEPFAKE <span className="gradient-text-cyan font-black">DETECTION</span>
          </h1>
          <p className="text-[11px] sm:text-xs font-mono-tech tracking-[0.18em] text-slate-400 uppercase font-semibold">
            AI-POWERED MEDIA AUTHENTICITY SYSTEM
          </p>
        </motion.div>

        {/* Technical Status Message Sequence */}
        <div className="h-9 flex items-center justify-center mb-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={`status-step-${step}`}
              initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 text-xs font-mono-tech font-bold"
            >
              {React.createElement(statusMessages[Math.min(step, 4)].icon, {
                className: `w-4 h-4 ${statusMessages[Math.min(step, 4)].color} animate-pulse`
              })}
              <span className={statusMessages[Math.min(step, 4)].color}>
                {statusMessages[Math.min(step, 4)].text}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Animated Progress Bar & Percentage Indicator */}
        <div className="w-full space-y-2">
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: 'linear' }}
              className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 rounded-full shadow-[0_0_12px_rgba(0,217,255,0.6)]"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono-tech text-slate-500 font-bold">
            <span>BOOT SEQUENCE</span>
            <span className="text-cyan-400">{progress}%</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
