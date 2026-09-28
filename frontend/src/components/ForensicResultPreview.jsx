import React, { useRef } from 'react';
import { ShieldCheck, CheckCircle2, Cpu, Clock, Scan, Sparkles, Layers, FileText, Info } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

export default function ForensicResultPreview() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      
      {/* Section Header with Scroll Reveal */}
      <motion.div 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4"
      >
        <div>
          <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest block mb-1">
            DEMONSTRATION & DOSSIER PREVIEW
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
            Forensic Result Interface
          </h2>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono-tech text-slate-300">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Notice: Live In-JVM Output Structure</span>
        </div>
      </motion.div>

      {/* Main Dossier Card with Scroll Reveal */}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel p-6 sm:p-8 relative overflow-hidden border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.1)] rounded-3xl"
      >
        
        {/* Single Entrance Scanning Line */}
        {isInView && (
          <motion.div 
            initial={{ top: '0%', opacity: 0.9 }}
            animate={{ top: '100%', opacity: 0 }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#00d9ff] pointer-events-none z-30"
          />
        )}

        {/* Top Watermark Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-heading font-bold text-white">sample_portrait_01.jpg</span>
                <span className="badge-tech badge-authentic">
                  AUTHENTIC
                </span>
                <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
                  SAMPLE DOSSIER
                </span>
              </div>
              <p className="text-xs font-mono-tech text-slate-400 mt-0.5">
                HASH: SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
              </p>
            </div>
          </div>

          <div className="text-right font-mono-tech">
            <p className="text-xs text-slate-400">DECISION CONFIDENCE</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-heading">
              {isInView ? <AnimatedCounter value={92.4} isPercentage={true} decimals={1} duration={1.5} /> : '0.0%'}
            </p>
          </div>
        </div>

        {/* Middle Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-center">
          
          {/* Left: Probabilities & Forensic Metrics */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Probability Comparison Bar */}
            <div className="glass-card p-5 border-slate-800 rounded-2xl">
              <div className="flex items-center justify-between text-xs font-mono-tech mb-2">
                <span className="text-emerald-400 font-bold">● AUTHENTIC NATURAL: 92.4%</span>
                <span className="text-rose-400 font-bold">● DEEPFAKE PROBABILITY: 7.6%</span>
              </div>

              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800 p-0.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={isInView ? { width: '92.4%' } : {}}
                  transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" 
                />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={isInView ? { width: '7.6%' } : {}}
                  transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-gradient-to-r from-rose-500 to-red-600 rounded-full" 
                />
              </div>
            </div>

            {/* 4 Core Forensics Breakdown Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 font-mono-tech">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">ELA Compression Anomaly</span>
                  <span className="text-emerald-400 font-bold">12.1%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={isInView ? { width: '12.1%' } : {}}
                    transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-emerald-400 rounded-full" 
                  />
                </div>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 font-mono-tech">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Boundary Blend Seam</span>
                  <span className="text-emerald-400 font-bold">8.4%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={isInView ? { width: '8.4%' } : {}}
                    transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-emerald-400 rounded-full" 
                  />
                </div>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 font-mono-tech">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Frequency Grid Artifacts</span>
                  <span className="text-emerald-400 font-bold">14.8%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={isInView ? { width: '14.8%' } : {}}
                    transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-emerald-400 rounded-full" 
                  />
                </div>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 font-mono-tech">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Texture Noise Uniformity</span>
                  <span className="text-emerald-400 font-bold">11.0%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={isInView ? { width: '11%' } : {}}
                    transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-emerald-400 rounded-full" 
                  />
                </div>
              </div>

            </div>

            {/* AI Forensic Explanation */}
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-slate-300 leading-relaxed font-sans">
              <strong className="text-cyan-300 font-semibold block mb-1 font-mono-tech">AI Forensic Explanation:</strong>
              Authentic natural media indicators verified (92.4% authenticity). Consistent surface texture, organic skin micro-noise distribution, and natural gradient transitions across all localized face regions. No boundary blending seams or synthetic frequency grids detected.
            </div>

          </div>

          {/* Right: Technical Metadata Matrix */}
          <div className="lg:col-span-5 bg-slate-950/80 rounded-2xl border border-slate-800 p-5 font-mono-tech space-y-3">
            <span className="text-[11px] text-slate-400 uppercase tracking-widest block border-b border-slate-800 pb-2">
              TECHNICAL DOSSIER TELEMETRY
            </span>

            <div className="flex justify-between text-xs py-1 border-b border-slate-900">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Scan className="w-3.5 h-3.5 text-cyan-400" /> Face Detected:
              </span>
              <span className="text-white font-bold">1 Subject (Haar Cascade)</span>
            </div>

            <div className="flex justify-between text-xs py-1 border-b border-slate-900">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Processing Latency:
              </span>
              <span className="text-cyan-400 font-bold">68 ms (In-Process)</span>
            </div>

            <div className="flex justify-between text-xs py-1 border-b border-slate-900">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" /> Inference Engine:
              </span>
              <span className="text-purple-300 font-bold">ONNX Runtime Java</span>
            </div>

            <div className="flex justify-between text-xs py-1 border-b border-slate-900">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" /> Vision Engine:
              </span>
              <span className="text-blue-300 font-bold">OpenCV 4.7.0 Java</span>
            </div>

            <div className="flex justify-between text-xs py-1">
              <span className="text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Model Signature:
              </span>
              <span className="text-emerald-400 font-bold">model_q4.onnx (224x224)</span>
            </div>

          </div>

        </div>

      </motion.div>

    </section>
  );
}
