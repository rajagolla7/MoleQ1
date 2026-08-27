import React, { useState, useMemo } from 'react';
import {
  PageView,
  MoleculeCandidate,
  RankingBadge,
  ActivityLevel,
  SolubilityRating,
  ToxicityRiskRating,
} from '../types/molecule';
import { MoleculeRenderer2D } from '../components/molecules/MoleculeRenderer2D';
import {
  ListFilter,
  SlidersHorizontal,
  Bookmark,
  BookmarkCheck,
  Columns,
  Eye,
  ArrowUpDown,
  Download,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  LayoutGrid,
  Table as TableIcon,
  ChevronRight,
  ShieldCheck,
  Search,
} from 'lucide-react';

interface CandidatesProps {
  candidates: MoleculeCandidate[];
  onNavigate: (page: PageView) => void;
  onSelectCandidate: (id: string) => void;
  selectedForCompare: string[];
  onToggleCompare: (id: string) => void;
  onToggleSave: (id: string) => void;
}

type SortField = 'overallScore' | 'activityScore' | 'molecularWeight' | 'logP' | 'tpsa';

export const Candidates: React.FC<CandidatesProps> = ({
  candidates,
  onNavigate,
  onSelectCandidate,
  selectedForCompare,
  onToggleCompare,
  onToggleSave,
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('overallScore');
  const [sortAsc, setSortAsc] = useState(false);

  // Filters
  const [filterValidOnly, setFilterValidOnly] = useState(false);
  const [filterLowToxOnly, setFilterLowToxOnly] = useState(false);
  const [filterHighActivityOnly, setFilterHighActivityOnly] = useState(false);
  const [filterGoodSolubilityOnly, setFilterGoodSolubilityOnly] = useState(false);
  const [filterTarget, setFilterTarget] = useState<string>('all');

  const targetsList = useMemo(() => {
    const set = new Set(candidates.map((c) => c.target));
    return Array.from(set);
  }, [candidates]);

  const filteredAndSortedCandidates = useMemo(() => {
    return candidates
      .filter((c) => {
        if (filterValidOnly && !c.isValid) return false;
        if (filterLowToxOnly && c.predictions.predictedToxicityRisk !== 'Predicted Low Risk') return false;
        if (filterHighActivityOnly && c.predictions.predictedActivity !== 'High') return false;
        if (filterGoodSolubilityOnly && c.predictions.predictedSolubility !== 'Good') return false;
        if (filterTarget !== 'all' && c.target !== filterTarget) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            c.id.toLowerCase().includes(q) ||
            c.name.toLowerCase().includes(q) ||
            c.smiles.toLowerCase().includes(q) ||
            c.target.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        let valA: number = 0;
        let valB: number = 0;

        switch (sortBy) {
          case 'overallScore':
            valA = a.overallScore;
            valB = b.overallScore;
            break;
          case 'activityScore':
            valA = a.predictions.activityScore;
            valB = b.predictions.activityScore;
            break;
          case 'molecularWeight':
            valA = a.descriptors.molecularWeight;
            valB = b.descriptors.molecularWeight;
            break;
          case 'logP':
            valA = a.descriptors.logP;
            valB = b.descriptors.logP;
            break;
          case 'tpsa':
            valA = a.descriptors.tpsa;
            valB = b.descriptors.tpsa;
            break;
        }

        return sortAsc ? valA - valB : valB - valA;
      });
  }, [
    candidates,
    filterValidOnly,
    filterLowToxOnly,
    filterHighActivityOnly,
    filterGoodSolubilityOnly,
    filterTarget,
    searchQuery,
    sortBy,
    sortAsc,
  ]);

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Target', 'SMILES', 'Score', 'MW', 'LogP', 'TPSA', 'Activity', 'Solubility', 'ToxicityRisk'];
    const rows = filteredAndSortedCandidates.map((c) => [
      c.id,
      `"${c.name}"`,
      c.target,
      `"${c.smiles}"`,
      c.overallScore,
      c.descriptors.molecularWeight,
      c.descriptors.logP,
      c.descriptors.tpsa,
      c.predictions.predictedActivity,
      c.predictions.predictedSolubility,
      c.predictions.predictedToxicityRisk,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `quantum_ai_candidates_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getBadgeClass = (badge: RankingBadge) => {
    switch (badge) {
      case 'Excellent':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Good':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/40';
      case 'Moderate':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'Needs Review':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
  };

  return (
    <div id="candidate-results-page" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              Generated Candidates
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 text-[11px] font-mono-code font-bold">
              {filteredAndSortedCandidates.length} of {candidates.length} Shown
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Ranked chemical leads generated via multi-objective Pareto optimization across receptor affinity and ADMET properties.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Compare Launcher Button */}
          {selectedForCompare.length > 0 && (
            <button
              type="button"
              onClick={() => onNavigate('compare')}
              className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(20,184,166,0.3)] cursor-pointer"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Compare Selected ({selectedForCompare.length})</span>
            </button>
          )}

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Export CSV</span>
          </button>

          {/* Cards / Table Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              title="Grid Cards View"
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'cards' ? 'bg-teal-500/20 text-teal-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              title="Matrix Table View"
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table' ? 'bg-teal-500/20 text-teal-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="glass-panel p-4 rounded-2xl space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, name, target, or SMILES substring..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>

          {/* Target Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium shrink-0">Target:</span>
            <select
              value={filterTarget}
              onChange={(e) => setFilterTarget(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="all">All Targets ({candidates.length})</option>
              {targetsList.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium shrink-0">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortField)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="overallScore">Overall Score</option>
              <option value="activityScore">Predicted Activity</option>
              <option value="molecularWeight">Molecular Weight</option>
              <option value="logP">LogP Partition</option>
              <option value="tpsa">TPSA Area</option>
            </select>

            <button
              type="button"
              onClick={() => setSortAsc(!sortAsc)}
              title={sortAsc ? 'Sort Ascending' : 'Sort Descending'}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-teal-300 transition"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <span className="text-[11px] font-semibold text-slate-400">Quick Filters:</span>

          <button
            type="button"
            onClick={() => setFilterHighActivityOnly(!filterHighActivityOnly)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition ${
              filterHighActivityOnly
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            High Activity Only
          </button>

          <button
            type="button"
            onClick={() => setFilterGoodSolubilityOnly(!filterGoodSolubilityOnly)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition ${
              filterGoodSolubilityOnly
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 font-semibold'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            Good Solubility Only
          </button>

          <button
            type="button"
            onClick={() => setFilterLowToxOnly(!filterLowToxOnly)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition ${
              filterLowToxOnly
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-semibold'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            Predicted Low Risk Only
          </button>

          <button
            type="button"
            onClick={() => setFilterValidOnly(!filterValidOnly)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition ${
              filterValidOnly
                ? 'bg-violet-500/20 text-violet-300 border-violet-500/40 font-semibold'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            Lipinski Compliant Only
          </button>

          {(filterHighActivityOnly || filterGoodSolubilityOnly || filterLowToxOnly || filterValidOnly || filterTarget !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setFilterHighActivityOnly(false);
                setFilterGoodSolubilityOnly(false);
                setFilterLowToxOnly(false);
                setFilterValidOnly(false);
                setFilterTarget('all');
              }}
              className="text-[11px] text-rose-400 hover:text-rose-300 underline ml-2"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Candidate Listing Display */}
      {filteredAndSortedCandidates.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-2xl space-y-3">
          <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
          <h3 className="text-base font-bold text-white font-display">
            No candidate molecules match the active filters
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or reset the ADMET property filters above.
          </p>
        </div>
      ) : viewMode === 'cards' ? (
        /* Cards View (3 Columns) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCandidates.map((candidate) => {
            const isCompared = selectedForCompare.includes(candidate.id);

            return (
              <div
                key={candidate.id}
                id={`candidate-card-${candidate.id}`}
                className="glass-panel p-5 rounded-2xl space-y-4 hover:border-teal-500/40 transition-all flex flex-col justify-between group shadow-lg relative"
              >
                {/* Top ID & Badges */}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-code font-bold text-teal-300 text-sm">
                        {candidate.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getBadgeClass(
                          candidate.rankingBadge
                        )}`}
                      >
                        {candidate.rankingBadge}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Save Button */}
                      <button
                        type="button"
                        onClick={() => onToggleSave(candidate.id)}
                        title={candidate.isSaved ? 'Remove from saved' : 'Save candidate'}
                        className="p-1.5 text-slate-400 hover:text-amber-300 rounded-lg hover:bg-slate-900 transition"
                      >
                        {candidate.isSaved ? (
                          <BookmarkCheck className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>

                      {/* Compare Checkbox */}
                      <button
                        type="button"
                        onClick={() => onToggleCompare(candidate.id)}
                        title={isCompared ? 'Remove from compare' : 'Add to compare'}
                        className={`p-1.5 rounded-lg border text-xs transition ${
                          isCompared
                            ? 'bg-teal-500/20 text-teal-300 border-teal-500/50'
                            : 'text-slate-400 border-transparent hover:bg-slate-900'
                        }`}
                      >
                        <Columns className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title / Target */}
                  <div className="mt-2">
                    <div className="text-[11px] font-mono-code text-slate-400">
                      Target: <strong className="text-slate-200">{candidate.target}</strong>
                    </div>
                    <h3 className="text-sm font-bold text-white font-display line-clamp-1 mt-0.5" title={candidate.name}>
                      {candidate.name}
                    </h3>
                  </div>

                  {/* 2D Molecular Structure Thumbnail */}
                  <div className="mt-3 h-36 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 relative">
                    <MoleculeRenderer2D
                      smiles={candidate.smiles}
                      name={candidate.name}
                      height={144}
                      interactive={true}
                    />
                  </div>

                  {/* Key Physicochemical Specs */}
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">MW</div>
                      <div className="font-mono-code font-bold text-white text-[11px]">
                        {candidate.descriptors.molecularWeight}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">LogP</div>
                      <div className="font-mono-code font-bold text-teal-300 text-[11px]">
                        {candidate.descriptors.logP}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">TPSA</div>
                      <div className="font-mono-code font-bold text-sky-300 text-[11px]">
                        {candidate.descriptors.tpsa}
                      </div>
                    </div>
                  </div>

                  {/* AI Predictions Strip */}
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Activity:</span>
                      <span className="font-semibold text-emerald-400">
                        {candidate.predictions.predictedActivity} ({candidate.predictions.targetAffinityKd || 'High'})
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Solubility:</span>
                      <span className="font-semibold text-teal-300">
                        {candidate.predictions.predictedSolubility}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Toxicity Risk:</span>
                      <span className="font-semibold text-slate-300">
                        {candidate.predictions.predictedToxicityRisk}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Overall Score & View Details CTA */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                      Score
                    </span>
                    <span className="text-xl font-extrabold font-mono-code text-white">
                      {candidate.overallScore}
                      <span className="text-xs text-slate-400 font-normal"> /100</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectCandidate(candidate.id);
                      onNavigate('details');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Matrix Table View */
        <div className="glass-panel rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="p-3.5 font-semibold">Compare</th>
                <th className="p-3.5 font-semibold">Candidate ID</th>
                <th className="p-3.5 font-semibold">Target</th>
                <th className="p-3.5 font-semibold text-right">MW (Da)</th>
                <th className="p-3.5 font-semibold text-right">LogP</th>
                <th className="p-3.5 font-semibold text-right">TPSA (Å²)</th>
                <th className="p-3.5 font-semibold text-center">Activity</th>
                <th className="p-3.5 font-semibold text-center">Solubility</th>
                <th className="p-3.5 font-semibold text-center">Toxicity Risk</th>
                <th className="p-3.5 font-semibold text-right">Overall Score</th>
                <th className="p-3.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAndSortedCandidates.map((c) => {
                const isCompared = selectedForCompare.includes(c.id);

                return (
                  <tr
                    key={c.id}
                    onClick={() => {
                      onSelectCandidate(c.id);
                      onNavigate('details');
                    }}
                    className="hover:bg-slate-900/60 cursor-pointer transition-colors"
                  >
                    <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isCompared}
                        onChange={() => onToggleCompare(c.id)}
                        className="rounded border-slate-700 bg-slate-900 text-teal-500 focus:ring-teal-500/40"
                      />
                    </td>
                    <td className="p-3.5 font-mono-code font-bold text-teal-300">
                      {c.id}
                    </td>
                    <td className="p-3.5 text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px]">
                        {c.target}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-mono-code text-white">
                      {c.descriptors.molecularWeight}
                    </td>
                    <td className="p-3.5 text-right font-mono-code text-teal-300">
                      {c.descriptors.logP}
                    </td>
                    <td className="p-3.5 text-right font-mono-code text-sky-300">
                      {c.descriptors.tpsa}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="text-emerald-400 font-semibold">{c.predictions.predictedActivity}</span>
                    </td>
                    <td className="p-3.5 text-center text-teal-300">
                      {c.predictions.predictedSolubility}
                    </td>
                    <td className="p-3.5 text-center text-slate-300">
                      {c.predictions.predictedToxicityRisk}
                    </td>
                    <td className="p-3.5 text-right font-mono-code font-bold text-white text-sm">
                      {c.overallScore}
                    </td>
                    <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectCandidate(c.id);
                          onNavigate('details');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
