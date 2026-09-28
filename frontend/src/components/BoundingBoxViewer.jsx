import React, { useRef, useState, useEffect } from 'react';
import { Scan, Eye, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function BoundingBoxViewer({ imageSrc, faceBoxes = [], verdict }) {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [activeBox, setActiveBox] = useState(null);

  const updateScale = () => {
    if (imgRef.current) {
      const naturalW = imgRef.current.naturalWidth || 1;
      const naturalH = imgRef.current.naturalHeight || 1;
      const displayW = imgRef.current.clientWidth || 1;
      const displayH = imgRef.current.clientHeight || 1;
      setScale({
        x: displayW / naturalW,
        y: displayH / naturalH,
      });
    }
  };

  useEffect(() => {
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center justify-center select-none">
      <div ref={containerRef} className="relative inline-block max-w-full rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
        
        {/* Main Display Image */}
        <img
          ref={imgRef}
          src={imageSrc}
          alt="Analyzed subject"
          onLoad={updateScale}
          className="max-h-[420px] w-auto object-contain block"
        />

        {/* Laser Scanner Sweep Bar on hover/active */}
        <div className="laser-scanner opacity-50" />

        {/* Overlaid Interactive Face Bounding Boxes */}
        {faceBoxes.map((box, idx) => {
          const left = box.x * scale.x;
          const top = box.y * scale.y;
          const width = box.width * scale.x;
          const height = box.height * scale.y;
          const isFake = (box.fakeProbability ?? 0) >= 60 || verdict === 'DEEPFAKE';

          const boxColor = isFake ? 'border-rose-500 shadow-[0_0_15px_rgba(255,46,99,0.5)]' : 'border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)]';
          const badgeBg = isFake ? 'bg-rose-950/90 text-rose-300 border-rose-500' : 'bg-cyan-950/90 text-cyan-300 border-cyan-400';

          return (
            <div
              key={idx}
              onMouseEnter={() => setActiveBox(box)}
              onMouseLeave={() => setActiveBox(null)}
              style={{
                position: 'absolute',
                left: `${left}px`,
                top: `${top}px`,
                width: `${width}px`,
                height: `${height}px`,
              }}
              className={`border-2 rounded-lg transition-all duration-200 cursor-pointer ${boxColor}`}
            >
              {/* Corner Biometric Crosshairs */}
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-white" />
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-white" />
              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-white" />
              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-white" />

              {/* Tag Label */}
              <div className={`absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold border ${badgeBg} whitespace-nowrap flex items-center gap-1 backdrop-blur-md`}>
                <Scan className="w-2.5 h-2.5" />
                <span>{box.label || `Subject #${idx + 1}`}</span>
                {box.fakeProbability !== undefined && (
                  <span>({box.fakeProbability.toFixed(1)}%)</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Face Inspector Bar */}
      {activeBox && (
        <div className="mt-3 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono-tech text-slate-300 flex items-center gap-4">
          <span className="text-cyan-400 font-bold">{activeBox.label || 'Selected Subject'}:</span>
          <span>W: {activeBox.width}px • H: {activeBox.height}px</span>
          {activeBox.boundaryArtifactScore !== undefined && (
            <span>Seam Disparity: {activeBox.boundaryArtifactScore.toFixed(1)}%</span>
          )}
        </div>
      )}
    </div>
  );
}
