/**
 * Central API Client for Quantum-AI Molecule Design Platform
 * Designed to seamlessly connect to the FastAPI + RDKit backend
 * Default endpoint: http://127.0.0.1:8000/api/v1
 */

export const API_BASE_URL = 
  (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_API_BASE_URL) 
    ? (import.meta as any).env.VITE_API_BASE_URL 
    : 'http://127.0.0.1:8000/api/v1';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
  isMockFallback: boolean;
}

export interface BackendHealthStatus {
  isAvailable: boolean;
  version?: string;
  rdkitAvailable?: boolean;
  quantumSimulatorAvailable?: boolean;
  latencyMs?: number;
  message?: string;
}

export async function checkBackendHealth(): Promise<BackendHealthStatus> {
  const startTime = performance.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const latencyMs = Math.round(performance.now() - startTime);

    if (response.ok) {
      const data = await response.json();
      return {
        isAvailable: true,
        version: data.version || '1.0.0-rc',
        rdkitAvailable: data.rdkit ?? true,
        quantumSimulatorAvailable: data.quantum_sim ?? false,
        latencyMs,
        message: 'Connected to FastAPI Computational Core',
      };
    }
  } catch {
    // Graceful catch for disconnected local backend
  }

  return {
    isAvailable: false,
    version: 'Classical-AI-Client v1.0',
    rdkitAvailable: false,
    quantumSimulatorAvailable: false,
    latencyMs: 0,
    message: 'Backend server not detected. Operating in high-precision client simulation mode.',
  };
}

let currentBaseUrl = API_BASE_URL;

export const apiClient = {
  getBaseUrl: () => currentBaseUrl,
  setBaseUrl: (url: string) => {
    currentBaseUrl = url;
  },
  checkHealth: async () => {
    const res = await checkBackendHealth();
    return res.isAvailable;
  },
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return { data, error: null, status: res.status, isMockFallback: false };
    }

    return {
      data: null,
      error: `Server responded with status ${res.status}: ${res.statusText}`,
      status: res.status,
      isMockFallback: true,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Network failure';
    return {
      data: null,
      error: errorMsg,
      status: 0,
      isMockFallback: true,
    };
  }
}
