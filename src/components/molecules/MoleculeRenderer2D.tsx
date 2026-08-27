import React, { useMemo, useState } from 'react';
import { parseSmilesToGraph } from '../../utils/smilesRenderer';
import { Copy, Check, Eye, Maximize2 } from 'lucide-react';

interface MoleculeRenderer2DProps {
  smiles: string;
  name?: string;
  width?: number;
  height?: number;
  className?: string;
  interactive?: boolean;
  onExpand?: () => void;
  showSmilesBanner?: boolean;
}

export const MoleculeRenderer2D: React.FC<MoleculeRenderer2DProps> = ({
  smiles,
  name,
  width = 280,
  height = 180,
  className = '',
  interactive = true,
  onExpand,
  showSmilesBanner = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [hoveredAtom, setHoveredAtom] = useState<{ symbol: string; id: number } | null>(null);

  const graph = useMemo(() => {
    return parseSmilesToGraph(smiles, width, height);
  }, [smiles, width, height]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(smiles);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      id={`molecule-2d-canvas-${smiles.slice(0, 10).replace(/[^a-zA-Z0-9]/g, '')}`}
      className={`relative flex flex-col items-center justify-center rounded-xl bg-slate-950/80 border border-teal-500/20 overflow-hidden group shadow-inner ${className}`}
      style={{ width: '100%', minHeight: `${height}px` }}
    >
      {/* Background subtle grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.06)_0,transparent_70%)] pointer-events-none" />

      {/* SVG Canvas */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full object-contain p-2 select-none"
      >
        <defs>
          <linearGradient id="bondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.8" />
          </linearGradient>
          <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Chemical Bonds */}
        {graph.bonds.map((bond, idx) => {
          const source = graph.atoms[bond.source];
          const target = graph.atoms[bond.target];
          if (!source || !target) return null;

          const isDouble = bond.order === 2;
          const isAromatic = bond.order === 1.5;

          // Normal single line
          if (!isDouble && !isAromatic) {
            return (
              <line
                key={`bond-${idx}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="#64748b"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            );
          }

          // Double bond offset calculation
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const offX = (-dy / len) * 2.2;
          const offY = (dx / len) * 2.2;

          return (
            <g key={`bond-${idx}`}>
              <line
                x1={source.x + offX}
                y1={source.y + offY}
                x2={target.x + offX}
                y2={target.y + offY}
                stroke="#64748b"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1={source.x - offX}
                y1={source.y - offY}
                x2={target.x - offX}
                y2={target.y - offY}
                stroke={isAromatic ? '#38bdf8' : '#64748b'}
                strokeWidth="1.8"
                strokeDasharray={isAromatic ? '3,2' : undefined}
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {/* Atom Nodes */}
        {graph.atoms.map((atom) => {
          const isCarbon = atom.symbol === 'C';
          const isHovered = hoveredAtom?.id === atom.id;

          return (
            <g
              key={`atom-${atom.id}`}
              onMouseEnter={() => setHoveredAtom({ symbol: atom.symbol, id: atom.id })}
              onMouseLeave={() => setHoveredAtom(null)}
              className="cursor-pointer"
            >
              {/* Atom circle halo on non-carbon or hovered */}
              {!isCarbon || isHovered ? (
                <circle
                  cx={atom.x}
                  cy={atom.y}
                  r={isHovered ? 9 : 7}
                  fill="#090d16"
                  stroke={atom.color}
                  strokeWidth="1.5"
                  className="transition-all duration-150"
                  filter={isHovered ? 'url(#subtleGlow)' : undefined}
                />
              ) : null}

              {/* Atom Text Symbol */}
              {!isCarbon ? (
                <text
                  x={atom.x}
                  y={atom.y + 3.5}
                  textAnchor="middle"
                  fill={atom.color}
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="'JetBrains Mono', monospace"
                  className="pointer-events-none"
                >
                  {atom.symbol}
                </text>
              ) : (
                <circle
                  cx={atom.x}
                  cy={atom.y}
                  r={isHovered ? 4 : 2}
                  fill={isHovered ? '#38bdf8' : '#475569'}
                  className="transition-all duration-150"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Quick Action Overlay (Copy, Zoom, Info) */}
      {interactive && (
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 border border-slate-700/60 rounded-lg p-1 shadow-lg backdrop-blur-md">
          <button
            id="copy-smiles-btn"
            type="button"
            onClick={handleCopy}
            title="Copy SMILES string"
            className="p-1 text-slate-400 hover:text-teal-300 rounded hover:bg-slate-800 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          {onExpand && (
            <button
              id="expand-molecule-view-btn"
              type="button"
              onClick={onExpand}
              title="Expand 3D Inspector"
              className="p-1 text-slate-400 hover:text-teal-300 rounded hover:bg-slate-800 transition"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Hovered Atom Tooltip */}
      {hoveredAtom && (
        <div className="absolute bottom-2 left-2 text-[10px] font-mono-code text-teal-300 bg-slate-900/95 border border-teal-500/30 px-2 py-0.5 rounded shadow">
          Atom #{hoveredAtom.id + 1}: {hoveredAtom.symbol}
        </div>
      )}

      {/* Optional SMILES Banner */}
      {showSmilesBanner && (
        <div className="w-full bg-slate-900/90 border-t border-slate-800 px-2 py-1 flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-mono-code truncate max-w-[80%]" title={smiles}>
            {smiles}
          </span>
          <span className="text-[10px] text-teal-400 font-semibold uppercase tracking-wider">
            2D Graph
          </span>
        </div>
      )}
    </div>
  );
};
