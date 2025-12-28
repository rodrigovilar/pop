/**
 * Progressive Data Loader
 *
 * Implements progressive loading strategy:
 * 1. Manifest
 * 2. Current month
 * 3. Previous month
 * 4. Last 12 months
 * 5. Remaining months (background)
 *
 * Features:
 * - Cache-first approach
 * - Concurrent loading (max 3-5 parallel)
 * - Progressive UI updates via callbacks
 * - Automatic cache management
 */

import type { Manifest, MonthlyData, Currency } from '../types';
import { cacheManager } from './cacheManager';

export interface LoadingProgress {
  phase: 'manifest' | 'current' | 'previous' | 'recent' | 'remaining';
  loaded: number;
  total: number;
  percentage: number;
}

export interface LoaderOptions {
  currency: Currency;
  maxConcurrent?: number;
  onProgress?: (progress: LoadingProgress) => void;
  baseUrl?: string;
}

export class DataLoader {
  private currency: Currency;
  private maxConcurrent: number;
  private onProgress?: (progress: LoadingProgress) => void;
  private baseUrl: string;

  constructor(options: LoaderOptions) {
    this.currency = options.currency;
    this.maxConcurrent = options.maxConcurrent || 3;
    this.onProgress = options.onProgress;
    this.baseUrl = options.baseUrl || '/data';
  }

  /**
   * Load manifest file
   */
  async loadManifest(): Promise<Manifest> {
    const cacheKey = 'manifest';

    // Try cache first
    const cached = cacheManager.get<Manifest>(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch from network
    const response = await fetch(`${this.baseUrl}/manifest.v1.json`);
    if (!response.ok) {
      throw new Error('Failed to load manifest');
    }

    const manifest: Manifest = await response.json();

    // Cache it
    cacheManager.set(cacheKey, manifest);

    return manifest;
  }

  /**
   * Load a single month's data
   */
  async loadMonth(month: string, currency: Currency): Promise<MonthlyData> {
    const cacheKey = `data:${currency}:${month}`;

    // Try cache first
    const cached = cacheManager.get<MonthlyData>(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch from network
    const response = await fetch(`${this.baseUrl}/monthly/${currency}/${month}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load ${month} for ${currency}`);
    }

    const data: MonthlyData = await response.json();

    // Cache it
    cacheManager.set(cacheKey, data);

    return data;
  }

  /**
   * Load multiple months concurrently
   */
  async loadMonths(months: string[], currency: Currency): Promise<MonthlyData[]> {
    const results: MonthlyData[] = [];

    // Load in batches to respect maxConcurrent
    for (let i = 0; i < months.length; i += this.maxConcurrent) {
      const batch = months.slice(i, i + this.maxConcurrent);
      const batchResults = await Promise.all(
        batch.map(month => this.loadMonth(month, currency))
      );
      results.push(...batchResults);
    }

    return results;
  }

  /**
   * Progressive loading strategy
   */
  async loadAll(): Promise<{
    manifest: Manifest;
    monthlyData: Map<string, MonthlyData>;
  }> {
    const monthlyData = new Map<string, MonthlyData>();

    // Phase 1: Load manifest
    this.reportProgress('manifest', 0, 1);
    const manifest = await this.loadManifest();
    this.reportProgress('manifest', 1, 1);

    const availableMonths = manifest.monthsAvailable;
    if (availableMonths.length === 0) {
      return { manifest, monthlyData };
    }

    // Get current month (last available)
    const currentMonth = availableMonths[availableMonths.length - 1];

    // Phase 2: Load current month
    this.reportProgress('current', 0, 1);
    const currentData = await this.loadMonth(currentMonth, this.currency);
    monthlyData.set(currentMonth, currentData);
    this.reportProgress('current', 1, 1);

    // Phase 3: Load previous month (if exists)
    if (availableMonths.length > 1) {
      const previousMonth = availableMonths[availableMonths.length - 2];
      this.reportProgress('previous', 0, 1);
      const previousData = await this.loadMonth(previousMonth, this.currency);
      monthlyData.set(previousMonth, previousData);
      this.reportProgress('previous', 1, 1);
    }

    // Phase 4: Load recent 12 months (excluding current and previous already loaded)
    const recentMonths = availableMonths.slice(-12).filter(
      m => m !== currentMonth && m !== availableMonths[availableMonths.length - 2]
    );

    if (recentMonths.length > 0) {
      this.reportProgress('recent', 0, recentMonths.length);
      for (let i = 0; i < recentMonths.length; i++) {
        const data = await this.loadMonth(recentMonths[i], this.currency);
        monthlyData.set(recentMonths[i], data);
        this.reportProgress('recent', i + 1, recentMonths.length);
      }
    }

    // Phase 5: Load remaining months in background
    const loadedMonths = new Set([currentMonth, availableMonths[availableMonths.length - 2], ...recentMonths]);
    const remainingMonths = availableMonths.filter(m => !loadedMonths.has(m));

    if (remainingMonths.length > 0) {
      // Load in background (don't await)
      this.loadRemainingInBackground(remainingMonths, monthlyData);
    }

    return { manifest, monthlyData };
  }

  /**
   * Load remaining months in background
   */
  private async loadRemainingInBackground(
    months: string[],
    monthlyData: Map<string, MonthlyData>
  ): Promise<void> {
    this.reportProgress('remaining', 0, months.length);

    for (let i = 0; i < months.length; i++) {
      try {
        const data = await this.loadMonth(months[i], this.currency);
        monthlyData.set(months[i], data);
        this.reportProgress('remaining', i + 1, months.length);
      } catch (error) {
        console.error(`Failed to load ${months[i]} in background:`, error);
      }
    }
  }

  /**
   * Report loading progress
   */
  private reportProgress(
    phase: LoadingProgress['phase'],
    loaded: number,
    total: number
  ): void {
    if (this.onProgress) {
      this.onProgress({
        phase,
        loaded,
        total,
        percentage: total > 0 ? (loaded / total) * 100 : 0,
      });
    }
  }

  /**
   * Prefetch data for a different currency
   */
  async prefetchCurrency(currency: Currency, months: string[]): Promise<void> {
    // Load in background without blocking
    for (const month of months) {
      try {
        await this.loadMonth(month, currency);
      } catch (error) {
        console.error(`Failed to prefetch ${month} for ${currency}:`, error);
      }
    }
  }

  /**
   * Clear cache for current currency
   */
  clearCache(): void {
    cacheManager.clear();
  }
}
