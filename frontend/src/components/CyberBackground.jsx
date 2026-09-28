import React, { useEffect, useRef, useState } from 'react';

export default function CyberBackground() {
  const canvasRef = useRef(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [scrollYOffset, setScrollYOffset] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let rafId;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setScrollYOffset(window.scrollY * 0.12);
      });
    };

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = ((e.clientX / innerWidth) - 0.5) * 16;
      const y = ((e.clientY / innerHeight) - 0.5) * 16;
      setMouseOffset({ x, y });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // LAYER 2: High-Density Particle Field (140-160 on Desktop)
    const getDensity = () => {
      if (width < 768) return 50;
      if (width < 1024) return 90;
      return 150;
    };

    const particleCount = getDensity();
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2.2 + 0.6,
      color: Math.random() > 0.35 ? 'rgba(0, 217, 255, ' : 'rgba(99, 102, 241, ',
      alpha: Math.random() * 0.45 + 0.1,
      pulseSpeed: Math.random() * 0.03 + 0.01,
      pulseAngle: Math.random() * Math.PI * 2,
    }));

    // LAYER 6: Telemetry Data Rain Drops
    const telemetryTokens = [
      '0x7F', 'ONNX_JVM', 'FACE_HASH', '99.2%', 'FFT_SCAN',
      '0xA4', 'IM_224', 'AUDIT_OK', '0x1C', 'SENTRY_AI',
      '0x3E9', 'DEEPFAKE_0', 'TENSOR_V3', 'HAAR_CASCADE'
    ];

    const streams = Array.from({ length: 18 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: Math.random() * 0.9 + 0.3,
      text: telemetryTokens[Math.floor(Math.random() * telemetryTokens.length)],
      alpha: Math.random() * 0.12 + 0.04,
    }));

    // LAYER 4: Abstract AI Facial Mesh Silhouette Points (Left/Edge Area)
    const facePoints = [
      // Left Eye
      { rx: 0.14, ry: 0.30 }, { rx: 0.16, ry: 0.29 }, { rx: 0.18, ry: 0.30 }, { rx: 0.16, ry: 0.31 },
      // Right Eye
      { rx: 0.24, ry: 0.30 }, { rx: 0.26, ry: 0.29 }, { rx: 0.28, ry: 0.30 }, { rx: 0.26, ry: 0.31 },
      // Nose Line
      { rx: 0.21, ry: 0.32 }, { rx: 0.21, ry: 0.36 }, { rx: 0.20, ry: 0.39 }, { rx: 0.22, ry: 0.39 },
      // Lips Contour
      { rx: 0.17, ry: 0.43 }, { rx: 0.21, ry: 0.42 }, { rx: 0.25, ry: 0.43 }, { rx: 0.21, ry: 0.45 },
      // Outer Jaw Contour
      { rx: 0.10, ry: 0.28 }, { rx: 0.09, ry: 0.35 }, { rx: 0.11, ry: 0.42 }, { rx: 0.16, ry: 0.48 },
      { rx: 0.21, ry: 0.51 }, { rx: 0.26, ry: 0.48 }, { rx: 0.31, ry: 0.42 }, { rx: 0.33, ry: 0.35 }, { rx: 0.32, ry: 0.28 }
    ];

    // Sparks for Neural Connections
    const sparkPulses = Array.from({ length: 8 }, () => ({
      p1Index: 0,
      p2Index: 1,
      progress: Math.random(),
      speed: Math.random() * 0.015 + 0.005,
    }));

    let scanBeamY = 0;
    let waveOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // --- LAYER 7: CYBERSECURITY SCANNING BEAM ---
      scanBeamY = (scanBeamY + 1.2) % (height + 120);
      const scanGrad = ctx.createLinearGradient(0, scanBeamY - 45, 0, scanBeamY + 45);
      scanGrad.addColorStop(0, 'rgba(0, 217, 255, 0)');
      scanGrad.addColorStop(0.5, 'rgba(0, 217, 255, 0.09)');
      scanGrad.addColorStop(1, 'rgba(0, 217, 255, 0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanBeamY - 45, width, 90);

      ctx.strokeStyle = 'rgba(0, 217, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, scanBeamY);
      ctx.lineTo(width, scanBeamY);
      ctx.stroke();

      // --- LAYER 6: TELEMETRY DATA RAIN ---
      ctx.font = '10px "JetBrains Mono", monospace';
      streams.forEach((s) => {
        s.y += s.speed;
        if (s.y > height + 20) {
          s.y = -20;
          s.x = Math.random() * width;
        }
        ctx.fillStyle = `rgba(0, 217, 255, ${s.alpha})`;
        ctx.fillText(s.text, s.x, s.y);
      });

      // --- LAYER 2 & 3: HIGH-DENSITY PARTICLES & NEURAL NETWORK ---
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;
        p1.pulseAngle += p1.pulseSpeed;

        if (p1.x < 0) p1.x = width;
        if (p1.x > width) p1.x = 0;
        if (p1.y < 0) p1.y = height;
        if (p1.y > height) p1.y = 0;

        // Check proximity to scanning beam
        const isNearBeam = Math.abs(p1.y - scanBeamY) < 30;
        const currentAlpha = Math.min(0.8, p1.alpha + Math.sin(p1.pulseAngle) * 0.15 + (isNearBeam ? 0.35 : 0));

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius * (isNearBeam ? 1.4 : 1.0), 0, Math.PI * 2);
        ctx.fillStyle = isNearBeam ? '#00d9ff' : `${p1.color}${Math.max(0.08, currentAlpha)})`;
        ctx.shadowBlur = isNearBeam ? 12 : 6;
        ctx.shadowColor = 'rgba(0, 217, 255, 0.5)';
        ctx.fill();

        // Draw neural network connection lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 145) {
            const lineAlpha = (1 - dist / 145) * 0.13;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 217, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.85;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }
      }

      // Traveling Sparks along Connections
      sparkPulses.forEach((sp) => {
        sp.progress += sp.speed;
        if (sp.progress >= 1) {
          sp.progress = 0;
          sp.p1Index = Math.floor(Math.random() * particles.length);
          sp.p2Index = Math.floor(Math.random() * particles.length);
        }
        const nodeA = particles[sp.p1Index];
        const nodeB = particles[sp.p2Index];
        if (nodeA && nodeB) {
          const sx = nodeA.x + (nodeB.x - nodeA.x) * sp.progress;
          const sy = nodeA.y + (nodeB.y - nodeA.y) * sp.progress;

          ctx.beginPath();
          ctx.arc(sx, sy, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = '#00d9ff';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#00d9ff';
          ctx.fill();
        }
      });

      // --- LAYER 4: ABSTRACT AI FORENSIC FACE SILHOUETTE (LEFT/EDGE AREA) ---
      if (width >= 992) {
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 217, 255, 0.15)';
        ctx.fillStyle = 'rgba(0, 217, 255, 0.35)';
        ctx.lineWidth = 1;

        const faceCoords = facePoints.map(pt => ({
          x: pt.rx * width,
          y: pt.ry * height,
        }));

        faceCoords.forEach((pt, idx) => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2.2, 0, Math.PI * 2);
          ctx.fill();

          if (idx < faceCoords.length - 1) {
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(faceCoords[idx + 1].x, faceCoords[idx + 1].y);
            ctx.stroke();
          }
        });

        // Biometric Scanning Brackets around Face
        const bx = 0.07 * width;
        const by = 0.24 * height;
        const bw = 0.27 * width;
        const bh = 0.30 * height;

        ctx.strokeStyle = 'rgba(0, 217, 255, 0.28)';
        ctx.lineWidth = 1.5;
        // Corners
        ctx.beginPath();
        ctx.moveTo(bx, by + 16); ctx.lineTo(bx, by); ctx.lineTo(bx + 16, by);
        ctx.moveTo(bx + bw - 16, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + 16);
        ctx.moveTo(bx + bw, by + bh - 16); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw - 16, by + bh);
        ctx.moveTo(bx + 16, by + bh); ctx.lineTo(bx, by + bh); ctx.lineTo(bx, by + bh - 16);
        ctx.stroke();

        ctx.restore();
      }

      // --- LAYER 5: GLOBAL DATA WAVEFORM (LOWER HERO AREA) ---
      waveOffset += 0.03;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.18)';
      ctx.lineWidth = 1.4;
      const waveY = height * 0.76;

      for (let x = 0; x < width; x += 8) {
        const y = waveY + Math.sin(x * 0.007 + waveOffset) * 18 + Math.cos(x * 0.0035 + waveOffset) * 10;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        // Periodic Wave Glowing Nodes
        if (x % 80 === 0) {
          ctx.fillStyle = 'rgba(0, 217, 255, 0.4)';
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* LAYER 1: Deep Navy Base */}
      <div className="absolute inset-0 bg-[#020617]" />

      {/* Cyber Grid with subtle Parallax */}
      <div 
        style={{
          transform: `translate3d(${mouseOffset.x * 0.5}px, ${-scrollYOffset * 0.4 + mouseOffset.y * 0.5}px, 0)`,
          transition: 'transform 0.1s ease-out'
        }}
        className="absolute inset-[-40px] cyber-grid opacity-35" 
      />

      {/* LAYER 8: Atmospheric Radial Gradient Lights */}
      <div 
        style={{
          transform: `translate3d(${mouseOffset.x}px, ${-scrollYOffset * 0.6 + mouseOffset.y}px, 0)`,
          transition: 'transform 0.2s ease-out'
        }}
        className="absolute -top-40 -left-40 w-[680px] h-[680px] bg-cyan-500/14 rounded-full blur-[140px] animate-pulse" 
      />
      
      <div 
        style={{
          transform: `translate3d(${-mouseOffset.x * 0.8}px, ${-scrollYOffset * 0.5 - mouseOffset.y * 0.8}px, 0)`,
          transition: 'transform 0.2s ease-out'
        }}
        className="absolute top-1/3 -right-40 w-[650px] h-[650px] bg-indigo-600/14 rounded-full blur-[150px]" 
      />
      
      <div 
        style={{
          transform: `translate3d(${mouseOffset.x * 0.6}px, ${-scrollYOffset * 0.7 + mouseOffset.y * 0.6}px, 0)`,
          transition: 'transform 0.2s ease-out'
        }}
        className="absolute -bottom-40 left-1/3 w-[720px] h-[720px] bg-purple-600/12 rounded-full blur-[160px]" 
      />

      {/* LAYER 2-7: Dynamic Multi-Layer Canvas */}
      <canvas 
        ref={canvasRef} 
        style={{
          transform: `translate3d(${mouseOffset.x * 0.3}px, ${-scrollYOffset * 0.3 + mouseOffset.y * 0.3}px, 0)`,
          transition: 'transform 0.15s ease-out'
        }}
        className="absolute inset-0 w-full h-full opacity-85" 
      />

      {/* Scanline Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0)_50%,rgba(0,0,0,0.22)_50%)] bg-[length:100%_4px] opacity-25 pointer-events-none" />
    </div>
  );
}
