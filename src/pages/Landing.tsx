import React, { useState } from 'react';
import { PageView } from '../types/molecule';
import {
  Sparkles,
  Search,
  Sliders,
  Cpu,
  ArrowRight,
  Atom,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { MoleculeRenderer2D } from '../components/molecules/MoleculeRenderer2D';
import { MoleculeViewer3D } from '../components/molecules/MoleculeViewer3D';
import { INITIAL_CANDIDATES } from '../data/mockData';

interface LandingProps {
  onNavigate: (page: PageView) => void;
  onSelectCandidate?: (id: string) => void;
  appName?: string;
  theme?: 'dark' | 'bright';
}

export const Landing: React.FC<LandingProps> = ({ 
  onNavigate, 
  onSelectCandidate,
  appName = 'MolQuantum AI',
  theme = 'dark',
}) => {
  const [activeTab, setActiveTab] = useState<'3d' | '2d'>('3d');
  const featuredCandidate = INITIAL_CANDIDATES[0]; // Gefitinib Analog QMD-001
  const isDark = theme === 'dark';

  return (
    <div id="landing-page-root" className="relative w-full overflow-hidden">
      {/* Hero Section with Cinematic Framing */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Subtle Pill Tag */}
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6 backdrop-blur-md border ${
          isDark
            ? 'bg-teal-500/10 border-teal-500/30 text-teal-300 shadow-[0_0_20px_rgba(20,184,166,0.2)]'
            : 'bg-teal-50 border-teal-300 text-teal-800 shadow-xs'
        }`}>
          <Atom className="w-4 h-4 text-teal-500 animate-spin" style={{ animationDuration: '10s' }} />
          <span>Next-Gen Molecular Intelligence</span>
        </div>

        {/* Main Heading */}
        <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-display max-w-5xl leading-[1.1] ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          <span className="bg-gradient-to-r from-teal-500 via-sky-500 to-indigo-600 bg-clip-text text-transparent">{appName}</span>
          <br className="hidden sm:inline" /> Discovery Studio
        </h1>

        {/* Subtitle */}
        <p className={`mt-5 text-xl sm:text-2xl font-medium max-w-3xl leading-snug ${
          isDark ? 'text-slate-200' : 'text-slate-700'
        }`}>
          Generative intelligence for exploring the chemical space of tomorrow.
        </p>

        {/* Supporting Text */}
        <p className={`mt-4 text-sm sm:text-base max-w-2xl leading-relaxed ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Design, analyze, and rank novel molecular candidates using classical AI today &mdash; with a quantum-ready architecture and seamless dark &amp; bright visual themes.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            id="hero-start-designing-btn"
            type="button"
            onClick={() => onNavigate('design')}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-400 hover:to-sky-500 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-[0_0_25px_rgba(20,184,166,0.35)] flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Designing</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            id="hero-explore-platform-btn"
            type="button"
            onClick={() => onNavigate('dashboard')}
            className={`px-6 py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 backdrop-blur-md cursor-pointer hover:scale-[1.02] active:scale-[0.98] border ${
              isDark
                ? 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-700/80 hover:border-teal-500/50 text-slate-200'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-sm'
            }`}
          >
            <Layers className="w-4 h-4 text-teal-500" />
            <span>Explore Workspace</span>
          </button>
        </div>

        {/* Live Interactive Molecule Lead Showcase Box */}
        <div className="mt-14 w-full max-w-4xl glass-panel-glow rounded-2xl p-4 sm:p-6 text-left relative overflow-hidden">
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 ${
            isDark ? 'border-slate-800/80' : 'border-slate-200'
          }`}>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-mono-code font-bold border ${
                  isDark ? 'bg-teal-500/20 text-teal-300 border-teal-500/30' : 'bg-teal-100 text-teal-800 border-teal-300'
                }`}>
                  {featuredCandidate.id}
                </span>
                <span className={`text-xs uppercase tracking-wider font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Target: {featuredCandidate.target} Kinase
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Score: {featuredCandidate.overallScore} / 100
                </span>
              </div>
              <h2 className={`text-base sm:text-lg font-bold font-display mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {featuredCandidate.name}
              </h2>
            </div>

            {/* 3D vs 2D Toggle */}
            <div className={`flex items-center border rounded-xl p-1 text-xs font-medium self-end sm:self-auto ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-300'
            }`}>
              <button
                type="button"
                onClick={() => setActiveTab('3d')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === '3d'
                    ? isDark
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold'
                      : 'bg-white text-teal-800 font-bold shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3D View
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('2d')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === '2d'
                    ? isDark
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold'
                      : 'bg-white text-teal-800 font-bold shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2D Structure
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Visualizer */}
            <div className="md:col-span-7">
              {activeTab === '3d' ? (
                <MoleculeViewer3D
                  smiles={featuredCandidate.smiles}
                  name={featuredCandidate.name}
                  height={260}
                />
              ) : (
                <MoleculeRenderer2D
                  smiles={featuredCandidate.smiles}
                  name={featuredCandidate.name}
                  height={260}
                  showSmilesBanner={true}
                />
              )}
            </div>

            {/* Chemical & Descriptor Matrix */}
            <div className="md:col-span-5 space-y-3">
              <div className={`p-3 rounded-xl border space-y-2 ${
                isDark ? 'bg-slate-900/80 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={`text-[11px] uppercase tracking-wider font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Key Descriptors
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`p-2 rounded-lg border ${
                    isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Mol. Weight</div>
                    <div className={`font-mono-code font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {featuredCandidate.descriptors.molecularWeight} <span className="text-[10px] text-slate-400">g/mol</span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg border ${
                    isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>LogP Partition</div>
                    <div className="font-mono-code font-bold text-teal-500 text-sm">
                      {featuredCandidate.descriptors.logP}
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg border ${
                    isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>TPSA Polar Area</div>
                    <div className="font-mono-code font-bold text-sky-500 text-sm">
                      {featuredCandidate.descriptors.tpsa} <span className="text-[10px] text-slate-400">Å²</span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg border ${
                    isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Pred. Affinity (Kd)</div>
                    <div className="font-mono-code font-bold text-emerald-500 text-sm">
                      {featuredCandidate.predictions.targetAffinityKd}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectCandidate) onSelectCandidate(featuredCandidate.id);
                    onNavigate('details');
                  }}
                  className={`w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-teal-300'
                      : 'bg-white hover:bg-slate-50 border-slate-300 text-teal-800 shadow-xs'
                  }`}
                >
                  <span>Inspect Candidate Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10-Stage Scientific Discovery Workflow Banner */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className={`p-6 rounded-2xl border ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="text-center mb-6">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${
              isDark ? 'text-teal-400' : 'text-teal-700'
            }`}>
              End-to-End Computational Pipeline
            </span>
            <h2 className={`text-xl sm:text-2xl font-bold font-display mt-1 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              From Disease Selection to Top Novel Candidates
            </h2>
            <p className={`text-xs mt-1 max-w-2xl mx-auto ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Our 10-stage de novo generation pipeline couples structural biological context with multi-objective Pareto optimization.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center text-xs">
            <div className={`p-3 rounded-xl border ${
              isDark ? 'bg-rose-500/10 border-rose-500/30' : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <span className="text-[10px] font-mono-code font-bold block text-rose-500">01. DISEASE</span>
              <span className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Pathology Target</span>
            </div>
            <div className={`p-3 rounded-xl border ${
              isDark ? 'bg-teal-500/10 border-teal-500/30' : 'bg-teal-50 border-teal-200 text-teal-900'
            }`}>
              <span className="text-[10px] font-mono-code font-bold block text-teal-500">02. TARGET</span>
              <span className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Kinase / GPCR / Receptor</span>
            </div>
            <div className={`p-3 rounded-xl border ${
              isDark ? 'bg-sky-500/10 border-sky-500/30' : 'bg-sky-50 border-sky-200 text-sky-900'
            }`}>
              <span className="text-[10px] font-mono-code font-bold block text-sky-500">03. REQUIREMENTS</span>
              <span className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>MW, LogP &amp; Scaffolding</span>
            </div>
            <div className={`p-3 rounded-xl border ${
              isDark ? 'bg-violet-500/10 border-violet-500/30' : 'bg-violet-50 border-violet-200 text-violet-900'
            }`}>
              <span className="text-[10px] font-mono-code font-bold block text-violet-500">04. DE NOVO GEN</span>
              <span className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>SMILES Auto-Assembly</span>
            </div>
            <div className={`p-3 rounded-xl border ${
              isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <span className="text-[10px] font-mono-code font-bold block text-emerald-500">05. VALIDATION</span>
              <span className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Valence &amp; Ring Topology</span>
            </div>

            <div className={`p-3 rounded-xl border ${
              isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <span className="text-[10px] font-mono-code font-bold block text-amber-500">06. ACTIVITY</span>
              <span className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Target Affinity (Kd)</span>
            </div>
            <div className={`p-3 rounded-xl border ${
              isDark ? 'bg-teal-500/10 border-teal-500/30' : 'bg-teal-50 border-teal-200 text-teal-900'
            }`}>
              <span className="text-[10px] font-mono-code font-bold block text-teal-500">07. SOLUBILITY</span>
              <span className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>LogS Hydration Profile</span>
            </div>
            <div className={`p-3 rounded-xl border ${
              isDark ? 'bg-rose-500/10 border-rose-500/30' : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <span className="text-[10px] font-mono-code font-bold block text-rose-500">08. TOXICITY</span>
              <span className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>hERG / Ames Safety</span>
            </div>
            <div className={`p-3 rounded-xl border ${
              isDark ? 'bg-sky-500/10 border-sky-500/30' : 'bg-sky-50 border-sky-200 text-sky-900'
            }`}>
              <span className="text-[10px] font-mono-code font-bold block text-sky-500">09. FILTERING</span>
              <span className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Lipinski &amp; Pan-Assay</span>
            </div>
            <div className={`p-3 rounded-xl border ${
              isDark ? 'bg-teal-500/20 border-teal-500/50' : 'bg-teal-100 border-teal-300 text-teal-950'
            }`}>
              <span className="text-[10px] font-mono-code font-bold block text-teal-400">10. RANKED LEADS</span>
              <span className={`text-xs font-bold ${isDark ? 'text-teal-200' : 'text-teal-900'}`}>Pareto Multi-Objective</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Capabilities Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className={`text-2xl sm:text-3xl font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Platform Capabilities
          </h2>
          <p className={`text-sm mt-2 max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Comprehensive suite of AI and chemical informatics engines structured for scalable computational workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Generate */}
          <div
            onClick={() => onNavigate('design')}
            className="glass-panel p-6 rounded-2xl hover:border-teal-500/50 transition-all group cursor-pointer hover:-translate-y-1 shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-500 mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold font-display mb-2 flex items-center justify-between ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Generate
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-transform group-hover:translate-x-1" />
            </h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Generate novel molecular candidates based on desired properties and receptor binding geometries.
            </p>
          </div>

          {/* Card 2: Analyze */}
          <div
            onClick={() => onNavigate('analysis')}
            className="glass-panel p-6 rounded-2xl hover:border-sky-500/50 transition-all group cursor-pointer hover:-translate-y-1 shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-500 mb-4 group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold font-display mb-2 flex items-center justify-between ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Analyze
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-500 transition-transform group-hover:translate-x-1" />
            </h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Calculate molecular descriptors and evaluate chemical characteristics, Lipinski rules, and QED scores.
            </p>
          </div>

          {/* Card 3: Optimize */}
          <div
            onClick={() => onNavigate('candidates')}
            className="glass-panel p-6 rounded-2xl hover:border-emerald-500/50 transition-all group cursor-pointer hover:-translate-y-1 shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold font-display mb-2 flex items-center justify-between ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Optimize
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-transform group-hover:translate-x-1" />
            </h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Rank candidates according to user-defined molecular objectives, toxicity windows, and synthetic accessibility.
            </p>
          </div>

          {/* Card 4: Quantum Ready */}
          <div
            onClick={() => onNavigate('quantum')}
            className="glass-panel p-6 rounded-2xl hover:border-violet-500/50 transition-all group cursor-pointer hover:-translate-y-1 shadow-sm border-violet-500/20"
          >
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-500 mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold font-display mb-2 flex items-center justify-between ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Quantum Ready
              <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono-code font-normal ${
                isDark ? 'bg-violet-500/20 text-violet-300 border-violet-500/40' : 'bg-violet-100 text-violet-800 border-violet-200'
              }`}>
                VQE / QAOA
              </span>
            </h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Architecture prepared for future quantum-enhanced molecular optimization and electronic Hamiltonian simulations.
            </p>
          </div>
        </div>
      </section>

      {/* Target Discovery Hub Bar */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-8">
        <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 ${
          isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <h3 className={`text-base font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Ready to generate novel molecular leads?
            </h3>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Select an oncological, neurological, or custom therapeutic target and configure desired physicochemical constraints.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('design')}
            className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition shrink-0 cursor-pointer flex items-center gap-1.5 shadow-md"
          >
            <span>Launch Design Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
