import React, { useState, useEffect } from 'react';
import {
  PageView,
  DesignParameters,
  DiseaseType,
  TargetType,
  SolubilityLevel,
  ToxicityPreference,
  CandidateCount,
  GenerationProgressStep,
  MoleculeCandidate,
  RankingWeights,
} from '../types/molecule';
import { 
  DEFAULT_DESIGN_PARAMS, 
  DISEASE_LIST, 
  DISEASE_TARGET_MAP, 
  TARGET_INFO_DATABASE 
} from '../data/mockData';
import { generateMolecules } from '../services/moleculeService';
import {
  Sparkles,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  RefreshCw,
  Info,
  ChevronDown,
  Atom,
  Activity,
  HeartPulse,
  ShieldCheck,
  Zap,
  HelpCircle,
  Dna,
  Filter,
  BarChart3,
  Check,
} from 'lucide-react';

interface DesignProps {
  onNavigate: (page: PageView) => void;
  onCandidatesGenerated: (candidates: MoleculeCandidate[]) => void;
}

const SCIENTIFIC_PIPELINE_STAGES = [
  { id: 'disease', label: 'Disease Selection', short: 'Disease' },
  { id: 'target', label: 'Biological Target', short: 'Target' },
  { id: 'requirements', label: 'Design Requirements', short: 'Requirements' },
  { id: 'generation', label: 'De Novo Generation', short: 'Generation' },
  { id: 'validation', label: 'Structure Validation', short: 'Validation' },
  { id: 'activity', label: 'Target Activity', short: 'Activity' },
  { id: 'solubility', label: 'Solubility Prediction', short: 'Solubility' },
  { id: 'toxicity', label: 'Toxicity Risk', short: 'Toxicity' },
  { id: 'filtering', label: 'Filtering & PAINS', short: 'Filtering' },
  { id: 'ranking', label: 'Multi-Objective Ranking', short: 'Ranking' },
  { id: 'candidates', label: 'Top Novel Candidates', short: 'Candidates' },
];

