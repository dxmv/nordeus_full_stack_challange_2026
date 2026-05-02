import { createContext, useState } from "react";
import type { ReactNode } from "react";
import type { RunConfig } from "../types";

interface RunConfigContextValue {
  config: RunConfig | null;
  loading: boolean;
  error: string | null;
  fetchConfig: () => Promise<boolean>;
  restoreConfig: (config: RunConfig) => void;
}

export const RunConfigContext = createContext<RunConfigContextValue | null>(null);

export function RunConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<RunConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3000/api/run-config");
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data: RunConfig = await res.json();
      setConfig(data);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load run config");
      return false;
    } finally {
      setLoading(false);
    }
  }

  const restoreConfig = (config: RunConfig): void => setConfig(config);

  return (
    <RunConfigContext.Provider value={{ config, loading, error, fetchConfig, restoreConfig }}>
      {children}
    </RunConfigContext.Provider>
  );
}


