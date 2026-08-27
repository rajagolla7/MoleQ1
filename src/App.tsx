import React, { useState, useEffect } from 'react';
import { PageView, MoleculeCandidate, Experiment } from './types/molecule';
import { INITIAL_CANDIDATES, INITIAL_EXPERIMENTS } from './data/mockData';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ScientificDisclaimer, ScientificFooter } from './components/layout/ScientificDisclaimer';

// Pages
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Design } from './pages/Design';
import { Analysis } from './pages/Analysis';
import { Candidates } from './pages/Candidates';
import { MoleculeDetails } from './pages/MoleculeDetails';
import { Compare } from './pages/Compare';
import { Experiments } from './pages/Experiments';
import { Research } from './pages/Research';
import { QuantumArchitecture } from './pages/QuantumArchitecture';
import { Settings } from './pages/Settings';

export function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<PageView>('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Application Name State
  const [appName, setAppName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('qmd_app_name');
      if (!saved || saved === 'MolQuantum AI' || saved === 'Quantum-AI Molecule Design') {
        localStorage.setItem('qmd_app_name', 'MoleQ');
        return 'MoleQ';
      }
      return saved.trim() || 'MoleQ';
    } catch {
      return 'MoleQ';
    }
  });

  // Display Theme State: 'dark' or 'bright' (light)
  const [theme, setTheme] = useState<'dark' | 'bright'>(() => {
    try {
      const saved = localStorage.getItem('qmd_theme');
      if (saved === 'dark' || saved === 'bright') return saved;
      // Default to dark mode for scientific space
      return 'dark';
    } catch {
      return 'dark';
    }
  });

  // Synchronize document theme class and title
  useEffect(() => {
    try {
      localStorage.setItem('qmd_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('bright');
      } else {
        document.documentElement.classList.add('bright');
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  // Synchronize app name and title
  useEffect(() => {
    try {
      localStorage.setItem('qmd_app_name', appName);
      document.title = `${appName} | De Novo Molecular Discovery & Quantum Design Studio`;
    } catch (e) {
      console.error(e);
    }
  }, [appName]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'bright' : 'dark'));
  };

  const handleSetTheme = (newTheme: 'dark' | 'bright') => {
    setTheme(newTheme);
  };

  const handleUpdateAppName = (name: string) => {
    if (name.trim()) {
      setAppName(name.trim());
    }
  };

  // Core Data State (persisted in localStorage for seamless reload)
  const [candidates, setCandidates] = useState<MoleculeCandidate[]>(() => {
    try {
      const saved = localStorage.getItem('qmd_candidates');
      return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
    } catch {
      return INITIAL_CANDIDATES;
    }
  });

  const [experiments, setExperiments] = useState<Experiment[]>(() => {
    try {
      const saved = localStorage.getItem('qmd_experiments');
      return saved ? JSON.parse(saved) : INITIAL_EXPERIMENTS;
    } catch {
      return INITIAL_EXPERIMENTS;
    }
  });

  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    INITIAL_CANDIDATES[0]?.id || 'QMD-EGFR-001'
  );
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([
    INITIAL_CANDIDATES[0]?.id || 'QMD-EGFR-001',
    INITIAL_CANDIDATES[1]?.id || 'QMD-DRD2-014',
  ]);
  const [analysisSmiles, setAnalysisSmiles] = useState<string>('CCO');

  // Sync data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('qmd_candidates', JSON.stringify(candidates));
    } catch (e) {
      console.error(e);
    }
  }, [candidates]);

  useEffect(() => {
    try {
      localStorage.setItem('qmd_experiments', JSON.stringify(experiments));
    } catch (e) {
      console.error(e);
    }
  }, [experiments]);

  // Handlers
  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCandidate = (id: string) => {
    setSelectedCandidateId(id);
  };

  const handleToggleSave = (id: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isSaved: !c.isSaved } : c))
    );
  };

  const handleToggleCompare = (id: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleAddCandidateToCompare = (id: string) => {
    if (!selectedForCompare.includes(id)) {
      setSelectedForCompare((prev) => [...prev, id]);
    }
  };

  const handleRemoveCandidateFromCompare = (id: string) => {
    setSelectedForCompare((prev) => prev.filter((item) => item !== id));
  };

  const handleCandidatesGenerated = (newCandidates: MoleculeCandidate[]) => {
    if (newCandidates.length === 0) return;

    // Merge candidates
    setCandidates((prev) => [...newCandidates, ...prev]);

    // Create experiment log
    const firstCand = newCandidates[0];
    const newExp: Experiment = {
      id: `EXP-2026-${String(experiments.length + 1).padStart(3, '0')}`,
      name: `${firstCand.target} Generative Campaign`,
      disease: firstCand.disease || 'Cancer',
      date: new Date().toISOString().split('T')[0],
      target: firstCand.target,
      candidateCount: newCandidates.length,
      validCandidateCount: newCandidates.filter((c) => c.isValid).length,
      modelVersion: 'QMD-Classical-cVAE v2.4',
      bestCandidateId: firstCand.id,
      bestCandidateName: firstCand.name,
      bestScore: firstCand.overallScore,
      status: 'Completed',
      parameters: {
        disease: (firstCand.disease as any) || 'Cancer',
        target: firstCand.target as any,
        mwMin: 250,
        mwMax: 500,
        logPMin: 1.0,
        logPMax: 4.5,
        tpsaMin: 40,
        tpsaMax: 120,
        maxHbd: 4,
        maxHba: 8,
        maxRotatableBonds: 7,
        desiredSolubility: 'High',
        toxicityPreference: 'Very Low',
        candidateCount: 10,
      },
      candidates: newCandidates,
      notes: `De novo candidate batch generation with multi-parameter ADMET optimization.`,
    };

    setExperiments((prev) => [newExp, ...prev]);
    setSelectedCandidateId(firstCand.id);
    setSelectedForCompare(newCandidates.slice(0, 2).map((c) => c.id));
  };

  const handleOpenExperiment = (id: string) => {
    const exp = experiments.find((e) => e.id === id);
    if (exp) {
      if (exp.bestCandidateId) {
        setSelectedCandidateId(exp.bestCandidateId);
      }
      handleNavigate('candidates');
    }
  };

  const handleDeleteExperiment = (id: string) => {
    setExperiments((prev) => prev.filter((e) => e.id !== id));
  };

  const handleDuplicateExperiment = (id: string) => {
    const exp = experiments.find((e) => e.id === id);
    if (exp) {
      const dupExp: Experiment = {
        ...exp,
        id: `EXP-2026-${String(experiments.length + 1).padStart(3, '0')}`,
        name: `${exp.name} (Copy)`,
        date: new Date().toISOString().split('T')[0],
      };
      setExperiments((prev) => [dupExp, ...prev]);
    }
  };

  const handleResetWorkspace = () => {
    setCandidates(INITIAL_CANDIDATES);
    setExperiments(INITIAL_EXPERIMENTS);
    setSelectedCandidateId(INITIAL_CANDIDATES[0].id);
    setSelectedForCompare([INITIAL_CANDIDATES[0].id, INITIAL_CANDIDATES[1].id]);
    localStorage.removeItem('qmd_candidates');
    localStorage.removeItem('qmd_experiments');
  };

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0] || null;
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDark 
        ? 'bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-slate-950' 
        : 'bg-slate-50 text-slate-900 selection:bg-teal-600 selection:text-white'
    }`}>
      {/* Top Scientific Disclaimer Alert Bar */}
      <ScientificDisclaimer theme={theme} />

      {/* Main Top Navigation Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        compareCount={selectedForCompare.length}
        appName={appName}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Layout Area: Sidebar and Content side-by-side */}
      <div className="flex-1 flex flex-row w-full min-h-0 relative">
        {/* Sidebar for Desktop & Mobile Drawer */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentPage={currentPage}
          onNavigate={(page) => {
            handleNavigate(page);
            setSidebarOpen(false);
          }}
          candidateCount={candidates.length}
          experimentCount={experiments.length}
          compareCount={selectedForCompare.length}
          appName={appName}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* Main Content Router */}
        <main className="flex-1 min-w-0 w-full relative z-10 overflow-x-hidden">
          {currentPage === 'landing' && (
            <Landing
              onNavigate={handleNavigate}
              onSelectCandidate={(id) => {
                setSelectedCandidateId(id);
                handleNavigate('details');
              }}
              appName={appName}
              theme={theme}
            />
          )}

          {currentPage === 'dashboard' && (
            <Dashboard
              onNavigate={handleNavigate}
              experiments={experiments}
              candidates={candidates}
              onSelectCandidate={handleSelectCandidate}
              onOpenExperiment={handleOpenExperiment}
            />
          )}

          {currentPage === 'design' && (
            <Design
              onNavigate={handleNavigate}
              onCandidatesGenerated={handleCandidatesGenerated}
            />
          )}

          {currentPage === 'analysis' && (
            <Analysis
              initialSmiles={analysisSmiles}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'candidates' && (
            <Candidates
              candidates={candidates}
              onNavigate={handleNavigate}
              onSelectCandidate={handleSelectCandidate}
              selectedForCompare={selectedForCompare}
              onToggleCompare={handleToggleCompare}
              onToggleSave={handleToggleSave}
            />
          )}

          {currentPage === 'details' && (
            <MoleculeDetails
              candidate={selectedCandidate}
              onNavigate={handleNavigate}
              onToggleCompare={handleToggleCompare}
              onToggleSave={handleToggleSave}
              isCompared={selectedCandidate ? selectedForCompare.includes(selectedCandidate.id) : false}
            />
          )}

          {currentPage === 'compare' && (
            <Compare
              candidates={candidates}
              selectedIds={selectedForCompare}
              onRemoveFromCompare={handleRemoveCandidateFromCompare}
              onAddCandidate={handleAddCandidateToCompare}
              onSelectCandidate={handleSelectCandidate}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'experiments' && (
            <Experiments
              experiments={experiments}
              onOpenExperiment={handleOpenExperiment}
              onDeleteExperiment={handleDeleteExperiment}
              onDuplicateExperiment={handleDuplicateExperiment}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'research' && (
            <Research onNavigate={handleNavigate} />
          )}

          {currentPage === 'quantum' && (
            <QuantumArchitecture onNavigate={handleNavigate} />
          )}

          {currentPage === 'settings' && (
            <Settings
              onNavigate={handleNavigate}
              onResetWorkspace={handleResetWorkspace}
              appName={appName}
              onUpdateAppName={handleUpdateAppName}
              theme={theme}
              onToggleTheme={handleToggleTheme}
              onSetTheme={handleSetTheme}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <ScientificFooter 
        onNavigate={handleNavigate}
        theme={theme}
        appName={appName}
      />
    </div>
  );
}
export default App;
