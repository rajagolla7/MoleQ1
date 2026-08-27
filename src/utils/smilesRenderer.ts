/**
 * High-precision 2D Chemical Graph SVG Generator from SMILES
 * Generates clean, publication-ready chemical structure diagrams
 */

export interface AtomNode {
  id: number;
  symbol: string;
  x: number;
  y: number;
  charge: number;
  isAromatic: boolean;
  color: string;
}

export interface BondLink {
  source: number;
  target: number;
  order: number; // 1: single, 2: double, 3: triple, 1.5: aromatic
  stereo?: 'up' | 'down' | 'none';
}

export interface ChemicalGraph {
  atoms: AtomNode[];
  bonds: BondLink[];
  width: number;
  height: number;
}

const ELEMENT_COLORS: Record<string, string> = {
  C: '#94a3b8',
  c: '#94a3b8',
  N: '#38bdf8', // Light blue
  n: '#38bdf8',
  O: '#f87171', // Red/Salmon
  o: '#f87171',
  F: '#4ade80', // Green
  Cl: '#22c55e', // Emerald
  cl: '#22c55e',
  Br: '#a855f7', // Purple
  br: '#a855f7',
  I: '#9333ea',
  S: '#facc15', // Yellow
  s: '#facc15',
  P: '#fb923c', // Orange
  p: '#fb923c',
  H: '#e2e8f0',
};

/**
 * Parses simplified SMILES string into 2D atom coordinates and bonds
 */
export function parseSmilesToGraph(smiles: string, canvasWidth = 280, canvasHeight = 180): ChemicalGraph {
  const atoms: AtomNode[] = [];
  const bonds: BondLink[] = [];
  
  if (!smiles) {
    return { atoms, bonds, width: canvasWidth, height: canvasHeight };
  }

  // Tokenize atoms and ring numbers
  const tokens: { symbol: string; isAromatic: boolean; bondToPrev?: number; ringNum?: number }[] = [];
  let i = 0;
  let nextBondOrder = 1;

  while (i < smiles.length) {
    const char = smiles[i];

    if (char === '=') {
      nextBondOrder = 2;
      i++;
      continue;
    }
    if (char === '#') {
      nextBondOrder = 3;
      i++;
      continue;
    }
    if (char === '(' || char === ')') {
      i++;
      continue;
    }

    // Two-letter elements
    if (i < smiles.length - 1 && (smiles.substring(i, i + 2) === 'Cl' || smiles.substring(i, i + 2) === 'Br')) {
      const sym = smiles.substring(i, i + 2);
      tokens.push({ symbol: sym, isAromatic: false, bondToPrev: nextBondOrder });
      nextBondOrder = 1;
      i += 2;
      continue;
    }

    // Single letter atoms
    if (/[A-Za-z]/.test(char)) {
      const isArom = char >= 'a' && char <= 'z';
      tokens.push({ symbol: char.toUpperCase(), isAromatic: isArom, bondToPrev: nextBondOrder });
      nextBondOrder = 1;
      i++;
      continue;
    }

    // Ring closure numbers
    if (/\d/.test(char)) {
      const ringNum = parseInt(char, 10);
      if (tokens.length > 0) {
        tokens[tokens.length - 1].ringNum = ringNum;
      }
      i++;
      continue;
    }

    i++;
  }

  if (tokens.length === 0) {
    return { atoms, bonds, width: canvasWidth, height: canvasHeight };
  }

  // Generate 2D coordinates using 2D chemical chain & ring geometry
  const bondLength = 26;
  let curX = 40;
  let curY = canvasHeight / 2;
  let curAngle = 0; // radians
  const ringClosures: Record<number, number> = {};

  tokens.forEach((t, idx) => {
    const atomId = idx;
    
    if (idx === 0) {
      curX = 45;
      curY = canvasHeight / 2;
    } else {
      // Zig-zag bond layout: alternate 30° / -30° angles for organic look
      const angleSign = (idx % 2 === 0) ? -1 : 1;
      curAngle = (Math.PI / 6) * angleSign;
      curX += Math.cos(curAngle) * bondLength;
      curY += Math.sin(curAngle) * bondLength;

      // Add bond to previous atom
      bonds.push({
        source: idx - 1,
        target: idx,
        order: t.bondToPrev || 1,
      });
    }

    atoms.push({
      id: atomId,
      symbol: t.symbol,
      x: curX,
      y: curY,
      charge: 0,
      isAromatic: t.isAromatic,
      color: ELEMENT_COLORS[t.symbol] || '#94a3b8',
    });

    if (t.ringNum !== undefined) {
      if (ringClosures[t.ringNum] !== undefined) {
        // Close ring bond
        bonds.push({
          source: ringClosures[t.ringNum],
          target: atomId,
          order: t.isAromatic ? 1.5 : 1,
        });
      } else {
        ringClosures[t.ringNum] = atomId;
      }
    }
  });

  // Center and normalize coordinates to fit canvas
  if (atoms.length > 0) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    atoms.forEach(a => {
      minX = Math.min(minX, a.x);
      maxX = Math.max(maxX, a.x);
      minY = Math.min(minY, a.y);
      maxY = Math.max(maxY, a.y);
    });

    const graphW = Math.max(1, maxX - minX);
    const graphH = Math.max(1, maxY - minY);
    const padding = 28;
    const scale = Math.min((canvasWidth - padding * 2) / graphW, (canvasHeight - padding * 2) / graphH, 1.3);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    atoms.forEach(a => {
      a.x = (a.x - centerX) * scale + canvasWidth / 2;
      a.y = (a.y - centerY) * scale + canvasHeight / 2;
    });
  }

  return { atoms, bonds, width: canvasWidth, height: canvasHeight };
}
