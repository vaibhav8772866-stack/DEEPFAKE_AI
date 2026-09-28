import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Cpu, Scan, CheckCircle2 } from 'lucide-react';

export default function EntryAnimation({ onComplete }) {
  // Always start showIntro = true on page load / browser refresh
  const [showIntro, setShowIntro] = useState(true);
  const [step, setStep] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Expose dev helper to manually replay animation if needed in console
    window.replayTruthfaceIntro = () => {
      setStep(0);
      setShowIntro(true);
    };

    if (!showIntro) {
      if (onComplete) onComplete();
      return;
    }

    // Escape key listener for accessibility
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') finishIntro();
    };
    window.addEventListener('keydown', handleKeyDown);

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      const timer = setTimeout(() => {
        finishIntro();
      }, 500);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }

    // Step sequence timing
    const t1 = setTimeout(() => setStep(1), 600);    // Logo & System Init
    const t2 = setTimeout(() => setStep(2), 1400);   // Verifying Media Integrity
    const t3 = setTimeout(() => setStep(3), 2100);   // Deepfake Detection System Online
    const t4 = setTimeout(() => finishIntro(), 2900); // Complete & Transition into App

    // Fallback safety timeout (forces unmount even if timers lag)
    const fallbackTimer = setTimeout(() => {
      finishIntro();
    }, 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(fallbackTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showIntro]);

  const finishIntro = () => {
    setShowIntro(false);
    if (onComplete) onComplete();
  };

  // Canvas particle background effect
  useEffect(() => {
    if (!showIntro) return;
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

    // Subtle floating tech particles
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.6 + 0.8,
      alpha: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.35 ? '#00d9ff' : '#6366f1',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle tech grid lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.035)';
      ctx.lineWidth = 1;
      const gridSize = 40;
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

      // Draw floating particles
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
        ctx.shadowBlur = 8;
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
  }, [showIntro]);

  if (!showIntro) return null;

  const hudMessages = [
    { text: 'INITIALIZING AI ENGINE...', color: 'text-cyan-400', icon: Cpu },
    { text: 'VERIFYING MEDIA INTEGRITY...', color: 'text-indigo-400', icon: Scan },
    { text: 'DEEPFAKE DETECTION SYSTEM ONLINE', color: 'text-emerald-400', icon: CheckCircle2 },
  ];

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          key="entry-intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.04, 
            filter: 'blur(10px)',
            transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } 
          }}
          className="fixed inset-0 z-[999999] bg-[#020617] text-slate-100 flex flex-col items-center justify-center overflow-hidden select-none"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {/* Particle & Grid Canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

          {/* Ambient Radial Glowing Orbs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

          {/* Scanning Beam Overlay Effect */}
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: '200%' }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent pointer-events-none"
          />

          {/* Main Central Content Box */}
          <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center max-w-lg">
            
            {/* Shield Logo Reveal */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0, filter: 'blur(12px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-6"
            >
              <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-950/90 border border-cyan-500/40 shadow-[0_0_40px_rgba(0,217,255,0.3)]">
                <Shield className="w-10 h-10 text-cyan-400" />
                
                {/* Ping Ring Effect */}
                <span className="absolute inset-0 rounded-2xl border border-cyan-400/50 animate-ping opacity-30 pointer-events-none" />
              </div>

              {/* Horizontal Laser Scanning Line passing through Logo */}
              <motion.div
                initial={{ left: '-20%', opacity: 0 }}
                animate={{ left: '120%', opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                className="absolute top-1/2 -translate-y-1/2 w-12 h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_12px_#00d9ff] pointer-events-none"
              />
            </motion.div>

            {/* Brand Title Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
              className="space-y-1 mb-8"
            >
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-white">
                TRUTHFACE <span className="gradient-text-cyan font-black">AI</span>
              </h1>
              <p className="text-xs font-mono-tech tracking-[0.2em] text-slate-400 uppercase font-semibold">
                Deepfake Sentinel • AI Forensics Engine
              </p>
            </motion.div>

            {/* HUD Status Sequence Messages */}
            <div className="h-10 flex items-center justify-center mb-6">
              <AnimatePresence mode="wait">
                {step >= 1 && (
                  <motion.div
                    key={`hud-step-${step}`}
                    initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                    transition={{ duration: 0.35 }}
                    className="flex items-center gap-2 text-xs font-mono-tech font-bold"
                  >
                    {React.createElement(hudMessages[Math.min(step - 1, 2)].icon, {
                      className: `w-4 h-4 ${hudMessages[Math.min(step - 1, 2)].color} animate-pulse`
                    })}
                    <span className={hudMessages[Math.min(step - 1, 2)].color}>
                      {hudMessages[Math.min(step - 1, 2)].text}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress Bar Container */}
            <div className="w-64 sm:w-80 h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: step === 1 ? '35%' : step === 2 ? '70%' : '100%' }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 rounded-full shadow-[0_0_12px_rgba(0,217,255,0.6)]"
              />
            </div>

            {/* Subtle Skip button */}
            <button
              onClick={finishIntro}
              className="mt-6 text-[10px] font-mono-tech text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest cursor-pointer"
            >
              [ Press Esc or Click to Skip ]
            </button>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
