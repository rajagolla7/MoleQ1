import React from 'react';
import { PageView } from '../../types/molecule';
import {
  Atom,
  LayoutDashboard,
  Sparkles,
  Search,
  ListFilter,
  Columns,
  History,
  Cpu,
  BookOpen,
  Settings,
  X,
  Zap,
  Sun,
  Moon,
} from 'lucide-react';

interface SidebarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  candidateCount?: number;
  experimentCount?: number;
  compareCount?: number;
  isOpen?: boolean;
  onClose?: () => void;
  appName?: string;
  theme?: 'dark' | 'bright';
  onToggleTheme?: () => void;
}

interface NavItem {
  id: PageView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
  section?: 'core' | 'analysis' | 'research' | 'system';
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  candidateCount = 0,
  experimentCount = 0,
  compareCount = 0,
  isOpen = false,
  onClose,
  appName = 'MolQuantum AI',
  theme = 'dark',
  onToggleTheme,
}) => {
  const isDark = theme === 'dark';

  const navItems: NavItem[] = [
    { id: 'landing', label: 'Platform Home', icon: Atom, section: 'core' },
    { id: 'dashboard', label: 'Design Workspace', icon: LayoutDashboard, section: 'core' },
    { id: 'design', label: 'De Novo Generator', icon: Sparkles, section: 'core' },
    { id: 'analysis', label: 'Molecule Analysis', icon: Search, section: 'analysis' },
    { id: 'candidates', label: 'Candidate Results', icon: ListFilter, badge: candidateCount, badgeColor: isDark ? 'bg-teal-500/20 text-teal-300 border-teal-500/30' : 'bg-teal-100 text-teal-800 border-teal-200', section: 'analysis' },
    { id: 'compare', label: 'Comparison Matrix', icon: Columns, badge: compareCount > 0 ? compareCount : undefined, badgeColor: isDark ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-100 text-amber-800 border-amber-200', section: 'analysis' },
    { id: 'experiments', label: 'Experiment History', icon: History, badge: experimentCount, badgeColor: isDark ? 'bg-sky-500/20 text-sky-300 border-sky-500/30' : 'bg-sky-100 text-sky-800 border-sky-200', section: 'analysis' },
    { id: 'quantum', label: 'Quantum Research', icon: Cpu, badge: 'Roadmap', badgeColor: isDark ? 'bg-violet-500/20 text-violet-300 border-violet-500/30' : 'bg-violet-100 text-violet-800 border-violet-200', section: 'research' },
    { id: 'research', label: 'Methodology & Papers', icon: BookOpen, section: 'research' },
    { id: 'settings', label: 'API & Settings', icon: Settings, section: 'system' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar */}
      <aside
        id="main-sidebar-navigation"
        className={`
          fixed md:sticky top-0 md:top-0 z-50 md:z-20
          w-64 h-screen md:h-auto md:min-h-full
          border-r flex flex-col justify-between p-4
          backdrop-blur-xl shrink-0
          transition-all duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isDark ? 'bg-slate-950/95 md:bg-slate-950/80 border-slate-800/80 text-slate-100' : 'bg-white/95 md:bg-white/85 border-slate-200 text-slate-800 shadow-sm'}
        `}
      >
        {/* Brand Header */}
        <div>
          <div className="flex items-center justify-between">
            <div
              onClick={() => {
                onNavigate('landing');
                if (onClose) onClose();
              }}
              className={`flex items-center gap-3 px-2 py-2.5 rounded-xl cursor-pointer transition group ${
                isDark ? 'hover:bg-slate-900/60' : 'hover:bg-slate-100'
              }`}
            >
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500/20 to-sky-500/20 border border-teal-500/40 text-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.2)] group-hover:scale-105 transition-transform">
                <Atom className="w-5 h-5 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
              </div>
              <div>
                <h1 className={`text-sm font-bold tracking-tight font-display flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {appName}
                </h1>
                <p className="text-[11px] text-teal-500 font-medium">De Novo Design</p>
              </div>
            </div>

            {/* Mobile Close Button */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className={`md:hidden p-1.5 rounded-lg ${
                  isDark ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Engine Status Indicators */}
          <div className={`mt-3 px-2.5 py-2 rounded-lg border space-y-1.5 ${
            isDark ? 'bg-slate-900/70 border-slate-800/80' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-[11px]">
              <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                Classical AI / ML
              </span>
              <span className="text-emerald-500 font-mono-code font-semibold text-[10px]">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <span className="w-2 h-2 rounded-full bg-violet-400" />
                Quantum Engine
              </span>
              <span className="text-violet-500 font-mono-code font-medium text-[10px]">COMING SOON</span>
            </div>
          </div>

          {/* Navigation List */}
          <nav className="mt-4 space-y-1 overflow-y-auto max-h-[calc(100vh-320px)] pr-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  id={`sidebar-nav-${item.id}`}
                  type="button"
                  onClick={() => {
                    onNavigate(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? isDark
                        ? 'bg-gradient-to-r from-teal-500/20 to-sky-500/10 text-teal-300 border border-teal-500/40 shadow-sm font-semibold'
                        : 'bg-teal-50 text-teal-800 border border-teal-300 shadow-xs font-bold'
                      : isDark
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? (isDark ? 'text-teal-400' : 'text-teal-600') : (isDark ? 'text-slate-400' : 'text-slate-500')}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono-code border ${
                        item.badgeColor || (isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile / Status Box & Theme Switcher */}
        <div className={`pt-3 border-t space-y-2.5 ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
          {/* Quick Theme Toggle in Sidebar */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition cursor-pointer ${
                isDark
                  ? 'bg-slate-900/90 border-slate-800 text-amber-300 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-200 text-indigo-700 hover:bg-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>
                  {isDark ? 'Bright Mode' : 'Dark Mode'}
                </span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono-code ${
                isDark ? 'bg-slate-800 text-amber-300' : 'bg-slate-200 text-indigo-800'
              }`}>
                {isDark ? 'Dark (Active)' : 'Bright (Active)'}
              </span>
            </button>
          )}

          <div className={`p-2.5 rounded-xl border text-xs ${
            isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className={`font-semibold text-[10px] uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Target Cache</span>
              <span className="text-[10px] font-mono-code text-teal-500 font-bold">4 Active</span>
            </div>
            <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>EGFR &bull; DRD2 &bull; BACE1 &bull; HDAC1</p>
            <div className={`mt-2 pt-1.5 border-t flex items-center justify-between text-[10px] ${
              isDark ? 'border-slate-800/60 text-slate-400' : 'border-slate-200 text-slate-500'
            }`}>
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500" /> Latency: ~12ms
              </span>
              <span className="font-mono-code text-teal-500 font-semibold text-[10px]">v2.4-Hybrid</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
