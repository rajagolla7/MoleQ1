import React, { useState } from 'react';
import { PageView, Experiment } from '../types/molecule';
import {
  History,
  Play,
  Copy,
  Trash2,
  ExternalLink,
  Plus,
  Sparkles,
  Layers,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  ArrowRight,
  Database,
} from 'lucide-react';

interface ExperimentsProps {
  experiments: Experiment[];
  onOpenExperiment: (id: string) => void;
  onDeleteExperiment: (id: string) => void;
  onDuplicateExperiment: (id: string) => void;
  onNavigate: (page: PageView) => void;
}

export const Experiments: React.FC<ExperimentsProps> = ({
  experiments,
  onOpenExperiment,
  onDeleteExperiment,
  onDuplicateExperiment,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterTarget, setFilterTarget] = useState<string>('all');

  const filteredExperiments = experiments.filter((exp) => {
    if (filterStatus !== 'all' && exp.status !== filterStatus) return false;
    if (filterTarget !== 'all' && exp.target !== filterTarget) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        exp.id.toLowerCase().includes(q) ||
        exp.name.toLowerCase().includes(q) ||
        exp.target.toLowerCase().includes(q) ||
        exp.bestCandidateName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div id="experiment-history-page" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Experiment History
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/30 text-[11px] font-mono-code font-bold">
              {filteredExperiments.length} Runs Logged
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Audit trail of computational campaigns, parameter snapshots, and synthesized molecule archives.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('design')}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-400 hover:to-sky-500 text-slate-950 font-bold text-xs transition shadow-[0_0_15px_rgba(20,184,166,0.3)] flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Experiment Run</span>
        </button>
      </div>

      {/* Toolbar / Search & Filter */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search experiments by name, ID, or receptor target..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value="all">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Running">Running</option>
            <option value="Queued">Queued</option>
          </select>

          <select
            value={filterTarget}
            onChange={(e) => setFilterTarget(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value="all">All Targets</option>
            <option value="EGFR">EGFR</option>
            <option value="DRD2">DRD2</option>
            <option value="BACE1">BACE1</option>
            <option value="HDAC1">HDAC1</option>
          </select>
        </div>
      </div>

      {/* Experiments Grid List */}
      {filteredExperiments.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-2xl space-y-3">
          <History className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white font-display">No experiments found</h3>
          <p className="text-xs text-slate-400">Try changing your filters or start a new generative design campaign.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredExperiments.map((exp) => (
            <div
              key={exp.id}
              id={`experiment-card-${exp.id}`}
              className="glass-panel p-6 rounded-2xl space-y-4 hover:border-teal-500/40 transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                {/* Header: ID, Target & Status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-code font-bold text-teal-300 text-sm">
                      {exp.id}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono-code text-slate-300">
                      {exp.target}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      exp.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/20 animate-pulse'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${exp.status === 'Completed' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    {exp.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white font-display mt-2">
                  {exp.name}
                </h3>

                {exp.notes && (
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {exp.notes}
                  </p>
                )}

                {/* Key Metrics Grid */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Date</span>
                    <span className="font-mono-code text-slate-200 font-semibold">{exp.date}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Candidates</span>
                    <span className="font-mono-code text-white font-semibold">{exp.candidateCount}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Top Score</span>
                    <span className="font-mono-code text-emerald-400 font-bold text-sm">
                      {exp.bestScore}
                    </span>
                  </div>
                </div>

                {/* Best Lead Banner */}
                <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
                      Leading Candidate
                    </span>
                    <span className="text-white font-medium line-clamp-1">{exp.bestCandidateName}</span>
                  </div>
                  <span className="font-mono-code text-teal-400 font-bold text-xs shrink-0">
                    {exp.bestCandidateId}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono-code text-slate-500">
                  Model: {exp.modelVersion}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onDuplicateExperiment(exp.id)}
                    title="Duplicate Experiment Parameters"
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition text-xs flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Duplicate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteExperiment(exp.id)}
                    title="Delete Experiment"
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenExperiment(exp.id)}
                    className="px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <span>Open Run</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
