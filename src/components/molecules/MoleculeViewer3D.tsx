import React, { useRef, useEffect, useState } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import { parseSmilesToGraph } from '../../utils/smilesRenderer';

interface MoleculeViewer3DProps {
  smiles: string;
  name?: string;
  height?: number;
  className?: string;
}

export const MoleculeViewer3D: React.FC<MoleculeViewer3DProps> = ({
  smiles,
  name,
  height = 320,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [zoom, setZoom] = useState(1.0);
  const [showOrbitals, setShowOrbitals] = useState(true);
  const [renderMode, setRenderMode] = useState<'ball-stick' | 'space-filling' | 'quantum-cloud'>('ball-stick');

  // Drag interaction refs
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const rotAngleRef = useRef({ x: 0.3, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const graph = parseSmilesToGraph(smiles, 300, 200);
    // Generate pseudo-3D z-depth for each atom
    const atoms3D = graph.atoms.map((a, i) => ({
      ...a,
      z: Math.sin(i * 1.2) * 45,
      x: a.x - 150,
      y: a.y - 100,
    }));

    let animationFrameId: number;

    const render = () => {
      if (!canvas || !ctx) return;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Auto-rotation when not dragging
      if (isRotating && !isDraggingRef.current) {
        rotAngleRef.current.y += 0.012;
      }

      const rotX = rotAngleRef.current.x;
      const rotY = rotAngleRef.current.y;

      // Project 3D coordinates using 3D rotation matrix
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const projectedAtoms = atoms3D.map((a) => {
        // Y-axis rotation
        const x1 = a.x * cosY + a.z * sinY;
        const z1 = -a.x * sinY + a.z * cosY;

        // X-axis rotation
        const y2 = a.y * cosX - z1 * sinX;
        const z2 = a.y * sinX + z1 * cosX;

        // Perspective projection
        const cameraDist = 380;
        const perspective = cameraDist / (cameraDist + z2);

        return {
          ...a,
          projX: width / 2 + x1 * perspective * zoom * 1.4,
          projY: height / 2 + y2 * perspective * zoom * 1.4,
          projZ: z2,
          scale: perspective * zoom,
        };
      });

      // Sort by Z-depth (painter's algorithm)
      projectedAtoms.sort((a, b) => a.projZ - b.projZ);

      // Draw Bonds
      graph.bonds.forEach((bond) => {
        const a1 = projectedAtoms.find((a) => a.id === bond.source);
        const a2 = projectedAtoms.find((a) => a.id === bond.target);
        if (!a1 || !a2) return;

        ctx.beginPath();
        ctx.moveTo(a1.projX, a1.projY);
        ctx.lineTo(a2.projX, a2.projY);

        const grad = ctx.createLinearGradient(a1.projX, a1.projY, a2.projX, a2.projY);
        grad.addColorStop(0, a1.color);
        grad.addColorStop(1, a2.color);

        ctx.strokeStyle = grad;
        ctx.lineWidth = Math.max(1.5, 3.5 * Math.min(a1.scale, a2.scale));
        ctx.lineCap = 'round';
        ctx.stroke();

        // Optional Quantum electron wave superposition overlay
        if (showOrbitals) {
          ctx.beginPath();
          ctx.moveTo(a1.projX, a1.projY);
          ctx.lineTo(a2.projX, a2.projY);
          ctx.strokeStyle = 'rgba(45, 212, 191, 0.18)';
          ctx.lineWidth = ctx.lineWidth * 2.2;
          ctx.stroke();
        }
      });

      // Draw Atoms
      projectedAtoms.forEach((atom) => {
        const radius = renderMode === 'space-filling' ? 18 * atom.scale : 9 * atom.scale;

        // Quantum electronic probability cloud halo
        if (renderMode === 'quantum-cloud' || showOrbitals) {
          const glowGrad = ctx.createRadialGradient(
            atom.projX,
            atom.projY,
            radius * 0.4,
            atom.projX,
            atom.projY,
            radius * 2.2
          );
          glowGrad.addColorStop(0, atom.color + '44');
          glowGrad.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(atom.projX, atom.projY, radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();
        }

        // Shaded sphere (3D ball lighting)
        const lightOff = radius * 0.35;
        const sphereGrad = ctx.createRadialGradient(
          atom.projX - lightOff,
          atom.projY - lightOff,
          radius * 0.1,
          atom.projX,
          atom.projY,
          radius
        );
        sphereGrad.addColorStop(0, '#ffffff');
        sphereGrad.addColorStop(0.3, atom.color);
        sphereGrad.addColorStop(1, '#050b14');

        ctx.beginPath();
        ctx.arc(atom.projX, atom.projY, Math.max(2, radius), 0, Math.PI * 2);
        ctx.fillStyle = sphereGrad;
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 0.75;
        ctx.stroke();

        // Symbol label
        if (atom.symbol !== 'C' && radius > 7) {
          ctx.fillStyle = '#ffffff';
          ctx.font = `600 ${Math.max(9, Math.round(9 * atom.scale))}px 'JetBrains Mono'`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(atom.symbol, atom.projX, atom.projY);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [smiles, isRotating, zoom, showOrbitals, renderMode]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;

    rotAngleRef.current.y += deltaX * 0.01;
    rotAngleRef.current.x += deltaY * 0.01;

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      id="molecule-3d-interactive-viewer"
      className={`relative flex flex-col rounded-2xl bg-slate-950/90 border border-teal-500/30 overflow-hidden shadow-2xl ${className}`}
      style={{ minHeight: `${height}px` }}
    >
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        width={500}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Floating Control Toolbar */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/60 rounded-xl p-1 backdrop-blur-md z-10 shadow-lg">
        <button
          type="button"
          onClick={() => setIsRotating(!isRotating)}
          title={isRotating ? 'Pause rotation' : 'Resume auto-rotation'}
          className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition ${
            isRotating ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
        </button>

        <button
          type="button"
          onClick={() => setZoom((prev) => Math.min(2.0, prev + 0.2))}
          title="Zoom In"
          className="p-1.5 rounded-lg text-slate-400 hover:text-teal-300 transition"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => setZoom((prev) => Math.max(0.6, prev - 0.2))}
          title="Zoom Out"
          className="p-1.5 rounded-lg text-slate-400 hover:text-teal-300 transition"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => setShowOrbitals(!showOrbitals)}
          title="Toggle Quantum Electronic Wavefunction"
          className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition ${
            showOrbitals ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Model Mode Switcher (Bottom Left) */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-slate-900/90 border border-slate-800/80 rounded-lg p-0.5 text-[11px] font-medium backdrop-blur-md z-10">
        <button
          type="button"
          onClick={() => setRenderMode('ball-stick')}
          className={`px-2.5 py-1 rounded transition ${
            renderMode === 'ball-stick' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Ball & Stick
        </button>
        <button
          type="button"
          onClick={() => setRenderMode('space-filling')}
          className={`px-2.5 py-1 rounded transition ${
            renderMode === 'space-filling' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          CPK Van der Waals
        </button>
        <button
          type="button"
          onClick={() => setRenderMode('quantum-cloud')}
          className={`px-2.5 py-1 rounded transition ${
            renderMode === 'quantum-cloud' ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Quantum Cloud
        </button>
      </div>

      {/* Status Overlay (Bottom Right) */}
      <div className="absolute bottom-3 right-3 text-[10px] font-mono-code text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 pointer-events-none">
        Interactive 3D Orbital Model
      </div>
    </div>
  );
};
