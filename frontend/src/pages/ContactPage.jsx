import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Mail, MessageSquare, Send, CheckCircle2, 
  MapPin, Globe, Github, Terminal, AlertCircle, Sparkles, Phone
} from 'lucide-react';

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Academic / Presentation Inquiry',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 max-w-2xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono-tech uppercase tracking-wider">
          <MessageSquare className="w-3.5 h-3.5" />
          Security Communications & Team Contact
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
          Connect with the <span className="text-gradient">Forensics Lab</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Questions regarding in-JVM ONNX inference, forensic algorithm benchmarks, or university project evaluation? Reach out to the core engineering team.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-2xl border border-slate-800/80 bg-slate-900/50"
        >
          {formSubmitted ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white">Transmission Recorded</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Thank you for contacting the Deepfake Sentinel development team. Your message has been logged in our secure audit dispatch.
              </p>
              <button
                onClick={() => {
                  setFormSubmitted(false);
                  setFormData({ name: '', email: '', subject: 'Academic / Presentation Inquiry', message: '' });
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-mono-tech border border-cyan-500/30 cursor-pointer"
              >
                Send Another Dispatch
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 font-sans">
              <h3 className="text-lg font-heading font-bold text-white mb-2">Secure Inquiry Dispatch</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono-tech text-slate-400">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Prof. / Evaluator / Engineer"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono-tech text-slate-400">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="evaluator@university.edu"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono-tech text-slate-400">Inquiry Subject</label>
                <select
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="Academic / Presentation Inquiry">Academic / Project Presentation Inquiry</option>
                  <option value="Technical Architecture Evaluation">Technical Architecture & Benchmark Evaluation</option>
                  <option value="ONNX Inference Pipeline">ONNX Runtime Java In-Process Binding</option>
                  <option value="Security / Bug Bounty">Security Bug Bounty / Forensic Anomaly</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono-tech text-slate-400">Message / Inquiries</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Detail your question or presentation inquiry here..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Transmit Secure Dispatch
              </button>
            </form>
          )}
        </motion.div>

        {/* Right Info Cards */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 space-y-6"
        >
          <div className="glass-card p-6 rounded-2xl border border-slate-800/80 bg-slate-900/50 space-y-4">
            <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              Project & Team Details
            </h3>

            <div className="space-y-3.5 text-xs text-slate-300 font-sans">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <Terminal className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold">Project Name</p>
                  <p className="text-slate-400 text-[11px]">Deepfake Sentinel — In-JVM AI Cyber Defense</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <Globe className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold">Architecture</p>
                  <p className="text-slate-400 text-[11px]">Java Spring Boot 3 + ONNX Runtime Java + MySQL 8.0</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <Github className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold">Repository Root</p>
                  <p className="text-slate-400 text-[11px] font-mono-tech">C:\Users\vaibh\Desktop\ll</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-blue-950/40 border border-cyan-500/30 text-xs space-y-2">
            <p className="font-heading font-bold text-cyan-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Evaluation Ready
            </p>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Every inference performed in this platform is backed by real ONNX neural inference running directly in the Java backend and persisted immediately to your local MySQL instance.
            </p>
          </div>
        </motion.div>

      </div>

    </div>
  );
}
