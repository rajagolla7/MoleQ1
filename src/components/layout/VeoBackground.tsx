import React, { useRef, useEffect, useState } from 'react';

interface VeoBackgroundProps {
  intensity?: 'hero' | 'dashboard' | 'subtle';
  videoSrc?: string;
}

export const VeoBackground: React.FC<VeoBackgroundProps> = ({
  intensity = 'hero',
  videoSrc,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Fallback molecular quantum particle simulation on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Quantum node particles
    const particleCount = intensity === 'hero' ? 42 : 20;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2.2 + 1.2,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.4 ? 'rgba(45, 212, 191, ' : 'rgba(56, 189, 248, ',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw quantum wave grid background
      const time = performance.now() * 0.001;

      // Update and draw particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const pulse = Math.sin(time * 2 + p.phase) * 0.3 + 0.7;
        const alpha = (intensity === 'hero' ? 0.35 : 0.15) * pulse;

        // Particle glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = p.color + alpha + ')';
        ctx.fill();

        // Connect nearby molecular bonds
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p2.x - p.x;
          const dy = p2.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const bondAlpha = (1 - dist / 140) * (intensity === 'hero' ? 0.22 : 0.08);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(45, 212, 191, ${bondAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [intensity]);

  // Overlay opacity based on view intensity
  const overlayClass =
    intensity === 'hero'
      ? 'bg-slate-950/75 backdrop-blur-[2px]'
      : intensity === 'dashboard'
      ? 'bg-slate-950/90 backdrop-blur-[6px]'
      : 'bg-slate-950/95 backdrop-blur-[10px]';

  return (
    <div
      id="veo-background-container"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* Video Element (Supports uploaded Veo 3 video asset) */}
      {videoSrc && !videoError && (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-40' : 'opacity-0'
          }`}
        />
      )}

      {/* Fallback Animated Quantum Molecular Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />

      {/* Deep Scientific Dark Gradients & Readability Protection Overlay */}
      <div className={`absolute inset-0 ${overlayClass}`} />

      {/* Subtle Quantum Ambient Top & Radial Glow */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-teal-500/10 via-sky-500/5 to-transparent pointer-events-none" />
      <div className="absolute -top-32 left-1/3 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[160px] pointer-events-none" />
    </div>
  );
};
