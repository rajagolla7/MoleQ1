import React from 'react';
import { PageView, Experiment, MoleculeCandidate } from '../types/molecule';
import {
  Atom,
  Sparkles,
  Search,
  History,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers,
  ArrowRight,
  Plus,
  Play,
  FileText,
  Clock,
  ChevronRight,
  Database,
  Cpu,
} from 'lucide-react';
import { MoleculeRenderer2D } from '../components/molecules/MoleculeRenderer2D';

interface DashboardProps {
  onNavigate: (page: PageView) => void;
  experiments: Experiment[];
  candidates: MoleculeCandidate[];
  onSelectCandidate: (id: string) => void;
  onOpenExperiment: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  experiments,
  candidates,
  onSelectCandidate,
  onOpenExperiment,
}) => {
  // Top candidates
  const topCandidates = [...candidates].sort((a, b) => b.overallScore - a.overallScore).slice(0, 3);

  return (
    <div id="workspace-dashboard-page" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Molecule Design Workspace
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 text-[10px] font-mono-code font-bold">
              Research Prototype
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time overview of active generative campaigns, receptor target libraries, and computed molecular leads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="dashboard-new-design-btn"
            type="button"
            onClick={() => onNavigate('design')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-400 hover:to-sky-500 text-slate-950 font-bold text-xs transition shadow-[0_0_20px_rgba(20,184,166,0.3)] flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>New Generative Run</span>
          </button>

          <button
            id="dashboard-quick-analyze-btn"
            type="button"
            onClick={() => onNavigate('analysis')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Search className="w-4 h-4 text-teal-400" />
            <span>Analyze SMILES</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards (Realistic Demo Metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Molecules Generated */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Molecules Generated
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-display">128</span>
            <span className="text-[11px] text-teal-400 font-medium">+24 this session</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Generated across 4 targets (Demo data)</p>
          <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-teal-500 to-transparent" />
        </div>

        {/* Card 2: Valid Molecules */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Valid Molecules
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-display">94</span>
            <span className="text-[11px] text-emerald-400 font-medium">73.4% validity</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">SMILES syntax & valence verified</p>
          <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-emerald-500 to-transparent" />
        </div>

        {/* Card 3: Candidates Analyzed */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Candidates Analyzed
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-display">76</span>
            <span className="text-[11px] text-sky-400 font-medium">Lipinski screened</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Multi-descriptor profiling</p>
          <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-sky-500 to-transparent" />
        </div>

        {/* Card 4: Experiments */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Experiments
            </span>
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <History className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-display">12</span>
            <span className="text-[11px] text-violet-400 font-medium">Archived logs</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Persisted in local database</p>
          <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-violet-500 to-transparent" />
        </div>
      </div>

      {/* Main Workspace Two-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Experiments Section (7 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <History className="w-4 h-4 text-teal-400" />
                  Recent Experiments
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  History of recent de novo generation batches and scoring benchmarks.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('experiments')}
                className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 transition"
              >
                View all ({experiments.length}) <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Experiments Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Experiment</th>
                    <th className="pb-3 font-semibold">Target</th>
                    <th className="pb-3 font-semibold text-right">Candidates</th>
                    <th className="pb-3 font-semibold text-right">Best Score</th>
                    <th className="pb-3 font-semibold text-center">Status</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {experiments.slice(0, 4).map((exp) => (
                    <tr
                      key={exp.id}
                      onClick={() => onOpenExperiment(exp.id)}
                      className="hover:bg-slate-900/60 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 font-medium text-white group-hover:text-teal-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                        {exp.name}
                      </td>
                      <td className="py-3 text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono-code text-[11px]">
                          {exp.target}
                        </span>
                      </td>
                      <td className="py-3 text-slate-300 text-right font-mono-code">
                        {exp.candidateCount}
                      </td>
                      <td className="py-3 text-right">
                        <span className="font-mono-code font-bold text-emerald-400">
                          {exp.bestScore}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            exp.status === 'Completed'
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-300 border border-amber-500/20 animate-pulse'
                          }`}
                        >
                          {exp.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenExperiment(exp.id);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition"
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Target Spectrum Overview */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Database className="w-4 h-4 text-sky-400" />
              Target Specificity Profiles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">EGFR Kinase</span>
                  <span className="text-[10px] font-mono-code text-teal-400">Oncology</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Tyrosine kinase ATP hinge-binding pocket targeting NSCLC & EGFR-mutant oncogenic drivers.
                </p>
                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800">
                  <span>Lead Scaffold: Quinazoline</span>
                  <span className="font-semibold text-emerald-400">Top Kd: 1.4 nM</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">DRD2 Dopamine</span>
                  <span className="text-[10px] font-mono-code text-sky-400">CNS / Neuro</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  G-protein coupled receptor requiring strict Blood-Brain Barrier (BBB) permeability & low TPSA.
                </p>
                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800">
                  <span>Lead Scaffold: Pyrazolopyrimidine</span>
                  <span className="font-semibold text-emerald-400">Top Kd: 4.1 nM</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">BACE1 Secretase</span>
                  <span className="text-[10px] font-mono-code text-violet-400">Alzheimer's</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Aspartyl protease active site targeting amyloid-beta peptide cleavage reduction.
                </p>
                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800">
                  <span>Lead Scaffold: Iminothiadiazine</span>
                  <span className="font-semibold text-emerald-400">Top Kd: 6.5 nM</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">HDAC1 Deacetylase</span>
                  <span className="text-[10px] font-mono-code text-amber-400">Epigenetics</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Class I histone deacetylase with zinc (Zn²⁺) coordination pocket for chromatin remodeling.
                </p>
                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800">
                  <span>Lead Scaffold: Hydroxamate</span>
                  <span className="font-semibold text-emerald-400">Top Kd: 12.0 nM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Top Ranked Molecular Leads (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                Top Ranked Leads
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('candidates')}
                className="text-xs text-teal-400 hover:text-teal-300 font-semibold"
              >
                All ({candidates.length})
              </button>
            </div>

            <div className="space-y-4">
              {topCandidates.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    onSelectCandidate(c.id);
                    onNavigate('details');
                  }}
                  className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/40 transition cursor-pointer group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-code font-bold text-teal-300 text-xs">
                      {c.id}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono-code text-[11px] font-bold">
                      Score: {c.overallScore}
                    </span>
                  </div>

                  <div className="h-28 w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800/80">
                    <MoleculeRenderer2D
                      smiles={c.smiles}
                      name={c.name}
                      height={110}
                      interactive={false}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Target: <strong className="text-slate-200">{c.target}</strong></span>
                    <span>MW: <strong className="text-slate-200">{c.descriptors.molecularWeight}</strong></span>
                    <span>LogP: <strong className="text-slate-200">{c.descriptors.logP}</strong></span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onNavigate('candidates')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <span>Explore All Candidate Results</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quantum Acceleration Preview Box */}
          <div
            onClick={() => onNavigate('quantum')}
            className="p-5 rounded-2xl bg-gradient-to-br from-violet-950/60 to-slate-900/90 border border-violet-500/30 hover:border-violet-500/60 transition cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-bold text-violet-300 font-display">
                <Cpu className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
                Quantum Architecture
              </span>
              <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/40">
                Phase 4
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore the quantum Hamiltonian encoding pipeline designed to interface with Qiskit VQE and Pennylane quantum circuits.
            </p>
            <div className="text-xs text-violet-300 font-semibold flex items-center gap-1 group-hover:underline">
              <span>View Quantum Roadmap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
