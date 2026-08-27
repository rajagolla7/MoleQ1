import React, { useState, useEffect } from 'react';
import { PageView, AnalysisResult } from '../types/molecule';
import { analyzeMolecule } from '../services/moleculeService';
import { PRESET_MOLECULES } from '../data/mockData';
import { MoleculeRenderer2D } from '../components/molecules/MoleculeRenderer2D';
import { MoleculeViewer3D } from '../components/molecules/MoleculeViewer3D';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Atom,
  ShieldCheck,
  Zap,
  Info,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface AnalysisProps {
  initialSmiles?: string;
  onNavigate: (page: PageView) => void;
}

export const Analysis: React.FC<AnalysisProps> = ({ initialSmiles = 'CCO', onNavigate }) => {
  const [smilesInput, setSmilesInput] = useState(initialSmiles);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [copied, setCopied] = useState(false);

  const runAnalysis = async (smilesToAnalyze: string) => {
    if (!smilesToAnalyze.trim()) return;
    setIsLoading(true);
    try {
      const res = await analyzeMolecule(smilesToAnalyze.trim());
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialSmiles) {
      setSmilesInput(initialSmiles);
      runAnalysis(initialSmiles);
    }
  }, [initialSmiles]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runAnalysis(smilesInput);
  };

  const handleSelectPreset = (smiles: string) => {
    setSmilesInput(smiles);
    runAnalysis(smiles);
  };

  const handleCopySmiles = () => {
    if (result) {
      navigator.clipboard.writeText(result.canonicalSmiles);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div id="molecule-analysis-page" className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Molecule Input & Analysis
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/30 text-[11px] font-mono-code font-bold">
            RDKit-Compatible Parser
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Compute physicochemical descriptors, evaluate Lipinski Rule of 5 druglikeness boundaries, and simulate 2D/3D molecular graphs from canonical SMILES strings.
        </p>
      </div>

      {/* SMILES Input Form */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Enter Molecular SMILES String
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                id="analysis-smiles-input"
                type="text"
                value={smilesInput}
                onChange={(e) => setSmilesInput(e.target.value)}
                placeholder="e.g. CCO (Ethanol), CC(=O)Oc1ccccc1C(=O)O (Aspirin)..."
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 focus:border-teal-500 rounded-xl text-sm font-mono-code text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500/30 shadow-inner transition"
              />
              {smilesInput && (
                <button
                  type="button"
                  onClick={() => setSmilesInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              id="analyze-molecule-submit-btn"
              type="submit"
              disabled={isLoading || !smilesInput.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-400 hover:to-sky-500 text-slate-950 font-bold text-xs transition shadow-[0_0_20px_rgba(20,184,166,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{isLoading ? 'Analyzing...' : 'Analyze Molecule'}</span>
            </button>
          </div>
        </form>

        {/* Preset Chemical Library Quick Buttons */}
        <div className="pt-2">
          <span className="text-[11px] font-semibold text-slate-400 block mb-2">
            Reference Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_MOLECULES.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleSelectPreset(preset.smiles)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                  smilesInput === preset.smiles
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 font-semibold shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Result Presentation */}
      {result && (
        <div className="space-y-6">
          {!result.isValid ? (
            /* Error State */
            <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-rose-200 font-display">
                  Invalid molecular structure
                </h3>
                <p className="text-xs text-rose-300/90 mt-1">
                  {result.errorMessage || 'Unable to parse provided SMILES notation into a valid chemical graph.'}
                </p>
                <p className="text-[11px] text-slate-400 mt-2">
                  Please verify that brackets, parentheses, and ring closure integers are balanced.
                </p>
              </div>
            </div>
          ) : (
            /* Valid Results Grid */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Visualizer & Formula (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="glass-panel p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        Formula
                      </span>
                      <div className="font-mono-code font-bold text-white text-lg">
                        {result.formula}
                      </div>
                    </div>

                    {/* 2D / 3D Toggle */}
                    <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-medium">
                      <button
                        type="button"
                        onClick={() => setViewMode('2d')}
                        className={`px-2.5 py-1 rounded transition ${
                          viewMode === '2d'
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        2D Diagram
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode('3d')}
                        className={`px-2.5 py-1 rounded transition ${
                          viewMode === '3d'
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        3D Orbitals
                      </button>
                    </div>
                  </div>

                  {/* Rendering Stage */}
                  <div className="w-full">
                    {viewMode === '2d' ? (
                      <MoleculeRenderer2D
                        smiles={result.canonicalSmiles}
                        height={240}
                        showSmilesBanner={false}
                      />
                    ) : (
                      <MoleculeViewer3D
                        smiles={result.canonicalSmiles}
                        height={240}
                      />
                    )}
                  </div>

                  {/* Canonical SMILES Box */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        Canonical SMILES
                      </span>
                      <button
                        type="button"
                        onClick={handleCopySmiles}
                        className="text-[11px] text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium"
                      >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-xs font-mono-code text-slate-200 break-all">
                      {result.canonicalSmiles}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Physicochemical & Lipinski Matrix (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Descriptors Matrix */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white font-display flex items-center gap-2">
                      <Layers className="w-4 h-4 text-teal-400" />
                      Calculated Molecular Descriptors
                    </h2>
                    <span className="text-[10px] font-mono-code text-teal-400">
                      RDKit Standard Descriptors
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    {/* MW */}
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400">Molecular Weight</span>
                      <div className="font-mono-code font-bold text-white text-base">
                        {result.descriptors.molecularWeight}{' '}
                        <span className="text-[10px] text-slate-400 font-normal">g/mol</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Lipinski: &le; 500 Da</div>
                    </div>

                    {/* LogP */}
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400">LogP (Crippen)</span>
                      <div className="font-mono-code font-bold text-teal-300 text-base">
                        {result.descriptors.logP}
                      </div>
                      <div className="text-[10px] text-slate-400">Lipinski: &le; 5.0</div>
                    </div>

                    {/* TPSA */}
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400">TPSA (Polar Area)</span>
                      <div className="font-mono-code font-bold text-sky-300 text-base">
                        {result.descriptors.tpsa}{' '}
                        <span className="text-[10px] text-slate-400 font-normal">Å²</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Veber: &le; 140 Å²</div>
                    </div>

                    {/* HBD */}
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400">H-Bond Donors (HBD)</span>
                      <div className="font-mono-code font-bold text-white text-base">
                        {result.descriptors.hbd}
                      </div>
                      <div className="text-[10px] text-slate-400">Lipinski: &le; 5</div>
                    </div>

                    {/* HBA */}
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400">H-Bond Acceptors (HBA)</span>
                      <div className="font-mono-code font-bold text-white text-base">
                        {result.descriptors.hba}
                      </div>
                      <div className="text-[10px] text-slate-400">Lipinski: &le; 10</div>
                    </div>

                    {/* Rotatable Bonds */}
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400">Rotatable Bonds</span>
                      <div className="font-mono-code font-bold text-white text-base">
                        {result.descriptors.rotatableBonds}
                      </div>
                      <div className="text-[10px] text-slate-400">Veber: &le; 10</div>
                    </div>

                    {/* Ring Count */}
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400">Total Ring Count</span>
                      <div className="font-mono-code font-bold text-violet-300 text-base">
                        {result.descriptors.ringCount}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Aromatic: {result.descriptors.aromaticRingCount || 0}
                      </div>
                    </div>

                    {/* QED */}
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400">QED Druglikeness</span>
                      <div className="font-mono-code font-bold text-emerald-300 text-base">
                        {result.predictions.qedScore}
                      </div>
                      <div className="text-[10px] text-slate-400">Range: 0 &ndash; 1.0</div>
                    </div>

                    {/* Synthetic Accessibility */}
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400">Synthetic Ease</span>
                      <div className="font-mono-code font-bold text-teal-300 text-base">
                        {result.predictions.syntheticAccessibilityScore} / 10
                      </div>
                      <div className="text-[10px] text-slate-400">Lower is easier</div>
                    </div>
                  </div>
                </div>

                {/* Lipinski Rule of 5 Status Box */}
                <div className="glass-panel p-6 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white font-display flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Lipinski Rule of 5 Compliance
                    </h2>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        result.isLipinskiCompliant
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {result.isLipinskiCompliant ? 'Compliant (Oral Bioavailable)' : 'Rule Violations Detected'}
                    </span>
                  </div>

                  {result.lipinskiRuleViolations.length > 0 ? (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
                      <span className="font-semibold block">Identified Boundary Flags:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                        {result.lipinskiRuleViolations.map((v, i) => (
                          <li key={i}>{v}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">
                      All physicochemical descriptors are within favorable boundaries for oral small-molecule therapeutics (MW &le; 500, LogP &le; 5, HBD &le; 5, HBA &le; 10).
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
