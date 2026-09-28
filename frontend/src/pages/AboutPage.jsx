import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Cpu, Database, Eye, Activity, Layers, 
  Terminal, Lock, CheckCircle2, Zap, Server, Code2, 
  FileCode, Sparkles, ArrowRight, Award, BookOpen, AlertTriangle
} from 'lucide-react';

export default function AboutPage({ onGoToStudio }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const archPillars = [
    {
      icon: Cpu,
      title: "In-JVM ONNX Runtime",
      desc: "Zero Python overhead. Inferences execute directly inside Java Spring Boot via native Microsoft ONNX Runtime bindings.",
      tag: "C++ Native Acceleration",
      color: "cyan"
    },
    {
      icon: Eye,
      title: "OpenCV 4.7.0 Face Pipeline",
      desc: "Hardware-accelerated Haar Cascade face localization, multi-scale scanning, histogram equalization, and cropping.",
      tag: "Haar Cascade XML",
      color: "blue"
    },
    {
      icon: Layers,
      title: "Hybrid Digital Forensics",
      desc: "Dual-layer validation pairing deep neural feature extraction with Error Level Analysis (ELA) and FFT frequency anomaly detection.",
      tag: "Multi-Spectral Analysis",
      color: "indigo"
    },
    {
      icon: Database,
      title: "MySQL 8.0 Enterprise Store",
      desc: "ACID-compliant persistence with JPA/Hibernate DDL auto-synchronization and indexed threat intelligence auditing.",
      tag: "Strict Relational DB",
      color: "emerald"
    }
  ];

  const specs = [
    { label: "Backend Core", value: "Java 17+ / Spring Boot 3.2.5" },
    { label: "Inference Engine", value: "Microsoft ONNX Runtime Java 1.17.1" },
    { label: "Vision Processing", value: "OpenCV 4.7.0 Java (OpenPnP Embedded DLLs)" },
    { label: "Facial Classifier", value: "Haar Cascade Frontal Face (908 KB XML)" },
    { label: "Deep Neural Model", value: "Quantized ONNX (model_q4.onnx • 83.28 MB)" },
    { label: "Tensor Dimensions", value: "NCHW Float32 [1, 3, 224, 224]" },
    { label: "Database Engine", value: "MySQL 8.0 Community Server" },
    { label: "Security & RBAC", value: "Spring Security + Stateless JWT (JJWT 0.12.5)" },
    { label: "Frontend Stack", value: "React 18 + Vite + Tailwind CSS + Framer Motion" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 max-w-3xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono-tech uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          Enterprise Cyber Forensics Architecture
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
          Engineered for <span className="text-gradient">Zero-Latency</span> Deepfake Detection
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Deepfake Sentinel is a high-performance cyber-defense system running AI inference directly in the Java Spring Boot virtual machine, eliminating Python IPC latency and multi-server vulnerability surfaces.
        </p>
      </motion.div>

      {/* 4 Pillars Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {archPillars.map((p, idx) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              className="glass-card p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/15 transition-all" />
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:border-cyan-400 transition-colors">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                {p.tag}
              </span>
              <h3 className="text-lg font-heading font-bold text-white mt-3 mb-2">{p.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Technical Architecture Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Explanation */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-7 space-y-6"
        >
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800/80 bg-slate-900/50 space-y-6">
            <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-3">
              <Code2 className="w-6 h-6 text-cyan-400" />
              How the In-JVM Pipeline Works
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              <p>
                Traditional deepfake detection solutions rely on a Python web microservice (Flask/FastAPI) alongside a primary backend. This introduces JSON serialization latency, network serialization overhead, and vulnerable cross-process communication.
              </p>
              <p>
                <strong className="text-cyan-400">Deepfake Sentinel eliminates this completely</strong> by bundling Microsoft ONNX Runtime C++ binaries directly into the Java Virtual Machine. When an image is uploaded:
              </p>
            </div>

            <div className="space-y-3 font-mono-tech text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold shrink-0">1</span>
                <div>
                  <span className="text-white font-bold">OpenCV 4.7.0 Haar Cascade:</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Detects facial boundaries, calculates coordinates $(x, y, w, h)$, and normalizes lighting with histogram equalization.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold shrink-0">2</span>
                <div>
                  <span className="text-white font-bold">Tensor Normalization:</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Bilinearly resizes to $224 \times 224$ and applies standard ImageNet mean $[0.485, 0.456, 0.406]$ and std $[0.229, 0.224, 0.225]$ into a planar CHW FloatBuffer.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold shrink-0">3</span>
                <div>
                  <span className="text-white font-bold">ONNX Runtime Inference:</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Executes forward pass over quantized weights, returning logits evaluated via Softmax activation into real/fake probabilities.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold shrink-0">4</span>
                <div>
                  <span className="text-white font-bold">Forensic Fusion & MySQL Persistence:</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Blends neural scores with ELA and FFT noise variance, commits the audit record to MySQL, and updates daily threat telemetry.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onGoToStudio}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                Launch Detection Studio
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </motion.div>

        {/* Right System Specifications */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-5 space-y-6"
        >
          <div className="glass-card p-6 sm:p-7 rounded-2xl border border-slate-800/80 bg-slate-900/50 space-y-5">
            <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2.5">
              <Terminal className="w-5 h-5 text-cyan-400" />
              Technical Stack Specifications
            </h3>

            <div className="divide-y divide-slate-800/80 text-xs font-mono-tech">
              {specs.map((s, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                  <span className="text-slate-400">{s.label}</span>
                  <span className="text-cyan-300 font-semibold text-right">{s.value}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-3">
              <Award className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                <strong className="text-cyan-400">Viva & Presentation Highlight:</strong> Demonstrates high-concurrency Spring Boot reactive pooling, in-process C++ inference binding, and zero-loss MySQL record persistence.
              </p>
            </div>
          </div>
        </motion.div>

      </div>

    </div>
  );
}
