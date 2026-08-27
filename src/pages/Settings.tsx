import React, { useState } from 'react';
import { PageView } from '../types/molecule';
import { apiClient } from '../services/api';
import {
  Server,
  Cpu,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Sun,
  Moon,
  Type,
  Palette,
  Check,
} from 'lucide-react';

interface SettingsProps {
  onNavigate: (page: PageView) => void;
  onResetWorkspace: () => void;
  appName: string;
  onUpdateAppName: (name: string) => void;
  theme: 'dark' | 'bright';
  onToggleTheme: () => void;
  onSetTheme: (theme: 'dark' | 'bright') => void;
}

export const Settings: React.FC<SettingsProps> = ({
  onResetWorkspace,
  appName,
  onUpdateAppName,
  theme,
  onSetTheme,
}) => {
  const isDark = theme === 'dark';

  // App Name editing state
  const [customNameInput, setCustomNameInput] = useState(appName);
  const [nameSavedSuccess, setNameSavedSuccess] = useState(false);

  // Backend state
  const [backendUrl, setBackendUrl] = useState(apiClient.getBaseUrl());
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Scoring Weights state
  const [affinityWeight, setAffinityWeight] = useState(40);
  const [admetWeight, setAdmetWeight] = useState(35);
  const [synthWeight, setSynthWeight] = useState(25);

  const namePresets = [
    'MolQuantum AI',
    'NovaChem Studio',
    'QuantumMol Discovery',
    'Cheminformatics AI',
  ];

  const handleSaveAppName = (e: React.FormEvent) => {
    e.preventDefault();
    if (customNameInput.trim()) {
      onUpdateAppName(customNameInput.trim());
      setNameSavedSuccess(true);
      setTimeout(() => setNameSavedSuccess(false), 2500);
    }
  };

  const handleSelectPresetName = (name: string) => {
    setCustomNameInput(name);
    onUpdateAppName(name);
    setNameSavedSuccess(true);
    setTimeout(() => setNameSavedSuccess(false), 2500);
  };

  const handleTestConnection = async () => {
    setIsChecking(true);
    setConnectionStatus(null);
    try {
      const isOnline = await apiClient.checkHealth();
      setIsBackendConnected(isOnline);
      if (isOnline) {
        setConnectionStatus('Connected to FastAPI Python backend.');
      } else {
        setConnectionStatus('Backend unavailable. Platform running in client-side simulation mode.');
      }
    } catch {
      setIsBackendConnected(false);
      setConnectionStatus('Backend unavailable. Platform running in client-side simulation mode.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    apiClient.setBaseUrl(backendUrl);
    handleTestConnection();
  };

  return (
    <div id="settings-page" className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className={`border-b pb-6 ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <h1 className={`text-2xl sm:text-3xl font-extrabold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Platform Settings & Themes
          </h1>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono-code font-semibold ${
            isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
          }`}>
            v2.4
          </span>
        </div>
        <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Customize application identity, visual theme appearance (Dark &amp; Bright modes), computational runtime engines, and Pareto scoring weights.
        </p>
      </div>

      {/* Section 1: Appearance & Theme Mode */}
      <div className="glass-panel p-6 rounded-2xl space-y-5">
        <div className="flex items-center justify-between">
          <h2 className={`text-sm font-bold font-display flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Palette className="w-4 h-4 text-teal-500" />
            Display Appearance &amp; Color Theme
          </h2>
          <span className={`text-xs font-mono-code px-2 py-0.5 rounded ${
            isDark ? 'bg-slate-800 text-amber-300' : 'bg-amber-100 text-amber-800'
          }`}>
            Current: {isDark ? 'Dark Mode' : 'Bright (Light) Mode'}
          </span>
        </div>

        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Switch between dark cosmic laboratory mode and high-contrast bright mode for daylight analysis.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Dark Mode Card */}
          <button
            type="button"
            onClick={() => onSetTheme('dark')}
            className={`p-4 rounded-xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between h-36 ${
              isDark
                ? 'bg-slate-900 border-teal-500 shadow-[0_0_20px_rgba(20,184,166,0.2)]'
                : 'bg-slate-900/90 border-slate-700 hover:border-slate-500 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
                <Moon className="w-4 h-4 text-teal-400" />
                <span>Dark Mode</span>
              </div>
              {isDark && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold">
                  <Check className="w-3 h-3" /> Active
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Deep navy and cosmic slate canvas with luminescent quantum orbital grids and glowing molecular nodes.
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-950 border border-slate-700" />
              <span className="w-3 h-3 rounded-full bg-teal-500" />
              <span className="w-3 h-3 rounded-full bg-sky-500" />
              <span className="w-3 h-3 rounded-full bg-violet-500" />
            </div>
          </button>

          {/* Bright Mode Card */}
          <button
            type="button"
            onClick={() => onSetTheme('bright')}
            className={`p-4 rounded-xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between h-36 ${
              !isDark
                ? 'bg-white border-teal-600 shadow-md ring-2 ring-teal-500/20'
                : 'bg-slate-100 border-slate-300 hover:border-slate-400 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Bright Mode (Light)</span>
              </div>
              {!isDark && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                  <Check className="w-3 h-3" /> Active
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Clean white &amp; off-white scientific laboratory theme with high-contrast text and vivid descriptor charts.
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-white border border-slate-300" />
              <span className="w-3 h-3 rounded-full bg-teal-600" />
              <span className="w-3 h-3 rounded-full bg-sky-600" />
              <span className="w-3 h-3 rounded-full bg-slate-800" />
            </div>
          </button>
        </div>
      </div>

      {/* Section 2: Application Name & Brand Customization */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className={`text-sm font-bold font-display flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Type className="w-4 h-4 text-sky-500" />
          Application Name &amp; Workspace Branding
        </h2>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Rename your molecular discovery platform or select from scientific name presets:
        </p>

        {/* Preset Name Chips */}
        <div className="flex flex-wrap gap-2">
          {namePresets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleSelectPresetName(preset)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer border ${
                appName === preset
                  ? isDark
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 font-bold'
                    : 'bg-teal-100 text-teal-900 border-teal-400 font-bold'
                  : isDark
                  ? 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:border-slate-400'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Custom Name Form */}
        <form onSubmit={handleSaveAppName} className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="text"
            value={customNameInput}
            onChange={(e) => setCustomNameInput(e.target.value)}
            placeholder="Enter custom application name..."
            className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none transition border ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-white focus:border-teal-500'
                : 'bg-white border-slate-300 text-slate-900 focus:border-teal-600 shadow-xs'
            }`}
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-xs"
          >
            Apply Name
          </button>
        </form>

        {nameSavedSuccess && (
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Application name updated to <strong>&ldquo;{appName}&rdquo;</strong> across all navigation and headers.</span>
          </div>
        )}
      </div>

      {/* Section 3: Computational Engine */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className={`text-sm font-bold font-display flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Cpu className="w-4 h-4 text-teal-500" />
          Computational Engine Selection
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Classical Engine */}
          <div className={`p-4 rounded-xl border-2 space-y-2 relative ${
            isDark ? 'bg-teal-500/10 border-teal-500/40' : 'bg-teal-50/80 border-teal-300 text-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Classical AI Engine</span>
              <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                isDark ? 'bg-teal-500/20 text-teal-300' : 'bg-teal-200 text-teal-900'
              }`}>
                Active Engine
              </span>
            </div>
            <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Generative cVAE and Graph Neural Network descriptors. Client-side simulation running with realistic RDKit-compatible heuristics.
            </p>
          </div>

          {/* Quantum Engine (Phase 4) */}
          <div className={`p-4 rounded-xl border space-y-2 relative opacity-80 ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-bold text-sm ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Quantum Acceleration Module</span>
              <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                isDark ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-200 text-violet-900'
              }`}>
                Roadmap
              </span>
            </div>
            <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              VQE &amp; Hamiltonian qubit mapping via Qiskit / PennyLane QPU backend runtime.
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: Backend API Integration */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className={`text-sm font-bold font-display flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Server className="w-4 h-4 text-sky-500" />
          FastAPI Python Backend Connection (Optional)
        </h2>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Optionally connect this frontend to your local or remote Python FastAPI service providing real RDKit and PyTorch chemical models.
        </p>

        <form onSubmit={handleSaveUrl} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              placeholder="e.g. http://localhost:8000/api"
              className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-mono-code focus:outline-none transition border ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-white focus:border-teal-500'
                  : 'bg-white border-slate-300 text-slate-900 focus:border-teal-600 shadow-xs'
              }`}
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                }`}
              >
                Save Endpoint
              </button>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isChecking}
                className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                <span>{isChecking ? 'Checking...' : 'Test Connection'}</span>
              </button>
            </div>
          </div>

          {connectionStatus && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2.5 ${
                isBackendConnected
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`}
            >
              {isBackendConnected ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              )}
              <span>{connectionStatus}</span>
            </div>
          )}
        </form>
      </div>

      {/* Section 5: Scoring Objective Weights */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={`text-sm font-bold font-display flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Sliders className="w-4 h-4 text-emerald-500" />
            Pareto Multi-Objective Weights
          </h2>
          <span className="text-[11px] font-mono-code text-teal-500 font-bold">
            Total: {affinityWeight + admetWeight + synthWeight}%
          </span>
        </div>

        <div className="space-y-4 text-xs">
          {/* Target Affinity Weight */}
          <div className="space-y-1.5">
            <div className={`flex items-center justify-between ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span>Target Receptor Affinity (Kd) Weight</span>
              <span className={`font-mono-code font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{affinityWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={affinityWeight}
              onChange={(e) => setAffinityWeight(Number(e.target.value))}
              className="w-full accent-teal-500"
            />
          </div>

          {/* ADMET Weight */}
          <div className="space-y-1.5">
            <div className={`flex items-center justify-between ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span>ADMET &amp; Druglikeness Weight</span>
              <span className={`font-mono-code font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{admetWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={admetWeight}
              onChange={(e) => setAdmetWeight(Number(e.target.value))}
              className="w-full accent-sky-500"
            />
          </div>

          {/* Synthesizability Weight */}
          <div className="space-y-1.5">
            <div className={`flex items-center justify-between ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span>Synthetic Accessibility (SAScore) Weight</span>
              <span className={`font-mono-code font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{synthWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={synthWeight}
              onChange={(e) => setSynthWeight(Number(e.target.value))}
              className="w-full accent-violet-500"
            />
          </div>
        </div>
      </div>

      {/* Section 6: Data Management */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-sm font-bold font-display flex items-center gap-2 text-rose-400">
          <Trash2 className="w-4 h-4 text-rose-500" />
          Reset Workspace Data
        </h2>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Clears local candidate memory, experiment logs, and restores default baseline research leads.
        </p>

        <button
          type="button"
          onClick={onResetWorkspace}
          className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-400 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reset All Workspace Data to Defaults</span>
        </button>
      </div>
    </div>
  );
};
