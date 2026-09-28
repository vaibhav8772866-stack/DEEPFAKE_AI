import React from 'react';
import { Image, Video, Mic, Camera, ArrowRight, ShieldCheck, Cpu, Waves, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudioPreview({ onSelectModality }) {
  const modalities = [
    {
      id: 'image',
      title: 'Image Forensics',
      subtitle: 'Face Localization + ONNX Classification',
      description: 'Performs multi-scale Haar Cascade face extraction, Error Level Analysis (ELA), Laplacian boundary seam detection, and 224x224 ONNX neural classification.',
      formats: ['JPG', 'JPEG', 'PNG', 'WEBP'],
      icon: Image,
      badge: 'IMAGE PIPELINE',
      glow: 'hover:shadow-[0_0_35px_rgba(0,217,255,0.25)]',
      border: 'hover:border-cyan-400',
    },
    {
      id: 'video',
      title: 'Video Forensics',
      subtitle: 'Frame Sampling + Temporal Inconsistency',
      description: 'Ingests video streams via OpenCV VideoCapture, isolates sequential frames, calculates inter-frame facial jitter, and computes temporal artifact decay scores.',
      formats: ['MP4', 'AVI', 'MOV', 'WEBM'],
      icon: Video,
      badge: 'VIDEO PIPELINE',
      glow: 'hover:shadow-[0_0_35px_rgba(99,102,241,0.25)]',
      border: 'hover:border-indigo-400',
    },
    {
      id: 'audio',
      title: 'Audio Forensics',
      subtitle: 'Spectral Feature & Voice Clone Sieve',
      description: 'Extracts acoustic Zero-Crossing Rate, evaluates spectral centroid harmonic decay, and identifies high-frequency frequency brickwall cutoffs.',
      formats: ['WAV', 'MP3', 'AAC', 'OGG'],
      icon: Mic,
      badge: 'AUDIO PIPELINE',
      glow: 'hover:shadow-[0_0_35px_rgba(168,85,247,0.25)]',
      border: 'hover:border-purple-400',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      
      {/* Section Header with Scroll Reveal */}
      <motion.div 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest block mb-2">
          IN-JVM MULTI-MODAL LABORATORY
        </span>
        <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mb-4">
          AI Detection Studio
        </h2>
        <p className="text-base text-slate-300">
          Inspect images, videos and audio for synthetic manipulation and biometric impersonation with millisecond in-process inference.
        </p>
      </motion.div>

      {/* 3 Modality Cards with Staggered Scroll Reveal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-8">
        {modalities.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.96, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ 
                duration: 0.85, 
                delay: idx * 0.12, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              whileHover={{ y: -6, scale: 1.015 }}
              className={`glass-card p-7 flex flex-col justify-between group transition-all duration-300 ${item.glow} ${item.border}`}
            >
              <div>
                {/* Top Row: Icon + Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:border-cyan-500/50 group-hover:text-cyan-300 transition-all shadow-inner">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="badge-tech">
                    {item.badge}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-xl font-heading font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs font-mono-tech text-cyan-400/90 mb-3">
                  {item.subtitle}
                </p>

                {/* Description */}
                <p className="text-sm text-slate-300 leading-relaxed mb-6 font-sans">
                  {item.description}
                </p>
              </div>

              <div>
                {/* Formats Pills */}
                <div className="flex flex-wrap items-center gap-1.5 mb-6 pt-4 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono-tech text-slate-400 mr-1">FORMATS:</span>
                  {item.formats.map((fmt) => (
                    <span key={fmt} className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-slate-900 border border-slate-700/80 text-slate-300">
                      .{fmt.toLowerCase()}
                    </span>
                  ))}
                </div>

                {/* Scan Button */}
                <button
                  onClick={() => onSelectModality(item.id)}
                  className="w-full btn-cyber-secondary justify-center text-xs py-2.5 group-hover:border-cyan-400 group-hover:text-cyan-300 group-hover:bg-cyan-950/40 transition-all cursor-pointer"
                >
                  <span>Launch {item.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

            </motion.div>
          );
        })}
      </div>

      {/* Live Webcam Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel p-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 via-slate-900/80 to-indigo-950/30"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)] shrink-0">
            <Camera className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-heading font-bold text-white">Live Camera Sensor Feed</h4>
              <span className="px-2 py-0.5 text-[9px] font-mono-tech font-bold uppercase rounded bg-rose-950/80 text-rose-400 border border-rose-800/60 animate-pulse">
                REAL-TIME
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 font-sans">
              Inspect physical camera stream frame-by-frame with interactive face bounding boxes and live biometric spoof analysis.
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectModality('webcam')}
          className="btn-cyber-primary text-xs py-2.5 px-5 shrink-0 cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span>Open Live Camera</span>
        </button>
      </motion.div>

    </section>
  );
}
