import React, { useState } from 'react';
import { PageView } from '../../types/molecule';
import {
  Menu,
  Atom,
  Search,
  Sparkles,
  Server,
  Layers,
  ArrowRight,
  Sun,
  Moon,
} from 'lucide-react';
import { BackendHealthStatus } from '../../services/api';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onToggleSidebar?: () => void;
  onQuickSearchSmiles?: (smiles: string) => void;
  healthStatus?: BackendHealthStatus;
  selectedCandidateCount?: number;
  compareCount?: number;
  appName?: string;
  theme?: 'dark' | 'bright';
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onToggleSidebar,
  onQuickSearchSmiles,
  healthStatus,
  selectedCandidateCount = 0,
  compareCount = 0,
  appName = 'MolQuantum AI',
  theme = 'dark',
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickSmiles, setQuickSmiles] = useState('');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSmiles.trim()) {
      if (onQuickSearchSmiles) {
        onQuickSearchSmiles(quickSmiles.trim());
      }
      onNavigate('analysis');
      setQuickSmiles('');
    }
  };

  const navLinks: { id: PageView; label: string }[] = [
    { id: 'landing', label: 'Home' },
    { id: 'dashboard', label: 'Workspace' },
    { id: 'design', label: 'Design' },
    { id: 'analysis', label: 'Analysis' },
    { id: 'candidates', label: 'Candidates' },
    { id: 'compare', label: 'Compare' },
    { id: 'experiments', label: 'Experiments' },
    { id: 'quantum', label: 'Quantum' },
    { id: 'research', label: 'Methodology' },
    { id: 'settings', label: 'Settings' },
  ];

  const isDark = theme === 'dark';

  return (
    <header
      id="main-app-navbar"
      className={`sticky top-0 z-30 w-full border-b backdrop-blur-xl shrink-0 transition-colors duration-200 ${
        isDark
          ? 'bg-slate-950/90 border-slate-800/80 text-slate-100'
          : 'bg-white/90 border-slate-200 text-slate-800 shadow-xs'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Mobile & Toggle Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Sidebar / Menu Toggle */}
          <button
            id="mobile-nav-toggle-btn"
            type="button"
            onClick={() => {
              if (onToggleSidebar) {
                onToggleSidebar();
              } else {
                setMobileMenuOpen(!mobileMenuOpen);
              }
            }}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-900'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.25)] group-hover:scale-105 transition-transform">
              <Atom className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className={`font-bold font-display text-sm sm:text-base tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {appName}
              </span>
              <span className="text-[9px] font-mono-code text-teal-500 font-semibold tracking-wider uppercase mt-0.5">
                Molecular AI
              </span>
            </div>
          </div>

          {/* Current Environment Indicator */}
          <div className={`hidden md:flex items-center gap-2 text-xs ml-2 pl-3 border-l ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Environment:</span>
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono-code text-[11px] border ${
              isDark 
                ? 'bg-slate-900 border-slate-800 text-teal-300' 
                : 'bg-teal-50 border-teal-200 text-teal-700'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              Classical GenAI
            </span>
          </div>
        </div>

        {/* Quick SMILES Search Input */}
        <div className="flex-1 max-w-md hidden sm:block mx-2">
          <form onSubmit={handleQuickSubmit} className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
            <input
              id="navbar-smiles-search-input"
              type="text"
              value={quickSmiles}
              onChange={(e) => setQuickSmiles(e.target.value)}
              placeholder="Quick SMILES analyze (e.g. CCO, COc1cc...)"
              className={`w-full pl-9 pr-20 py-1.5 rounded-xl text-xs font-mono-code focus:outline-none transition shadow-inner border ${
                isDark
                  ? 'bg-slate-900/90 border-slate-800 focus:border-teal-500/50 text-slate-200 placeholder:text-slate-500 focus:ring-1 focus:ring-teal-500/30'
                  : 'bg-slate-50 border-slate-300 focus:border-teal-600 text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-teal-500/20'
              }`}
            />
            <button
              type="submit"
              className={`absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-lg text-[10px] font-semibold transition border flex items-center gap-1 cursor-pointer ${
                isDark
                  ? 'bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border-teal-500/30'
                  : 'bg-teal-600 hover:bg-teal-700 text-white border-transparent'
              }`}
            >
              Analyze <ArrowRight className="w-2.5 h-2.5" />
            </button>
          </form>
        </div>

        {/* Top Right Controls & Health Indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark / Bright Mode Toggle Button */}
          {onToggleTheme && (
            <button
              id="navbar-theme-toggle-btn"
              type="button"
              onClick={onToggleTheme}
              title={`Switch to ${isDark ? 'Bright (Light)' : 'Dark'} Mode`}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer border ${
                isDark
                  ? 'bg-slate-900/90 border-slate-800 text-amber-300 hover:bg-slate-800 hover:border-amber-400/40 shadow-xs'
                  : 'bg-slate-100 border-slate-300 text-indigo-700 hover:bg-slate-200 hover:border-indigo-400 shadow-xs'
              }`}
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                  <span className="hidden md:inline text-[11px] font-semibold text-slate-200">Bright</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span className="hidden md:inline text-[11px] font-semibold text-slate-700">Dark</span>
                </>
              )}
            </button>
          )}

          {/* Compare Badge Shortcut if selected */}
          {(selectedCandidateCount > 0 || compareCount > 0) && (
            <button
              id="navbar-compare-pill-btn"
              type="button"
              onClick={() => onNavigate('compare')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                isDark
                  ? 'bg-teal-500/20 border-teal-500/40 text-teal-300 hover:bg-teal-500/30'
                  : 'bg-teal-50 border-teal-300 text-teal-700 hover:bg-teal-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Compare ({selectedCandidateCount || compareCount})</span>
            </button>
          )}

          {/* Quick Design CTA */}
          <button
            id="navbar-start-design-btn"
            type="button"
            onClick={() => onNavigate('design')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-400 hover:to-sky-500 text-slate-950 font-bold text-xs transition shadow-[0_0_15px_rgba(20,184,166,0.3)] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Leads</span>
          </button>

          {/* Backend Status */}
          <div
            title={healthStatus?.message || 'Simulation Engine Active'}
            onClick={() => onNavigate('settings')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs cursor-pointer transition border ${
              isDark
                ? 'bg-slate-900/80 border-slate-800/80 hover:border-teal-500/40 text-slate-300'
                : 'bg-slate-100 border-slate-200 hover:border-teal-400 text-slate-700'
            }`}
          >
            <Server className={`w-3.5 h-3.5 ${healthStatus?.isAvailable ? 'text-emerald-500' : 'text-teal-500'}`} />
            <span className="hidden lg:inline text-[11px] font-mono-code">
              {healthStatus?.isAvailable ? 'FastAPI Connected' : 'Sim Engine'}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (if standalone) */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer-menu"
          className={`md:hidden border-b px-4 py-4 space-y-3 backdrop-blur-2xl animate-in slide-in-from-top-2 ${
            isDark ? 'bg-slate-950/95 border-slate-800' : 'bg-white/95 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-700/40">
            <span className="text-xs font-semibold text-slate-400">Display Theme:</span>
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                  isDark ? 'bg-slate-800 text-amber-300' : 'bg-slate-200 text-indigo-700'
                }`}
              >
                {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
                <span>{isDark ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}</span>
              </button>
            )}
          </div>

          <form onSubmit={handleQuickSubmit} className="mb-2">
            <input
              type="text"
              value={quickSmiles}
              onChange={(e) => setQuickSmiles(e.target.value)}
              placeholder="Paste SMILES to analyze..."
              className={`w-full px-3 py-2 rounded-lg text-xs font-mono-code border ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            />
          </form>

          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                  currentPage === link.id
                    ? isDark
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                      : 'bg-teal-50 text-teal-800 border border-teal-300 font-semibold'
                    : isDark
                    ? 'text-slate-300 hover:bg-slate-900'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
