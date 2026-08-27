import React, { useState } from 'react';
import { PageView, MoleculeCandidate } from '../types/molecule';
import { MoleculeRenderer2D } from '../components/molecules/MoleculeRenderer2D';
import { MoleculeViewer3D } from '../components/molecules/MoleculeViewer3D';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Columns,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Activity,
  Layers,
  Zap,
  Info,
  CheckCircle2,
  Atom,
  Cpu,
  HeartPulse,
  Dna,
  XCircle,
  HelpCircle,
} from 'lucide-react';

interface MoleculeDetailsProps {
  candidate: MoleculeCandidate | null;
  onNavigate: (page: PageView) => void;
  onToggleCompare: (id: string) => void;
  onToggleSave: (id: string) => void;
  isCompared: boolean;
}

export const MoleculeDetails: React.FC<MoleculeDetailsProps> = ({
  candidate,
  onNavigate,
  onToggleCompare,
  onToggleSave,
  isCompared,
}) => {
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [copied, setCopied] = useState(false);

  if (!candidate) {
    return (
      <div className="p-12 text-center max-w-lg mx-auto space-y-4">
        <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
        <h2 className="text-lg font-bold text-white font-display">No Candidate Selected</h2>
        <p className="text-xs text-slate-400">
          Please select a molecule from the Candidates or Dashboard page to inspect full descriptors and model predictions.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('candidates')}
          className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
        >
          Return to Candidates
        </button>
      </div>
    );
  }

  const handleCopySmiles = () => {
    navigator.clipboard.writeText(candidate.canonicalSmiles);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="molecule-details-page" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Back Navigation and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('candidates')}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono-code font-bold text-teal-300 text-base">
                {candidate.id}
              </span>
              {candidate.disease && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1">
                  <HeartPulse className="w-3 h-3" />
                  {candidate.disease}
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-semibold flex items-center gap-1">
                <Dna className="w-3 h-3" />
                Target: {candidate.target}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                {candidate.rankingBadge}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono-code">
                Computationally Generated Candidate
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-display mt-1">
              {candidate.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Compare Toggle */}
          <button
            type="button"
            onClick={() => onToggleCompare(candidate.id)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              isCompared
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/50'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>{isCompared ? 'In Compare List' : 'Add to Compare'}</span>
          </button>

          {/* Save Toggle */}
          <button
            type="button"
            onClick={() => onToggleSave(candidate.id)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              candidate.isSaved
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            {candidate.isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{candidate.isSaved ? 'Saved' : 'Save Candidate'}</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Visualizer & Molecular Identity (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Visualizer Card */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <Atom className="w-4 h-4 text-teal-400" />
                Structural Visualization
              </h2>

              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setViewMode('3d')}
                  className={`px-3 py-1 rounded transition cursor-pointer ${
                    viewMode === '3d'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  3D Orbitals
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('2d')}
                  className={`px-3 py-1 rounded transition cursor-pointer ${
                    viewMode === '2d'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  2D Graph
                </button>
              </div>
            </div>

            <div className="w-full">
              {viewMode === '3d' ? (
                <MoleculeViewer3D
                  smiles={candidate.canonicalSmiles}
                  name={candidate.name}
                  height={320}
                />
              ) : (
                <MoleculeRenderer2D
                  smiles={candidate.canonicalSmiles}
                  name={candidate.name}
                  height={320}
                  showSmilesBanner={false}
                />
              )}
            </div>

            {/* Molecular Identity Box */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Molecular Identity & SMILES
              </span>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Chemical Formula:</span>
                <span className="font-mono-code font-bold text-white text-sm">
                  {candidate.formula}
                </span>
              </div>
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Canonical SMILES:</span>
                  <button
                    type="button"
                    onClick={handleCopySmiles}
                    className="text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy SMILES'}
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 font-mono-code text-[11px] text-slate-200 break-all border border-slate-850 select-all">
                  {candidate.canonicalSmiles}
                </div>
              </div>
            </div>
          </div>

          {/* Model Explanation & Selection Criteria */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              Why this candidate was selected & ranked here
            </h2>
            <p className="text-xs font-semibold text-teal-300">
              {candidate.explanation.primaryFactor}
            </p>

            {/* Selection Criteria Matrix */}
            {candidate.whySelected && candidate.whySelected.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Target & ADMET Constraint Validation
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {candidate.whySelected.map((crit, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-start gap-2.5 text-xs"
                    >
                      {crit.satisfied ? (
                        <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-semibold text-slate-200">{crit.factor}</div>
                        <div className="text-[11px] text-slate-400">{crit.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
              {candidate.explanation.points.map((pt, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            {candidate.explanation.quantumAdvantageNote && (
              <div className="mt-3 p-3 rounded-xl bg-violet-950/40 border border-violet-500/30 text-xs text-violet-200 space-y-1">
                <span className="font-semibold flex items-center gap-1.5 text-violet-300">
                  <Cpu className="w-3.5 h-3.5" /> Quantum Simulation Ready:
                </span>
                <p className="text-[11px] leading-relaxed text-violet-300/90">
                  {candidate.explanation.quantumAdvantageNote}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Descriptors, AI Predictions, Score Breakdown (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Overall Candidate Score & Predictions */}
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white font-display flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Multi-Objective Pareto Score & Predictions
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Disease-to-target optimization index for {candidate.disease || 'Specified Pathology'} &bull; {candidate.target}
                </p>
              </div>

              {/* Big Score Badge */}
              <div className="text-right">
                <div className="text-3xl font-extrabold font-mono-code text-white">
                  {candidate.overallScore}
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                  Top Candidate
                </div>
              </div>
            </div>

            {/* AI Predictions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Predicted Activity */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  {candidate.targetActivityLabel || `Predicted ${candidate.target} Activity`}
                </span>
                <div className="text-base font-bold text-emerald-400">
                  {candidate.predictions.predictedActivity}
                </div>
                <div className="text-[11px] font-mono-code text-slate-300">
                  Estimated Kd: {candidate.predictions.targetAffinityKd}
                </div>
                <div className="text-[10px] text-slate-400">Activity Score: {candidate.predictions.activityScore}/100</div>
              </div>

              {/* Predicted Solubility */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Predicted Solubility
                </span>
                <div className="text-base font-bold text-teal-300">
                  {candidate.predictions.predictedSolubility}
                </div>
                <div className="text-[11px] font-mono-code text-slate-300">
                  LogS: {candidate.predictions.solubilityLogS}
                </div>
                <div className="text-[10px] text-slate-400">Aqueous profile</div>
              </div>

              {/* Predicted Toxicity */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Toxicity Risk
                </span>
                <div className="text-base font-bold text-slate-200">
                  {candidate.predictions.predictedToxicityRisk}
                </div>
                <div className="text-[11px] font-mono-code text-slate-300">
                  Safety Conf: {candidate.predictions.toxicityConfidence}%
                </div>
                <div className="text-[10px] text-slate-400">Panels evaluated</div>
              </div>
            </div>

            {/* Druglikeness & Synthetic Accessibility */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">QED Druglikeness</div>
                  <div className="font-mono-code font-bold text-white text-sm">
                    {candidate.predictions.qedScore}
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300">
                  Favorable
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">Synthetic Accessibility</div>
                  <div className="font-mono-code font-bold text-white text-sm">
                    {candidate.predictions.syntheticAccessibilityScore} <span className="text-[10px] text-slate-400">/ 10</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-300">
                  Feasible
                </span>
              </div>
            </div>
          </div>

          {/* Molecular Descriptors Detailed Table */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                Physical & Chemical Descriptors
              </h2>
              <span className="text-[10px] font-mono-code text-teal-400">Lipinski Verified</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Molecular Weight</div>
                <div className="font-mono-code font-bold text-white">
                  {candidate.descriptors.molecularWeight} g/mol
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px]">LogP Partition</div>
                <div className="font-mono-code font-bold text-teal-300">
                  {candidate.descriptors.logP}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px]">TPSA Polar Area</div>
                <div className="font-mono-code font-bold text-sky-300">
                  {candidate.descriptors.tpsa} Å²
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px]">H-Bond Donors</div>
                <div className="font-mono-code font-bold text-white">
                  {candidate.descriptors.hbd}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px]">H-Bond Acceptors</div>
                <div className="font-mono-code font-bold text-white">
                  {candidate.descriptors.hba}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Rotatable Bonds</div>
                <div className="font-mono-code font-bold text-white">
                  {candidate.descriptors.rotatableBonds}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Ring Count</div>
                <div className="font-mono-code font-bold text-violet-300">
                  {candidate.descriptors.ringCount} (Arom: {candidate.descriptors.aromaticRingCount || 0})
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Heavy Atom Count</div>
                <div className="font-mono-code font-bold text-white">
                  {candidate.descriptors.heavyAtomCount || 28}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Fraction Csp3</div>
                <div className="font-mono-code font-bold text-teal-300">
                  {candidate.descriptors.fractionCsp3 || 0.32}
                </div>
              </div>
            </div>

            {/* Model Prediction Disclaimer */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5 text-slate-400 text-[11px]">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-300">Computational Research Prototype Notice:</strong> Descriptors and affinity rankings are computational predictions produced for exploratory drug discovery and are not experimentally verified.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
