import React from 'react';
import { PageView } from '../types/molecule';
import {
  BookOpen,
  Atom,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Binary,
  FileText,
  ExternalLink,
  Target,
  Network,
  Scale,
} from 'lucide-react';

interface ResearchProps {
  onNavigate: (page: PageView) => void;
}

export const Research: React.FC<ResearchProps> = ({ onNavigate }) => {
  return (
    <div id="research-methodology-page" className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Research & Methodology
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 text-[11px] font-mono-code font-bold">
            Scientific Framework
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          Theoretical foundations, computational chemistry principles, classical deep learning pipelines, and quantum variational expansions underpinning the platform.
        </p>
      </div>

      {/* Section 1: The Drug Discovery Bottleneck */}
      <section className="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 text-teal-400 text-xs font-mono-code font-semibold uppercase tracking-wider">
          <Target className="w-4 h-4" />
          <span>Section 01 &bull; Computational Challenge</span>
        </div>
        <h2 className="text-xl font-bold text-white font-display">
          The Combinatorial Explosion of Chemical Space
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          The universe of synthetically accessible drug-like small molecules is estimated at{' '}
          <strong className="text-teal-300 font-mono-code">10⁶⁰ compounds</strong>. Traditional High-Throughput Screening (HTS) can only evaluate approximately 10⁶ molecules physically, exploring a negligible fraction of chemical diversity. Conventional drug discovery cycles take 10&ndash;15 years and exceed $2.6 billion per approved chemical entity, largely driven by late-stage attrition due to unanticipated toxicity or poor ADMET profiles.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
            <span className="text-2xl font-extrabold text-white font-display">10⁶⁰</span>
            <span className="text-[11px] text-slate-400 block font-medium">Estimated Chemical Space</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
            <span className="text-2xl font-extrabold text-teal-400 font-display">12+ Years</span>
            <span className="text-[11px] text-slate-400 block font-medium">Standard Discovery Timeline</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
            <span className="text-2xl font-extrabold text-rose-400 font-display">90%</span>
            <span className="text-[11px] text-slate-400 block font-medium">Clinical Phase Attrition Rate</span>
          </div>
        </div>
      </section>

      {/* Section 2: Classical AI Architecture */}
      <section className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6">
        <div className="flex items-center gap-2 text-sky-400 text-xs font-mono-code font-semibold uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Section 02 &bull; Current Classical Pipeline</span>
        </div>
        <h2 className="text-xl font-bold text-white font-display">
          Multi-Objective Generative Machine Learning
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          The current release runs entirely on classical neural architectures designed to rapidly sample high-affinity scaffolds and filter candidates with strict multi-parameter optimization:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Network className="w-4 h-4 text-teal-400" />
              1. Generative Scaffolding & Syntax
            </h3>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Trained on 1.8M ChEMBL structures using conditional variational autoencoders (cVAE) and masked transformer language models with grammar-constrained decoding to eliminate invalid valences.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-sky-400" />
              2. Multi-Objective Scoring Function
            </h3>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Compounds are prioritized using a weighted Pareto frontier scoring target affinity, Lipinski druglikeness, QED, Synthetic Accessibility (SAScore), and safety screening.
            </p>
          </div>
        </div>

        {/* Pipeline Diagram */}
        <div className="p-4 sm:p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
              10-Stage Scientific Discovery Workflow
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              From therapeutic pathology identification to novel multi-objective ranked small-molecule leads
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30">
              <span className="text-[10px] text-rose-400 font-mono-code font-bold block">01. DISEASE</span>
              <span className="text-[11px] text-slate-200 font-medium">Pathology Context</span>
            </div>
            <div className="p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/30">
              <span className="text-[10px] text-teal-400 font-mono-code font-bold block">02. TARGET</span>
              <span className="text-[11px] text-slate-200 font-medium">Bio-Receptor Mapping</span>
            </div>
            <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/30">
              <span className="text-[10px] text-sky-400 font-mono-code font-bold block">03. REQUIREMENTS</span>
              <span className="text-[11px] text-slate-200 font-medium">MW, LogP &amp; Scaffolding</span>
            </div>
            <div className="p-2.5 rounded-lg bg-violet-500/10 border border-violet-500/30">
              <span className="text-[10px] text-violet-400 font-mono-code font-bold block">04. DE NOVO GEN</span>
              <span className="text-[11px] text-slate-200 font-medium">SMILES Auto-Assembly</span>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-[10px] text-emerald-400 font-mono-code font-bold block">05. VALIDATION</span>
              <span className="text-[11px] text-slate-200 font-medium">Valence &amp; Ring Topology</span>
            </div>

            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <span className="text-[10px] text-amber-400 font-mono-code font-bold block">06. ACTIVITY</span>
              <span className="text-[11px] text-slate-200 font-medium">Target Affinity Kd</span>
            </div>
            <div className="p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/30">
              <span className="text-[10px] text-teal-400 font-mono-code font-bold block">07. SOLUBILITY</span>
              <span className="text-[11px] text-slate-200 font-medium">LogS Hydration</span>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30">
              <span className="text-[10px] text-rose-400 font-mono-code font-bold block">08. TOXICITY</span>
              <span className="text-[11px] text-slate-200 font-medium">hERG &amp; Ames Risk</span>
            </div>
            <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/30">
              <span className="text-[10px] text-sky-400 font-mono-code font-bold block">09. FILTERING</span>
              <span className="text-[11px] text-slate-200 font-medium">Lipinski Compliance</span>
            </div>
            <div className="p-2.5 rounded-lg bg-teal-500/20 border border-teal-500/50">
              <span className="text-[10px] text-teal-300 font-mono-code font-bold block">10. RANKED LEADS</span>
              <span className="text-[11px] text-teal-200 font-semibold">Multi-Objective Score</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Quantum Chemistry Future Vision */}
      <section className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6">
        <div className="flex items-center gap-2 text-violet-400 text-xs font-mono-code font-semibold uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          <span>Section 03 &bull; Future Quantum Module</span>
        </div>
        <h2 className="text-xl font-bold text-white font-display">
          Hybrid Quantum-Classical Simulation Roadmap
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Classical density functional theory (DFT) relies on approximations that break down in strongly correlated electronic systems (e.g. metalloenzyme active sites, transition states). Quantum computing offers exact electronic structure calculations through Hamiltonian qubit mapping:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/20 space-y-1.5">
            <h3 className="font-bold text-violet-300">Variational Quantum Eigensolver (VQE)</h3>
            <p className="text-slate-400 text-[11px]">
              Hybrid algorithm calculating molecular ground state energies on NISQ hardware with parameterized quantum circuits.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/20 space-y-1.5">
            <h3 className="font-bold text-violet-300">Fermionic Mappings</h3>
            <p className="text-slate-400 text-[11px]">
              Jordan-Wigner and Bravyi-Kitaev transformations encoding second-quantized molecular Hamiltonians into Pauli operators.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/20 space-y-1.5">
            <h3 className="font-bold text-violet-300">QAOA Conformation</h3>
            <p className="text-slate-400 text-[11px]">
              Quantum Approximate Optimization Algorithm for discrete ligand-protein pocket conformational sampling.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('quantum')}
          className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
        >
          <Cpu className="w-4 h-4" />
          <span>Explore Quantum Architecture Specification</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* Section 4: Key Scientific Citations */}
      <section className="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono-code font-semibold uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-teal-400" />
          <span>Selected Academic References</span>
        </div>
        <h2 className="text-base font-bold text-white font-display">
          Key Literature & Computational Foundations
        </h2>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <strong className="text-white block font-medium">
              1. Lipinski, C. A., et al. (2001).
            </strong>
            <span className="text-slate-400 text-[11px]">
              "Experimental and computational approaches to estimate solubility and permeability in drug discovery and development settings." <em>Advanced Drug Delivery Reviews</em>, 46(1-3), 3-26.
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <strong className="text-white block font-medium">
              2. Bickerton, G. R., et al. (2012).
            </strong>
            <span className="text-slate-400 text-[11px]">
              "Quantifying the chemical beauty of drugs." <em>Nature Chemistry</em>, 4(2), 90-98.
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <strong className="text-white block font-medium">
              3. Peruzzo, A., et al. (2014).
            </strong>
            <span className="text-slate-400 text-[11px]">
              "A variational eigenvalue solver on a photonic quantum processor." <em>Nature Communications</em>, 5, 4213.
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <strong className="text-white block font-medium">
              4. Cao, Y., et al. (2019).
            </strong>
            <span className="text-slate-400 text-[11px]">
              "Quantum Chemistry in the Age of Quantum Computing." <em>Chemical Reviews</em>, 119(19), 10856-10915.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
