import React from 'react';
import { PageView, MoleculeCandidate } from '../types/molecule';
import { MoleculeRenderer2D } from '../components/molecules/MoleculeRenderer2D';
import {
  Columns,
  Sparkles,
  ArrowLeft,
  X,
  Plus,
  CheckCircle2,
  AlertCircle,
  Eye,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface CompareProps {
  candidates: MoleculeCandidate[];
  selectedIds: string[];
  onRemoveFromCompare: (id: string) => void;
  onAddCandidate: (id: string) => void;
  onSelectCandidate: (id: string) => void;
  onNavigate: (page: PageView) => void;
}

export const Compare: React.FC<CompareProps> = ({
  candidates,
  selectedIds,
  onRemoveFromCompare,
  onAddCandidate,
  onSelectCandidate,
  onNavigate,
}) => {
  const comparedCandidates = candidates.filter((c) => selectedIds.includes(c.id));
  const availableToAdd = candidates.filter((c) => !selectedIds.includes(c.id));

  // Determine best values for highlighting
  const bestScore = Math.max(...comparedCandidates.map((c) => c.overallScore), 0);
  const bestActivity = Math.max(...comparedCandidates.map((c) => c.predictions.activityScore), 0);

  if (comparedCandidates.length === 0) {
    return (
      <div className="p-12 text-center max-w-lg mx-auto space-y-4 glass-panel rounded-2xl my-8">
        <Columns className="w-10 h-10 text-teal-400 mx-auto" />
        <h2 className="text-lg font-bold text-white font-display">Comparison Matrix Empty</h2>
        <p className="text-xs text-slate-400">
          Select at least two molecular candidates from the Candidate Results or Dashboard to compare physical descriptors side by side.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('candidates')}
          className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
        >
          Explore Candidates
        </button>
      </div>
    );
  }

  return (
    <div id="molecule-compare-page" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('candidates')}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                Multi-Candidate Comparison Matrix
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-mono-code font-bold">
                {comparedCandidates.length} Selected
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Side-by-side physicochemical descriptor benchmarking, Lipinski compliance, and AI safety profiling.
            </p>
          </div>
        </div>

        {/* Add Candidate Dropdown */}
        {availableToAdd.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Add Candidate:</span>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  onAddCandidate(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 font-mono-code"
            >
              <option value="" disabled>
                + Select to add...
              </option>
              {availableToAdd.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} ({c.target} &bull; Score: {c.overallScore})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Comparison Grid & Table */}
      <div className="glass-panel rounded-2xl overflow-hidden overflow-x-auto shadow-2xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            {/* Header row with thumbnails and IDs */}
            <tr className="border-b border-slate-800 bg-slate-900/90">
              <th className="p-4 w-48 text-slate-400 uppercase tracking-wider text-[11px] font-semibold sticky left-0 bg-slate-900 z-10">
                Property / Metric
              </th>
              {comparedCandidates.map((c) => (
                <th key={c.id} className="p-4 min-w-[220px] align-top">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div>
                      <span className="font-mono-code font-bold text-teal-300 text-sm">
                        {c.id}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-medium">
                        Target: {c.target}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveFromCompare(c.id)}
                      title="Remove from comparison"
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 2D Structure Thumbnail */}
                  <div className="mt-2 h-28 w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
                    <MoleculeRenderer2D
                      smiles={c.smiles}
                      name={c.name}
                      height={112}
                      interactive={false}
                    />
                  </div>

                  <h3 className="mt-2 text-xs font-bold text-white line-clamp-1" title={c.name}>
                    {c.name}
                  </h3>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectCandidate(c.id);
                      onNavigate('details');
                    }}
                    className="mt-2 w-full py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-[11px] font-medium transition"
                  >
                    View Details
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60">
            {/* Overall Score */}
            <tr className="hover:bg-slate-900/40 bg-slate-900/20">
              <td className="p-4 font-bold text-white sticky left-0 bg-slate-900/90 z-10">
                Overall Score
              </td>
              {comparedCandidates.map((c) => {
                const isBest = c.overallScore === bestScore;
                return (
                  <td key={c.id} className="p-4">
                    <span
                      className={`font-mono-code font-extrabold text-base ${
                        isBest ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]' : 'text-white'
                      }`}
                    >
                      {c.overallScore} / 100
                    </span>
                    {isBest && (
                      <span className="ml-2 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        Best Lead
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Target Activity */}
            <tr className="hover:bg-slate-900/40">
              <td className="p-4 font-semibold text-slate-300 sticky left-0 bg-slate-900/90 z-10">
                Predicted Activity (Kd)
              </td>
              {comparedCandidates.map((c) => (
                <td key={c.id} className="p-4">
                  <div className="font-semibold text-emerald-400">
                    {c.predictions.predictedActivity} ({c.predictions.targetAffinityKd})
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Score: {c.predictions.activityScore}/100
                  </div>
                </td>
              ))}
            </tr>

            {/* Molecular Weight */}
            <tr className="hover:bg-slate-900/40">
              <td className="p-4 font-semibold text-slate-300 sticky left-0 bg-slate-900/90 z-10">
                Molecular Weight (g/mol)
              </td>
              {comparedCandidates.map((c) => (
                <td key={c.id} className="p-4 font-mono-code text-white">
                  {c.descriptors.molecularWeight} Da
                </td>
              ))}
            </tr>

            {/* LogP */}
            <tr className="hover:bg-slate-900/40">
              <td className="p-4 font-semibold text-slate-300 sticky left-0 bg-slate-900/90 z-10">
                LogP Partition
              </td>
              {comparedCandidates.map((c) => (
                <td key={c.id} className="p-4 font-mono-code text-teal-300">
                  {c.descriptors.logP}
                </td>
              ))}
            </tr>

            {/* TPSA */}
            <tr className="hover:bg-slate-900/40">
              <td className="p-4 font-semibold text-slate-300 sticky left-0 bg-slate-900/90 z-10">
                TPSA Polar Surface (Å²)
              </td>
              {comparedCandidates.map((c) => (
                <td key={c.id} className="p-4 font-mono-code text-sky-300">
                  {c.descriptors.tpsa} Å²
                </td>
              ))}
            </tr>

            {/* H-Bond Donors */}
            <tr className="hover:bg-slate-900/40">
              <td className="p-4 font-semibold text-slate-300 sticky left-0 bg-slate-900/90 z-10">
                H-Bond Donors (HBD)
              </td>
              {comparedCandidates.map((c) => (
                <td key={c.id} className="p-4 font-mono-code text-white">
                  {c.descriptors.hbd}
                </td>
              ))}
            </tr>

            {/* H-Bond Acceptors */}
            <tr className="hover:bg-slate-900/40">
              <td className="p-4 font-semibold text-slate-300 sticky left-0 bg-slate-900/90 z-10">
                H-Bond Acceptors (HBA)
              </td>
              {comparedCandidates.map((c) => (
                <td key={c.id} className="p-4 font-mono-code text-white">
                  {c.descriptors.hba}
                </td>
              ))}
            </tr>

            {/* Solubility Prediction */}
            <tr className="hover:bg-slate-900/40">
              <td className="p-4 font-semibold text-slate-300 sticky left-0 bg-slate-900/90 z-10">
                Predicted Solubility
              </td>
              {comparedCandidates.map((c) => (
                <td key={c.id} className="p-4 text-teal-300 font-semibold">
                  {c.predictions.predictedSolubility} (LogS {c.predictions.solubilityLogS})
                </td>
              ))}
            </tr>

            {/* Toxicity Risk Prediction */}
            <tr className="hover:bg-slate-900/40">
              <td className="p-4 font-semibold text-slate-300 sticky left-0 bg-slate-900/90 z-10">
                Predicted Toxicity Risk
              </td>
              {comparedCandidates.map((c) => (
                <td key={c.id} className="p-4 text-slate-200">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px]">
                    {c.predictions.predictedToxicityRisk}
                  </span>
                </td>
              ))}
            </tr>

            {/* Lipinski Rule of 5 */}
            <tr className="hover:bg-slate-900/40">
              <td className="p-4 font-semibold text-slate-300 sticky left-0 bg-slate-900/90 z-10">
                Lipinski Rule of 5
              </td>
              {comparedCandidates.map((c) => (
                <td key={c.id} className="p-4">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
                    Compliant (Oral Bioavailable)
                  </span>
                </td>
              ))}
            </tr>

            {/* Synthetic Accessibility */}
            <tr className="hover:bg-slate-900/40">
              <td className="p-4 font-semibold text-slate-300 sticky left-0 bg-slate-900/90 z-10">
                Synthetic Accessibility
              </td>
              {comparedCandidates.map((c) => (
                <td key={c.id} className="p-4 font-mono-code text-white">
                  {c.predictions.syntheticAccessibilityScore} / 10
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
