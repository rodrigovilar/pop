/**
 * React hook for progressive data loading
 */

import { useState, useEffect, useCallback } from 'react';
import { DataLoader, type LoadingProgress } from '../lib/dataLoader';
import type { Manifest, MonthlyData, Currency } from '../types';

interface UseDataOptions {
  currency: Currency;
  autoLoad?: boolean;
}

interface UseDataResult {
  manifest: Manifest | null;
  monthlyData: Map<string, MonthlyData>;
  isLoading: boolean;
  progress: LoadingProgress | null;
  error: Error | null;
  reload: () => Promise<void>;
}

export function useData(options: UseDataOptions): UseDataResult {
  const { currency, autoLoad = true } = options;

  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [monthlyData, setMonthlyData] = useState<Map<string, MonthlyData>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<LoadingProgress | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const loader = new DataLoader({
        currency,
        onProgress: (p) => setProgress(p),
      });

      const result = await loader.loadAll();

      setManifest(result.manifest);
      setMonthlyData(result.monthlyData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
      setProgress(null);
    }
  }, [currency]);

  useEffect(() => {
    if (autoLoad) {
      load();
    }
  }, [autoLoad, load]);

  return {
    manifest,
    monthlyData,
    isLoading,
    progress,
    error,
    reload: load,
  };
}
