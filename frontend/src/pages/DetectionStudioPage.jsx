import React, { useState, useRef, useEffect } from 'react';
import { 
  Image, Video, Mic, Camera, UploadCloud, ShieldAlert, ShieldCheck, 
  HelpCircle, Cpu, Clock, RefreshCw, Download, FileText, Scan, Sparkles, 
  AlertCircle, CheckCircle2, Sliders, Waves, Layers, ArrowRight, X, Play,
  Activity, Eye, HardDrive, Server, Shield, Check, Info, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { detectImage, detectVideo, detectAudio, detectWebcamFrame } from '../services/api';
import GaugeChart from '../components/GaugeChart';
import ForensicBars from '../components/ForensicBars';
import BoundingBoxViewer from '../components/BoundingBoxViewer';

export default function DetectionStudioPage({ initialModality = 'image', onScanComplete }) {
  const [activeModality, setActiveModality] = useState(initialModality);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Webcam state
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  const scanPipelineSteps = [
    { title: 'UPLOAD', desc: 'Validating payload integrity' },
    { title: 'FACE DETECTION', desc: 'Running OpenCV 4.7 Haar Cascade' },
    { title: 'PREPROCESSING', desc: 'ImageNet tensor normalization [1, 3, 224, 224]' },
    { title: 'ONNX INFERENCE', desc: 'Executing in-JVM model_q4.onnx forward pass' },
    { title: 'FORENSIC ANALYSIS', desc: 'Computing ELA & FFT frequency metrics' },
    { title: 'VERDICT', desc: 'Committing audit record to MySQL' }
  ];

  const scanStatusMessages = [
    'Initializing in-JVM forensic sieve...',
    'Running OpenCV Haar Cascade facial localization...',
    'Preparing planar FloatBuffer [1, 3, 224, 224] tensor...',
    'Executing forward pass via Microsoft ONNX Runtime Java...',
    'Calculating multi-spectral ELA and FFT anomaly scores...',
    'Persisting forensic audit record to MySQL 8.0...'
  ];

  useEffect(() => {
    setActiveModality(initialModality);
  }, [initialModality]);

  useEffect(() => {
    // Reset file when modality changes
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    stopWebcam();
  }, [activeModality]);

  // Animated pipeline step stepper during analysis
  useEffect(() => {
    let interval;
    if (analyzing) {
      setScanStepIndex(0);
      interval = setInterval(() => {
        setScanStepIndex(prev => (prev < scanPipelineSteps.length - 1 ? prev + 1 : prev));
      }, 700);
    } else {
      setScanStepIndex(0);
    }
    return () => clearInterval(interval);
  }, [analyzing]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (file) => {
    setError(null);
    setResult(null);
    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      setPreviewUrl(URL.createObjectURL(file));
    } else if (file.type.startsWith('audio/')) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const resetSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  const runAnalysis = async () => {
    if (!selectedFile) return;
    setAnalyzing(true);
    setError(null);

    try {
      let res;
      if (activeModality === 'image') {
        res = await detectImage(selectedFile);
      } else if (activeModality === 'video') {
        res = await detectVideo(selectedFile);
      } else if (activeModality === 'audio') {
        res = await detectAudio(selectedFile);
      }
      setResult(res);
      if (onScanComplete) onScanComplete(res);
    } catch (err) {
      const serverMsg = err.response?.data?.error || err.response?.data?.message;
      if (!err.response || err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        setError('INFERENCE ENGINE UNAVAILABLE');
      } else if (err.response.status === 400) {
        setError(serverMsg || 'INVALID MEDIA');
      } else {
        setError(serverMsg || 'INFERENCE FAILED');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  // Webcam controls
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 640 }, height: { ideal: 480 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      setError('Unable to access camera sensor. Please ensure camera permissions are granted.');
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const captureWebcamFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'webcam_capture.jpg', { type: 'image/jpeg' });
      setPreviewUrl(canvas.toDataURL('image/jpeg'));
      setSelectedFile(file);
      setAnalyzing(true);
      try {
        const res = await detectWebcamFrame(file);
        setResult(res);
        if (onScanComplete) onScanComplete(res);
      } catch (err) {
        const serverMsg = err.response?.data?.error || err.response?.data?.message;
        if (!err.response || err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
          setError('INFERENCE ENGINE UNAVAILABLE');
        } else if (err.response.status === 400) {
          setError(serverMsg || 'INVALID MEDIA');
        } else {
          setError(serverMsg || 'INFERENCE FAILED');
        }
      } finally {
        setAnalyzing(false);
      }
    }, 'image/jpeg', 0.92);
  };

  const downloadJsonReport = () => {
    if (!result) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `sentinel_forensic_report_${Date.now()}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const getVerdictDetails = (verdict) => {
    switch (verdict?.toUpperCase()) {
      case 'DEEPFAKE':
        return {
          bg: 'bg-rose-950/70 border-rose-500/60 text-rose-300 shadow-[0_0_35px_rgba(244,63,94,0.25)]',
          badgeBg: 'bg-rose-500 text-black',
          glowText: 'text-rose-400',
          icon: ShieldAlert,
          title: 'DEEPFAKE DETECTED',
          desc: 'High-confidence synthetic facial or acoustic manipulation signatures identified.',
        };
      case 'REAL':
      case 'AUTHENTIC':
        return {
          bg: 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300 shadow-[0_0_35px_rgba(16,185,129,0.25)]',
          badgeBg: 'bg-emerald-500 text-black',
          glowText: 'text-emerald-400',
          icon: ShieldCheck,
          title: 'AUTHENTIC ORGANIC MEDIA',
          desc: 'Natural human biometric features, organic gradient decay, and harmonic noise verified.',
        };
      default:
        return {
          bg: 'bg-amber-950/70 border-amber-500/60 text-amber-300 shadow-[0_0_35px_rgba(245,158,11,0.25)]',
          badgeBg: 'bg-amber-500 text-black',
          glowText: 'text-amber-400',
          icon: AlertCircle,
          title: 'SUSPICIOUS / INCONCLUSIVE',
          desc: 'Compression artifacts, lighting variance, or boundary blending anomalies detected.',
        };
    }
  };

  const modalities = [
    { id: 'image', label: 'IMAGE', icon: Image, formats: 'JPG, PNG, WEBP', limit: '50 MB' },
    { id: 'video', label: 'VIDEO', icon: Video, formats: 'MP4, AVI, WEBM', limit: '150 MB' },
    { id: 'audio', label: 'AUDIO', icon: Mic, formats: 'WAV, MP3, AAC', limit: '50 MB' },
    { id: 'webcam', label: 'LIVE CAMERA', icon: Camera, formats: 'Webcam Feed', limit: 'Realtime' }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-300">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono-tech uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            AI FORENSIC ENGINE • IN-JVM
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
            AI Detection <span className="text-gradient">Studio</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-sans max-w-xl">
            Analyze images, videos and audio using OpenCV + ONNX Runtime directly inside Java Spring Boot.
          </p>
        </div>

        {/* Live System Telemetry Card */}
        <div className="glass-card p-4 rounded-2xl border border-slate-800 bg-slate-950/70 flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 font-mono-tech text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <p className="text-[10px] text-slate-500">SPRING BOOT</p>
              <p className="text-emerald-400 font-bold">ONLINE</p>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <div>
              <p className="text-[10px] text-slate-500">ONNX RUNTIME</p>
              <p className="text-cyan-400 font-bold">READY</p>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <div>
              <p className="text-[10px] text-slate-500">OPENCV 4.7.0</p>
              <p className="text-cyan-400 font-bold">READY</p>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <p className="text-[10px] text-slate-500">MYSQL 8.0</p>
              <p className="text-emerald-400 font-bold">CONNECTED</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MEDIA SELECTOR (PREMIUM SEGMENTED CONTROL) */}
      <div className="flex justify-center">
        <div className="relative inline-flex p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-xl shadow-2xl">
          {modalities.map((m) => {
            const Icon = m.icon;
            const isActive = activeModality === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveModality(m.id)}
                className={`relative z-10 flex items-center gap-2.5 px-4 sm:px-6 py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer select-none ${
                  isActive ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110 text-cyan-400' : ''}`} />
                <span>{m.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeModalityPill"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    className="absolute inset-0 bg-cyan-950/90 border border-cyan-500/50 rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.25)] -z-10"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: UPLOAD WORKSPACE / PREVIEW (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* WEBCAM MODE */}
          {activeModality === 'webcam' ? (
            <div className="glass-card p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono-tech">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Camera className="w-4 h-4" />
                  <span>BIOMETRIC SENSOR STREAM</span>
                </div>
                <span className="text-slate-400">640x480 RAW</span>
              </div>

              <div className="relative aspect-video rounded-xl bg-slate-950 overflow-hidden border border-slate-800 flex items-center justify-center shadow-inner">
                <video ref={videoRef} className="w-full h-full object-cover mirror" playsInline muted />
                <canvas ref={canvasRef} className="hidden" />

                {!cameraActive && (
                  <div className="text-center p-6 space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 mx-auto">
                      <Camera className="w-6 h-6" />
                    </div>
                    <p className="text-xs text-slate-400 font-mono-tech">Sensor offline</p>
                  </div>
                )}

                {cameraActive && <div className="laser-scanner opacity-60" />}
              </div>

              <div className="flex gap-3">
                {!cameraActive ? (
                  <button onClick={startWebcam} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer">
                    <Camera className="w-4 h-4" />
                    <span>Activate Camera Sensor</span>
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={captureWebcamFrame} 
                      disabled={analyzing} 
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {analyzing ? 'Scanning...' : 'Capture & Inspect Frame'}
                    </button>
                    <button 
                      onClick={stopWebcam} 
                      className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-800 font-mono-tech text-xs cursor-pointer transition-colors"
                    >
                      Stop
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* FILE UPLOAD & PREVIEW CARD */
            <div className="space-y-4">
              
              {!selectedFile ? (
                /* DROPZONE CARD */
                <motion.div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleFileDrop}
                  onClick={() => document.getElementById('studio-file-input').click()}
                  whileHover={{ scale: 1.01 }}
                  animate={{ scale: isDragging ? 1.02 : 1 }}
                  className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-10 text-center cursor-pointer transition-all duration-300 overflow-hidden glass-card ${
                    isDragging 
                      ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_35px_rgba(0,229,255,0.25)]' 
                      : 'border-slate-700/70 hover:border-cyan-500/50 bg-slate-900/40'
                  }`}
                >
                  <input
                    id="studio-file-input"
                    type="file"
                    className="hidden"
                    accept={
                      activeModality === 'image'
                        ? 'image/jpeg,image/png,image/webp'
                        : activeModality === 'video'
                        ? 'video/mp4,video/avi,video/quicktime,video/webm'
                        : 'audio/wav,audio/mpeg,audio/aac,audio/ogg'
                    }
                    onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
                  />

                  {/* Subtle Background Glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

                  {/* Animated Upload Icon */}
                  <motion.div 
                    animate={{ y: isDragging ? -4 : 0 }}
                    transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-950 to-blue-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto mb-4 shadow-[0_0_20px_rgba(0,229,255,0.2)]"
                  >
                    <UploadCloud className="w-8 h-8" />
                  </motion.div>

                  <h3 className="text-lg font-heading font-bold text-white mb-1.5">
                    Upload Media for Forensic Scan
                  </h3>
                  <p className="text-xs text-slate-400 mb-6 font-sans">
                    Drag & Drop your media here or <span className="text-cyan-400 font-semibold underline">browse from your device</span>
                  </p>

                  {/* Supported Format Pills */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                    {activeModality === 'image' && ['JPG', 'PNG', 'WEBP'].map(ext => (
                      <span key={ext} className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-[10px] font-mono-tech text-cyan-300">
                        {ext}
                      </span>
                    ))}
                    {activeModality === 'video' && ['MP4', 'AVI', 'WEBM'].map(ext => (
                      <span key={ext} className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-[10px] font-mono-tech text-cyan-300">
                        {ext}
                      </span>
                    ))}
                    {activeModality === 'audio' && ['WAV', 'MP3', 'AAC'].map(ext => (
                      <span key={ext} className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-[10px] font-mono-tech text-cyan-300">
                        {ext}
                      </span>
                    ))}
                  </div>

                  <p className="text-[11px] font-mono-tech text-slate-500">
                    Max payload size: {activeModality === 'video' ? '150 MB' : '50 MB'} • Direct in-JVM Stream
                  </p>
                </motion.div>
              ) : (
                /* PREMIUM FILE PREVIEW CARD */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-6 rounded-3xl border border-cyan-500/30 bg-slate-900/60 space-y-5"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono-tech">
                    <span className="text-cyan-400 font-bold uppercase">READY FOR IN-JVM ANALYSIS</span>
                    <button
                      onClick={resetSelection}
                      className="text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>

                  {/* Thumbnail / Media Element */}
                  <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center min-h-[180px] max-h-[260px] relative">
                    {activeModality === 'image' && previewUrl && (
                      <img src={previewUrl} alt="Target" className="max-h-[240px] w-auto object-contain rounded-xl" />
                    )}

                    {activeModality === 'video' && previewUrl && (
                      <video src={previewUrl} controls className="max-h-[240px] w-full rounded-xl" />
                    )}

                    {activeModality === 'audio' && (
                      <div className="w-full p-6 text-center space-y-3">
                        <Waves className="w-10 h-10 text-cyan-400 mx-auto animate-pulse" />
                        <p className="text-xs font-mono-tech text-slate-300">{selectedFile.name}</p>
                        {previewUrl && <audio src={previewUrl} controls className="w-full mt-2" />}
                      </div>
                    )}
                  </div>

                  {/* File Metadata Info */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs font-mono-tech">
                    <div className="truncate pr-3">
                      <p className="text-white font-bold truncate">{selectedFile.name}</p>
                      <p className="text-[10px] text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type || activeModality.toUpperCase()}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] shrink-0 font-bold">
                      {activeModality.toUpperCase()}
                    </span>
                  </div>

                  {/* Trigger Analysis Button */}
                  <button
                    onClick={runAnalysis}
                    disabled={analyzing}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-heading font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(0,229,255,0.3)] transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Scan className="w-4 h-4" />
                    <span>Analyze Media with ONNX</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* Error Banner */}
              {error && (
                <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-mono-tech flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Inference Exception:</span>
                      <span>{error}</span>
                    </div>
                  </div>
                  {selectedFile && (
                    <button
                      onClick={runAnalysis}
                      disabled={analyzing}
                      className="px-3 py-1.5 rounded-xl bg-rose-900/60 hover:bg-rose-900 border border-rose-500/50 text-rose-200 font-mono-tech text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
                      <span>RETRY ANALYSIS</span>
                    </button>
                  )}
                </div>
              )}

            </div>
          )}

        </div>

        {/* RIGHT COLUMN: AI SCANNING ANIMATION OR RESULTS (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {analyzing ? (
            /* 4. AI ANALYSIS ANIMATION (PREMIUM FORENSIC SCANNER) */
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-8 sm:p-10 rounded-3xl border border-cyan-500/30 bg-slate-900/70 text-center space-y-8 min-h-[460px] flex flex-col justify-between shadow-[0_0_50px_rgba(0,229,255,0.15)]"
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-[11px] font-mono-tech uppercase">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  IN-JVM SCANNING IN PROGRESS
                </div>
                <h3 className="text-2xl font-heading font-extrabold text-white">
                  Executing Forensic Neural Sieve
                </h3>
                <p className="text-xs font-mono-tech text-cyan-300 h-6">
                  {scanStatusMessages[scanStepIndex] || 'Processing deep learning tensors...'}
                </p>
              </div>

              {/* Center Radar Scanner Sweep */}
              <div className="relative w-36 h-36 mx-auto my-2 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-cyan-500/20 radar-rotate" />
                <div className="absolute inset-2 rounded-full border border-indigo-500/30 radar-rotate-reverse" />
                <div className="absolute inset-6 rounded-full border border-cyan-500/40 animate-ping opacity-30" />
                <div className="w-20 h-20 rounded-full bg-slate-950 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(0,229,255,0.3)]">
                  <Cpu className="w-8 h-8 animate-pulse" />
                </div>
              </div>

              {/* Sequential Pipeline Steps */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-left font-mono-tech text-xs">
                {scanPipelineSteps.map((step, idx) => {
                  const isDone = idx < scanStepIndex;
                  const isCurrent = idx === scanStepIndex;
                  return (
                    <div 
                      key={step.title}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isCurrent 
                          ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.2)]' 
                          : isDone 
                          ? 'bg-slate-950/80 border-emerald-500/40 text-emerald-400' 
                          : 'bg-slate-950/40 border-slate-800 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-[10px]">{step.title}</span>
                        {isDone && <Check className="w-3 h-3 text-emerald-400" />}
                        {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
                      </div>
                      <p className="text-[9px] text-slate-400 truncate">{step.desc}</p>
                    </div>
                  );
                })}
              </div>

            </motion.div>
          ) : result ? (
            /* 5. RESULT CARD (POWERED BY REAL BACKEND DATA) */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-6 shadow-2xl"
            >
              
              {/* Verdict Header Banner */}
              {(() => {
                const details = getVerdictDetails(result.verdict);
                const Icon = details.icon;
                const fakeProb = result.fakeProbability ?? 0;
                const realProb = Math.max(0, 100 - fakeProb);

                return (
                  <div className="space-y-6">
                    <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${details.bg}`}>
                      <div className="flex items-center gap-3.5">
                        <div className="p-3 rounded-xl bg-black/40 border border-white/10 shrink-0">
                          <Icon className="w-8 h-8" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-mono-tech uppercase tracking-widest opacity-75">
                              FORENSIC ANALYSIS COMPLETE
                            </span>
                          </div>
                          <h2 className="text-2xl font-heading font-black tracking-tight">{details.title}</h2>
                          <p className="text-xs font-sans opacity-90 mt-0.5">{details.desc}</p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right font-mono-tech shrink-0 bg-black/30 p-2.5 rounded-xl border border-white/10">
                        <p className="text-[10px] opacity-75 uppercase">CONFIDENCE SCORE</p>
                        <p className="text-2xl font-black text-white">{result.confidenceScore}%</p>
                      </div>
                    </div>

                    {/* Speedometer & Dual Probability Bars */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-950/70 p-6 rounded-2xl border border-slate-800">
                      
                      {/* Circular Gauge */}
                      <div className="md:col-span-5 flex justify-center border-b md:border-b-0 md:border-r border-slate-800/80 pb-4 md:pb-0">
                        <GaugeChart probability={result.fakeProbability} verdict={result.verdict} />
                      </div>

                      {/* Dual Probability Bars & Metadata */}
                      <div className="md:col-span-7 space-y-4 font-mono-tech text-xs pl-0 md:pl-2">
                        
                        {/* Real vs Deepfake Probability Bars */}
                        <div className="space-y-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                          <div>
                            <div className="flex justify-between text-[11px] mb-1">
                              <span className="text-slate-400">REAL PROBABILITY</span>
                              <span className="text-emerald-400 font-bold">{realProb.toFixed(2)}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${realProb}%` }}
                                transition={{ duration: 0.8 }}
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-[11px] mb-1">
                              <span className="text-slate-400">DEEPFAKE PROBABILITY</span>
                              <span className="text-rose-400 font-bold">{fakeProb.toFixed(2)}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${fakeProb}%` }}
                                transition={{ duration: 0.8 }}
                                className="h-full bg-gradient-to-r from-rose-500 to-red-600 rounded-full"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Compact Metadata Tags */}
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800">
                            <span className="text-slate-500 block text-[9px]">LATENCY</span>
                            <span className="text-cyan-400 font-bold">{result.processingTimeMs} ms</span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800">
                            <span className="text-slate-500 block text-[9px]">ENGINE</span>
                            <span className="text-purple-300 font-bold truncate block">{result.modelUsed ? 'ONNX Runtime' : 'Java Model'}</span>
                          </div>

                          {result.facesDetected !== undefined && (
                            <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800">
                              <span className="text-slate-500 block text-[9px]">FACES LOCATED</span>
                              <span className="text-emerald-400 font-bold">{result.facesDetected} Subject(s)</span>
                            </div>
                          )}

                          <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800">
                            <span className="text-slate-500 block text-[9px]">MEDIA TYPE</span>
                            <span className="text-white font-bold">{result.mediaType || activeModality.toUpperCase()}</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 6. FACE VISUALIZATION WITH BOUNDING BOXES */}
              {previewUrl && result.faceBoxes && result.faceBoxes.length > 0 && (
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono-tech">
                    <span className="text-cyan-400 font-bold flex items-center gap-2">
                      <Scan className="w-3.5 h-3.5" />
                      BIOMETRIC HUD FACE LOCALIZATION
                    </span>
                    <span className="text-slate-500">OPENCV 4.7 HAAR CASCADE</span>
                  </div>
                  <BoundingBoxViewer imageSrc={previewUrl} faceBoxes={result.faceBoxes} verdict={result.verdict} />
                </div>
              )}

              {/* 7. MULTI-SPECTRAL FORENSIC METRICS */}
              {(result.forensicMetrics || result.aggregateForensics) && (
                <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <ForensicBars metrics={result.forensicMetrics || result.aggregateForensics} />
                </div>
              )}

              {/* Explanation Summary */}
              {result.explanation && (
                <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-slate-300 leading-relaxed font-sans flex items-start gap-3">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-cyan-300 font-semibold block mb-0.5">Forensic Intelligence Summary:</strong>
                    <span>{result.explanation}</span>
                  </div>
                </div>
              )}

              {/* 8. ACTION BAR */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={downloadJsonReport}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 text-xs font-mono-tech flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON Report</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-300 border border-slate-800 text-xs font-mono-tech flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Print / PDF Report</span>
                  </button>
                </div>

                <button
                  onClick={resetSelection}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Analyze Another</span>
                </button>
              </div>

            </motion.div>
          ) : (
            /* 9. EMPTY STATE VISUALIZATION */
            <div className="glass-card p-12 text-center flex flex-col items-center justify-center min-h-[460px] border border-slate-800/80 bg-slate-900/30 rounded-3xl space-y-6">
              
              {/* Rotating Detection Rings */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-cyan-500/20 radar-rotate" />
                <div className="absolute inset-3 rounded-full border border-indigo-500/20 radar-rotate-reverse" />
                <div className="w-16 h-16 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-slate-500 shadow-inner">
                  <Shield className="w-8 h-8 text-cyan-500/60" />
                </div>
              </div>

              <div className="space-y-2 max-w-sm">
                <h3 className="text-lg font-heading font-bold text-white">
                  Ready for Forensic Analysis
                </h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Upload an image, video, audio file, or activate the camera lens on the left to begin in-JVM deepfake detection.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 font-mono-tech text-[10px] text-slate-500">
                <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800/80">IN-JVM ONNX</span>
                <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800/80">OPENCV 4.7</span>
                <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800/80">MYSQL PERSISTENCE</span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
