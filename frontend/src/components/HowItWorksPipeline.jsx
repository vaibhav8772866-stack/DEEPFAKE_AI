import React, { useRef } from 'react';
import { UploadCloud, Sliders, Scan, Cpu, ShieldCheck, ArrowRight, CheckCircle2, Search } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function HowItWorksPipeline() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 50%']
  });

  const scaleLine = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  const steps = [
    {
      num: '01',
      title: 'UPLOAD',
      subtitle: 'Binary Stream Ingestion',
      desc: 'Multipart media payload ingested directly to Java Spring Boot with zero intermediate disk write overhead.',
      icon: UploadCloud,
      color: 'text-cyan-400',
      border: 'border-cyan-500/40',
      glow: 'shadow-[0_0_25px_rgba(0,217,255,0.3)]',
    },
    {
      num: '02',
      title: 'PREPROCESS',
      subtitle: 'Stream Normalization',
      desc: 'Buffered image streams parsed into native memory, converted to standardized RGB matrices for biometric inspection.',
      icon: Sliders,
      color: 'text-blue-400',
      border: 'border-blue-500/40',
      glow: 'shadow-[0_0_25px_rgba(59,130,246,0.3)]',
    },
    {
      num: '03',
      title: 'FACE DETECTION',
      subtitle: 'OpenCV Haar Matrix',
      desc: 'In-JVM OpenCV 4.7.0 executes multi-scale Haar Cascade face detection, matrix calibration, and 224x224 crop alignment.',
      icon: Scan,
      color: 'text-indigo-400',
      border: 'border-indigo-500/40',
      glow: 'shadow-[0_0_25px_rgba(99,102,241,0.3)]',
    },
    {
      num: '04',
      title: 'ONNX INFERENCE',
      subtitle: 'Quantized Neural Pass',
      desc: 'Microsoft ONNX Runtime Java evaluates 1x3x224x224 float tensors through model_q4.onnx with sub-75ms latency.',
      icon: Cpu,
      color: 'text-purple-400',
      border: 'border-purple-500/40',
      glow: 'shadow-[0_0_25px_rgba(168,85,247,0.3)]',
    },
    {
      num: '05',
      title: 'FORENSIC ANALYSIS',
      subtitle: 'Multi-Spectral Sieve',
      desc: 'Dual-layer analysis calculates Error Level Analysis (ELA), Laplacian boundary seams, frequency FFT, and texture noise.',
      icon: Search,
      color: 'text-rose-400',
      border: 'border-rose-500/40',
      glow: 'shadow-[0_0_25px_rgba(244,63,94,0.3)]',
    },
    {
      num: '06',
      title: 'VERDICT',
      subtitle: 'Persistence Ledger',
      desc: 'Weighted decision engine renders final verdict, persists audit dossier to MySQL, and dispatches JSON telemetry.',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      border: 'border-emerald-500/40',
      glow: 'shadow-[0_0_25px_rgba(16,185,129,0.3)]',
    },
  ];

  return (
    <section 
      ref={containerRef}
      id="pipeline-section" 
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80 relative"
    >
      
      {/* Section Header with Scroll Reveal */}
      <motion.div 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest block mb-2">
          IN-JVM FORENSIC PIPELINE
        </span>
        <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mb-4">
          How Deepfake Sentinel Works
        </h2>
        <p className="text-base text-slate-300 font-sans">
          6-Stage in-process digital forensic pipeline executing within a unified Java Spring Boot JVM.
        </p>
      </motion.div>

      {/* 6-Step Horizontal / Responsive Grid */}
      <div className="relative">
        
        {/* Scroll-Illuminated Connecting Beam (Desktop) */}
        <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 -translate-y-14 bg-slate-900 z-0 rounded-full overflow-hidden">
          <motion.div 
            style={{ scaleX: scaleLine }}
            className="w-full h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-400 origin-left shadow-[0_0_15px_rgba(0,217,255,0.8)]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5 relative z-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, scale: 0.94, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ 
                  duration: 0.85, 
                  delay: idx * 0.1, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass-card p-5 flex flex-col justify-between items-center text-center relative group hover:border-cyan-400 transition-all rounded-2xl"
              >
                {/* Node Number Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-mono-tech font-bold text-cyan-300 shadow flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>STEP {step.num}</span>
                </div>

                {/* Node Icon Circle */}
                <div className={`w-13 h-13 rounded-2xl bg-slate-900/90 border ${step.border} flex items-center justify-center ${step.color} ${step.glow} mb-4 mt-2 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Title & Subtitle */}
                <div className="mb-2">
                  <h3 className="text-sm font-heading font-extrabold text-white tracking-wide">
                    {step.title}
                  </h3>
                  <p className="text-[10px] font-mono-tech text-cyan-400 font-semibold">
                    {step.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  {step.desc}
                </p>

              </motion.div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
