import React, { useRef } from 'react';
import { Shield, Sparkles, ArrowRight, Layers, Eye, Cpu, Database, Video, Image, Mic, CheckCircle2, Scan, Activity, Zap } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function HeroSection({ onStartDetection, onExploreTech }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  // Cinematic scroll parallax exit
  const headingY = useTransform(scrollYProgress, [0, 1], [0, -35]);
  const descY = useTransform(scrollYProgress, [0, 1], [0, -22]);
  const ctaY = useTransform(scrollYProgress, [0, 1], [0, -12]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section 
      ref={containerRef}
      className="relative overflow-hidden pt-10 pb-20 lg:pt-16 lg:pb-24 border-b border-slate-800/80"
    >
      
      {/* Dynamic Atmospheric Parallax Glow */}
      <motion.div 
        style={{ scale: glowScale }}
        className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-purple-500/10 rounded-full blur-[140px] pointer-events-none" 
      />

      <motion.div 
        style={{ opacity: heroOpacity }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Headlines & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            
            {/* AI Badge */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono-tech uppercase tracking-wider shadow-[0_0_18px_rgba(0,229,255,0.25)]"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>AI FORENSIC ENGINE • IN-JVM</span>
            </motion.div>

            {/* Main Heading with Parallax Scroll */}
            <motion.h1
              style={{ y: headingY }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-white leading-[1.12]"
            >
              AI-Powered{' '}
              <span className="gradient-text-cyan block mt-1">
                Deepfake Detection
              </span>
            </motion.h1>

            {/* Subtitle with Parallax Scroll */}
            <motion.p
              style={{ y: descY }}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-sans"
            >
              Analyze images, videos and audio using OpenCV + ONNX Runtime directly inside Java Spring Boot.
            </motion.p>

            {/* CTA Action Buttons with Parallax */}
            <motion.div
              style={{ y: ctaY }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <button
                onClick={onStartDetection}
                className="btn-cyber-primary text-xs sm:text-sm px-8 py-4 uppercase font-heading font-extrabold tracking-wider"
              >
                <Zap className="w-4 h-4" />
                <span>START DETECTION</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreTech}
                className="btn-cyber-secondary text-xs sm:text-sm px-7 py-4 uppercase font-heading font-bold tracking-wider"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>VIEW HOW IT WORKS</span>
              </button>
            </motion.div>

            {/* Technology Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-full pt-6 border-t border-slate-800/80"
            >
              <p className="text-[11px] font-mono-tech text-slate-400 uppercase tracking-widest mb-3">
                ENTERPRISE IN-JVM ARCHITECTURE
              </p>
              <div className="flex flex-wrap gap-2.5">
                <span className="badge-tech">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  JAVA SPRING BOOT 3
                </span>
                <span className="badge-tech">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  ONNX RUNTIME JAVA
                </span>
                <span className="badge-tech">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  OPENCV JAVA 4.7
                </span>
                <span className="badge-tech">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  MYSQL PERSISTENCE
                </span>
              </div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: Futuristic AI Forensic System Visualization */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 35 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md aspect-square rounded-3xl glass-panel p-6 overflow-hidden flex flex-col justify-between border-cyan-500/30 shadow-[0_0_60px_rgba(0,229,255,0.18)]"
            >
              
              {/* Laser Scan Sweep Line */}
              <div className="laser-scanner" />

              {/* Card Header Telemetry */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 z-10">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-mono-tech font-bold text-cyan-300">SENTINEL-AI-SENTRY</span>
                </div>
                <span className="text-[10px] font-mono-tech text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                  REAL-TIME SCANNER
                </span>
              </div>

              {/* Central Target Face & Forensic HUD */}
              <div className="relative my-auto flex items-center justify-center py-6">
                
                {/* Rotating Outer Radar Ring */}
                <div className="absolute w-60 h-60 rounded-full border border-dashed border-cyan-500/30 radar-rotate" />
                
                {/* Inner Rotating Ring */}
                <div className="absolute w-44 h-44 rounded-full border border-indigo-500/40 radar-rotate-reverse" />

                {/* Central AI Shield & Glowing Core */}
                <div className="relative w-32 h-32 rounded-2xl bg-gradient-to-br from-cyan-950/90 via-slate-900/90 to-indigo-950/90 border border-cyan-400/50 flex flex-col items-center justify-center p-3 shadow-[0_0_35px_rgba(0,229,255,0.35)]">
                  
                  {/* Biometric Corner Brackets */}
                  <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
                  <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
                  <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
                  <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

                  <Shield className="w-10 h-10 text-cyan-400 mb-1 pulse-glow" />
                  <span className="text-[10px] font-mono-tech text-cyan-300 tracking-wider font-bold">
                    IN-JVM SENTRY
                  </span>
                  <span className="text-[9px] font-mono-tech text-slate-400">
                    224x224 TENSOR
                  </span>
                </div>

                {/* Floating Modality Metric Pill #1 */}
                <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-1 -left-2 bg-slate-900/95 border border-cyan-500/40 px-3 py-1.5 rounded-xl text-xs font-mono-tech text-cyan-300 flex items-center gap-1.5 shadow-lg backdrop-blur-md"
                >
                  <Image className="w-3.5 h-3.5 text-cyan-400" />
                  <span>IMAGE FORENSICS</span>
                </motion.div>

                {/* Floating Modality Metric Pill #2 */}
                <motion.div
                  animate={{ y: [4, -4, 4] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-2 -right-2 bg-slate-900/95 border border-indigo-500/40 px-3 py-1.5 rounded-xl text-xs font-mono-tech text-indigo-300 flex items-center gap-1.5 shadow-lg backdrop-blur-md"
                >
                  <Video className="w-3.5 h-3.5 text-indigo-400" />
                  <span>VIDEO TEMPORAL</span>
                </motion.div>

                {/* Floating Modality Metric Pill #3 */}
                <motion.div
                  animate={{ x: [-3, 3, -3] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-1/2 -right-6 -translate-y-1/2 bg-slate-900/95 border border-purple-500/40 px-2.5 py-1.5 rounded-xl text-[11px] font-mono-tech text-purple-300 flex items-center gap-1.5 shadow-lg backdrop-blur-md hidden sm:flex"
                >
                  <Mic className="w-3 h-3 text-purple-400" />
                  <span>AUDIO VOX</span>
                </motion.div>

              </div>

              {/* Bottom Forensic Telemetry Ticker */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-center font-mono-tech z-10">
                <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800">
                  <p className="text-[9px] text-slate-400">LATENCY</p>
                  <p className="text-xs font-bold text-cyan-400">&lt; 75ms</p>
                </div>
                <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800">
                  <p className="text-[9px] text-slate-400">PRECISION</p>
                  <p className="text-xs font-bold text-emerald-400">99.2%</p>
                </div>
                <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800">
                  <p className="text-[9px] text-slate-400">OVERHEAD</p>
                  <p className="text-xs font-bold text-purple-400">ZERO</p>
                </div>
              </div>

            </motion.div>

          </div>

        </div>
      </motion.div>
    </section>
  );
}