export const Design: React.FC<DesignProps> = ({ onNavigate, onCandidatesGenerated }) => {
  const [params, setParams] = useState<DesignParameters>({ ...DEFAULT_DESIGN_PARAMS });
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState<GenerationProgressStep | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generatedCountResult, setGeneratedCountResult] = useState<number | null>(null);
  const [activePipelineStage, setActivePipelineStage] = useState<number>(0);

  // Disease descriptions
  const DISEASE_DESCRIPTIONS: Record<string, string> = {
    'Cancer': 'Malignant neoplasms characterized by kinase/GTPase oncogenic signaling pathways.',
    "Alzheimer's Disease": 'Progressive neurodegenerative pathology marked by beta-amyloid & tau cascades.',
    "Parkinson's Disease": 'Dopaminergic neurodegeneration and monoamine oxidase / kinase signaling.',
    'Type 2 Diabetes': 'Metabolic disorder characterized by insulin resistance and incretin axis targets.',
    'Inflammatory Disease': 'Dysregulated immunological pathways and cytokine-mediated kinase signaling.',
    'Custom Disease': 'Custom research indication with user-defined target receptor biology.',
  };

  // Available targets for selected disease
  const availableTargets = (DISEASE_TARGET_MAP[params.disease] || ['EGFR', 'Custom Target']).map((t) => ({
    target: t as TargetType,
    label: TARGET_INFO_DATABASE[t]?.fullName ? `${t} — ${TARGET_INFO_DATABASE[t].fullName}` : t,
  }));

  // Target info for current selection
  const currentTargetInfo = TARGET_INFO_DATABASE[params.target];

  // Handle disease change and auto-set valid target
  const handleDiseaseChange = (newDisease: DiseaseType) => {
    const targetsForDisease = DISEASE_TARGET_MAP[newDisease] || [];
    const defaultTarget = targetsForDisease[0] || 'Custom Target';
    setParams({
      ...params,
      disease: newDisease,
      target: defaultTarget,
    });
  };

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (params.mwMin <= 0) errs.mwMin = 'Min Molecular Weight must be > 0';
    if (params.mwMax <= params.mwMin) errs.mwMax = 'Max MW must be greater than Min MW';
    if (params.mwMax > 1200) errs.mwMax = 'MW > 1200 exceeds small molecule druglike range';

    if (params.logPMax <= params.logPMin) errs.logPMax = 'Max LogP must be greater than Min LogP';

    if (params.tpsaMin < 0) errs.tpsaMin = 'Min TPSA cannot be negative';
    if (params.tpsaMax <= params.tpsaMin) errs.tpsaMax = 'Max TPSA must be greater than Min TPSA';

    if (params.maxHbd < 0) errs.maxHbd = 'HBD must be >= 0';
    if (params.maxHba < 0) errs.maxHba = 'HBA must be >= 0';
    if (params.maxRotatableBonds < 0) errs.maxRotatableBonds = 'Rotatable bonds must be >= 0';

    if (params.disease === 'Custom Disease' && !params.customDiseaseName?.trim()) {
      errs.customDisease = 'Please specify custom disease name';
    }

    if (params.target === 'Custom Target' && !params.customTargetName?.trim()) {
      errs.customTarget = 'Please specify custom target receptor name';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsGenerating(true);
    setGeneratedCountResult(null);

    try {
      const candidates = await generateMolecules(params, (step) => {
        setProgressStep(step);
        // Map 10-step progress to pipeline stage index
        setActivePipelineStage(Math.min(SCIENTIFIC_PIPELINE_STAGES.length - 1, step.step + 1));
      });

      onCandidatesGenerated(candidates);
      setGeneratedCountResult(candidates.length);
      setActivePipelineStage(SCIENTIFIC_PIPELINE_STAGES.length - 1);
    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResetDefaults = () => {
    setParams({ ...DEFAULT_DESIGN_PARAMS });
    setErrors({});
    setGeneratedCountResult(null);
    setActivePipelineStage(0);
  };

  const updateRankingWeight = (key: keyof RankingWeights, val: number) => {
    setParams((prev) => ({
      ...prev,
      rankingWeights: {
        ...prev.rankingWeights,
        [key]: Math.max(0, Math.min(100, val)),
      },
    }));
  };

  return (
    <div id="molecule-design-page" className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Title & Engine Mode Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              De Novo Molecule Design Workspace
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[11px] font-mono-code font-bold">
              Disease &rarr; Target &rarr; Candidate
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure disease pathology, select disease-associated biological targets, set physicochemical boundaries, and generate novel multi-objective ranked candidates.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          disabled={isGenerating}
          className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Scientific Workflow Progress Pipeline */}
      <div className="glass-panel p-4 rounded-2xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 font-display flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            Disease-to-Target De Novo Pipeline
          </span>
          <span className="text-[11px] font-mono-code text-slate-400">
            {isGenerating ? `Executing Step ${progressStep?.step || 1} / 10` : 'Interactive Discovery Workflow'}
          </span>
        </div>

        {/* Pipeline breadcrumbs */}
        <div className="overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 min-w-[760px]">
            {SCIENTIFIC_PIPELINE_STAGES.map((stage, idx) => {
              const isCurrent = isGenerating && progressStep ? (progressStep.step === idx || (idx === 0 && progressStep.step === 1)) : false;
              const isPassed = isGenerating && progressStep ? (progressStep.step > idx) : (generatedCountResult !== null);
              return (
                <React.Fragment key={stage.id}>
                  <div 
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono-code flex items-center gap-1 transition-all whitespace-nowrap ${
                      isCurrent
                        ? 'bg-teal-500 text-slate-950 font-bold ring-2 ring-teal-400 shadow-md scale-105'
                        : isPassed
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                        : 'bg-slate-900/80 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {isPassed && <Check className="w-2.5 h-2.5 text-teal-400" />}
                    <span>{stage.short}</span>
                  </div>
                  {idx < SCIENTIFIC_PIPELINE_STAGES.length - 1 && (
                    <span className="text-slate-600 text-[10px] font-bold">&rarr;</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Design Form */}
      <form onSubmit={handleGenerate} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Disease, Target & ADMET Settings (6 cols) */}
          <div className="lg:col-span-6 space-y-6">

            {/* 1. Disease Selection Box */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-white font-display flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-rose-400" />
                  1. Disease Selection
                </label>
                <span className="text-[10px] text-teal-400 font-mono-code">Step 1 of Workflow</span>
              </div>

              <div className="space-y-3">
                <select
                  id="design-disease-select"
                  value={params.disease}
                  onChange={(e) => handleDiseaseChange(e.target.value as DiseaseType)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 focus:border-teal-500 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500/40 transition font-medium cursor-pointer"
                >
                  {DISEASE_LIST.map((diseaseName) => (
                    <option key={diseaseName} value={diseaseName}>
                      {diseaseName} &mdash; {DISEASE_DESCRIPTIONS[diseaseName] || 'Therapeutic target focus'}
                    </option>
                  ))}
                </select>

                {params.disease === 'Custom Disease' && (
                  <div className="mt-2 space-y-1">
                    <input
                      type="text"
                      placeholder="Enter custom research disease (e.g. Rare Idiopathic Fibrosis)..."
                      value={params.customDiseaseName || ''}
                      onChange={(e) => setParams({ ...params, customDiseaseName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                    />
                    {errors.customDisease && (
                      <p className="text-[11px] text-rose-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {errors.customDisease}
                      </p>
                    )}
                  </div>
                )}

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                    <Info className="w-3.5 h-3.5 text-rose-400" />
                    <span>Pathology Context:</span>
                  </div>
                  <p>
                    {DISEASE_DESCRIPTIONS[params.disease] ||
                      'Define disease pathobiology parameters for downstream biological target coupling.'}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Disease-Associated Biological Target Box */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-white font-display flex items-center gap-2">
                  <Atom className="w-4 h-4 text-teal-400" />
                  2. Disease-Associated Biological Target
                </label>
                <span className="text-[10px] text-slate-400 font-mono-code">Filtered by Disease</span>
              </div>

              <div className="space-y-3">
                <select
                  id="design-target-select"
                  value={params.target}
                  onChange={(e) => setParams({ ...params, target: e.target.value as TargetType })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 focus:border-teal-500 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500/40 transition font-medium cursor-pointer"
                >
                  {availableTargets.map((t) => (
                    <option key={t.target} value={t.target}>
                      {t.label}
                    </option>
                  ))}
                  <option value="Custom Target">Custom Target (User Defined Protein)</option>
                </select>

                {params.target === 'Custom Target' && (
                  <div className="mt-2 space-y-1">
                    <input
                      type="text"
                      placeholder="Enter target protein name (e.g. KRAS G12D, CDK4/6)..."
                      value={params.customTargetName || ''}
                      onChange={(e) => setParams({ ...params, customTargetName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                    />
                    {errors.customTarget && (
                      <p className="text-[11px] text-rose-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {errors.customTarget}
                      </p>
                    )}
                  </div>
                )}

                {/* Target Information Card */}
                {currentTargetInfo && (
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <Dna className="w-3.5 h-3.5 text-teal-400" />
                        <span>{currentTargetInfo.name} &mdash; {currentTargetInfo.fullName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {currentTargetInfo.pdbId && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono-code text-teal-300">
                            PDB: {currentTargetInfo.pdbId}
                          </span>
                        )}
                        {currentTargetInfo.uniprotId && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono-code text-sky-300">
                            UniProt: {currentTargetInfo.uniprotId}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-[11px] space-y-1 text-slate-300">
                      <p><strong className="text-slate-400">Class:</strong> {currentTargetInfo.targetType}</p>
                      <p><strong className="text-slate-400">Description:</strong> {currentTargetInfo.description}</p>
                      {currentTargetInfo.keyBindingMotif && (
                        <p><strong className="text-slate-400">Binding Motif:</strong> {currentTargetInfo.keyBindingMotif}</p>
                      )}
                      <p><strong className="text-slate-400">Research Status:</strong> {currentTargetInfo.researchStatus}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. ADMET & Batch Preferences */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <label className="text-sm font-bold text-white font-display flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-400" />
                3. ADMET & Batch Preferences
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Desired Solubility */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold text-[11px]">Desired Solubility</label>
                  <select
                    id="design-solubility-select"
                    value={params.desiredSolubility}
                    onChange={(e) => setParams({ ...params, desiredSolubility: e.target.value as SolubilityLevel })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="High">High (LogS &gt; -4)</option>
                    <option value="Medium">Medium (LogS -4 to -5)</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                {/* Toxicity Preference */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold text-[11px]">Toxicity Filter</label>
                  <select
                    id="design-toxicity-select"
                    value={params.toxicityPreference}
                    onChange={(e) => setParams({ ...params, toxicityPreference: e.target.value as ToxicityPreference })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Very Low">Very Low Risk (Strict)</option>
                    <option value="Low">Low Risk (Standard)</option>
                  </select>
                </div>

                {/* Candidate Count */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold text-[11px]">Candidate Batch</label>
                  <select
                    id="design-candidates-count-select"
                    value={params.candidateCount}
                    onChange={(e) => setParams({ ...params, candidateCount: Number(e.target.value) as CandidateCount })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:border-teal-500 font-mono-code font-bold text-teal-300"
                  >
                    <option value={10}>10 Candidates</option>
                    <option value={25}>25 Candidates</option>
                    <option value={50}>50 Candidates</option>
                    <option value={100}>100 Candidates</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Physical Chemistry Boundaries & Ranking Weights (6 cols) */}
          <div className="lg:col-span-6 space-y-6">

            {/* 4. Physicochemical Property Ranges */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-white font-display flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  4. Molecular Design Requirements
                </label>
                <span className="text-[10px] text-emerald-400 font-mono-code">Lipinski Rule of 5</span>
              </div>

              {/* Molecular Weight Range */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">Molecular Weight (g/mol)</span>
                  <span className="font-mono-code text-teal-300 text-[11px]">
                    {params.mwMin} &ndash; {params.mwMax} Da
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      value={params.mwMin}
                      onChange={(e) => setParams({ ...params, mwMin: Number(e.target.value) })}
                      placeholder="Min (e.g. 250)"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono-code"
                    />
                    {errors.mwMin && <span className="text-[10px] text-rose-400">{errors.mwMin}</span>}
                  </div>
                  <div>
                    <input
                      type="number"
                      value={params.mwMax}
                      onChange={(e) => setParams({ ...params, mwMax: Number(e.target.value) })}
                      placeholder="Max (e.g. 500)"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono-code"
                    />
                    {errors.mwMax && <span className="text-[10px] text-rose-400">{errors.mwMax}</span>}
                  </div>
                </div>
              </div>

              {/* LogP Range */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">LogP (Lipophilicity)</span>
                  <span className="font-mono-code text-sky-300 text-[11px]">
                    {params.logPMin} &ndash; {params.logPMax}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    step="0.1"
                    value={params.logPMin}
                    onChange={(e) => setParams({ ...params, logPMin: Number(e.target.value) })}
                    placeholder="Min LogP"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono-code"
                  />
                  <div>
                    <input
                      type="number"
                      step="0.1"
                      value={params.logPMax}
                      onChange={(e) => setParams({ ...params, logPMax: Number(e.target.value) })}
                      placeholder="Max LogP"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono-code"
                    />
                    {errors.logPMax && <span className="text-[10px] text-rose-400">{errors.logPMax}</span>}
                  </div>
                </div>
              </div>

              {/* TPSA Range */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">TPSA (Polar Surface Area, Å²)</span>
                  <span className="font-mono-code text-violet-300 text-[11px]">
                    {params.tpsaMin} &ndash; {params.tpsaMax} Å²
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={params.tpsaMin}
                    onChange={(e) => setParams({ ...params, tpsaMin: Number(e.target.value) })}
                    placeholder="Min TPSA"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono-code"
                  />
                  <div>
                    <input
                      type="number"
                      value={params.tpsaMax}
                      onChange={(e) => setParams({ ...params, tpsaMax: Number(e.target.value) })}
                      placeholder="Max TPSA"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono-code"
                    />
                    {errors.tpsaMax && <span className="text-[10px] text-rose-400">{errors.tpsaMax}</span>}
                  </div>
                </div>
              </div>

              {/* Functional Group Counts */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-semibold">Max HBD</label>
                  <input
                    type="number"
                    value={params.maxHbd}
                    onChange={(e) => setParams({ ...params, maxHbd: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono-code"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-semibold">Max HBA</label>
                  <input
                    type="number"
                    value={params.maxHba}
                    onChange={(e) => setParams({ ...params, maxHba: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono-code"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-semibold">Max RotBonds</label>
                  <input
                    type="number"
                    value={params.maxRotatableBonds}
                    onChange={(e) => setParams({ ...params, maxRotatableBonds: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono-code"
                  />
                </div>
              </div>
            </div>

            {/* 5. Multi-Objective Ranking Weights */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-white font-display flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-violet-400" />
                  5. Multi-Objective Ranking Weights
                </label>
                <span className="text-[10px] text-slate-400 font-mono-code">Custom Pareto Weights</span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Activity Weight */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300 font-medium">Target Activity Weight:</span>
                    <span className="text-teal-400 font-mono-code font-bold">{params.rankingWeights.activityWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={params.rankingWeights.activityWeight}
                    onChange={(e) => updateRankingWeight('activityWeight', Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                </div>

                {/* Solubility Weight */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300 font-medium">Solubility Weight:</span>
                    <span className="text-sky-400 font-mono-code font-bold">{params.rankingWeights.solubilityWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={params.rankingWeights.solubilityWeight}
                    onChange={(e) => updateRankingWeight('solubilityWeight', Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                  />
                </div>

                {/* Toxicity Weight */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300 font-medium">Toxicity Safety Weight:</span>
                    <span className="text-emerald-400 font-mono-code font-bold">{params.rankingWeights.toxicityWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={params.rankingWeights.toxicityWeight}
                    onChange={(e) => updateRankingWeight('toxicityWeight', Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                </div>

                {/* Property Fit Weight */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300 font-medium">Physicochemical Fit & QED:</span>
                    <span className="text-violet-400 font-mono-code font-bold">{params.rankingWeights.propertyFitWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={params.rankingWeights.propertyFitWeight}
                    onChange={(e) => updateRankingWeight('propertyFitWeight', Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-400"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Loading Progress State & Notification */}
        {isGenerating && progressStep && (
          <div
            id="generation-loading-panel"
            className="p-6 rounded-2xl glass-panel-glow space-y-4 animate-in fade-in"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 animate-spin">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white font-display">
                    {progressStep.label}
                  </h2>
                  <p className="text-xs text-slate-400">{progressStep.description}</p>
                </div>
              </div>
              <span className="text-xs font-mono-code font-bold text-teal-300">
                {progressStep.progressPercent}%
              </span>
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-teal-400 via-sky-400 to-violet-500 transition-all duration-300 shadow-[0_0_12px_rgba(45,212,191,0.5)]"
                style={{ width: `${progressStep.progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono-code pt-1">
              <span>Scientific Pipeline Step {progressStep.step} of {progressStep.totalSteps}</span>
              <span>Disease: {params.disease} &bull; Target: {params.target} &bull; Batch: {params.candidateCount}</span>
            </div>
          </div>
        )}

        {/* Generation Success Notification */}
        {!isGenerating && generatedCountResult !== null && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-emerald-300 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="font-semibold text-emerald-200">
                  De Novo Generation complete!
                </strong>{' '}
                Synthesized {generatedCountResult} computationally generated candidates for {params.disease} ({params.target}).
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('candidates')}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>View Ranked Candidates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Action Button Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Computationally generated candidates for scientific exploration. Evaluated with multi-objective fitness scoring.</span>
          </div>

          <button
            id="generate-candidates-submit-btn"
            type="submit"
            disabled={isGenerating}
            className={`px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
              isGenerating
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-teal-400 via-teal-500 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 shadow-[0_0_25px_rgba(20,184,166,0.4)] hover:scale-[1.02]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Synthesizing Pipeline...' : 'Generate De Novo Candidates'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
