/**
 * Core type definitions for PoP (Proof of Patience)
 */

export type Currency =
  | 'USD' | 'EUR' | 'BRL' | 'GBP' | 'JPY'
  | 'CHF' | 'CAD' | 'AUD' | 'NZD'
  | 'HKD' | 'SGD'
  | 'INR' | 'KRW'
  | 'MXN' | 'ARS'
  | 'ZAR' | 'TRY';

export type Regime = 'BULL' | 'BEAR' | 'LATERAL' | 'N/A';

export type Language =
  | 'en' | 'pt-BR' | 'es' | 'fr' | 'de' | 'it' | 'nl'
  | 'fi' | 'pl' | 'cs' | 'tr'
  | 'ja' | 'ko' | 'hi';

/**
 * Monthly data shard schema
 */
export interface MonthlyData {
  month: string;           // YYYY-MM
  currency: Currency;
  entryDate: string;       // YYYY-MM-DD (first available day of month)
  entryPrice: number;
  exitDate?: string;       // YYYY-MM-DD (last available day of month) - optional for backwards compatibility
  exitPrice?: number;      // optional for backwards compatibility
  pctChangeWithinMonth?: number;  // % change from entry to exit price - optional for backwards compatibility
  daysPositive: number;
  daysNegative: number;
  daysTotal: number;
  pctChangeVsPrevMonthStart: number | null;
  regime: Regime;
}

/**
 * Manifest file schema
 */
export interface Manifest {
  version: string;         // e.g., "v1"
  asset: string;           // "BTC"
  monthsAvailable: string[];  // ["2013-04", "2013-05", ...]
  currencies: Currency[];
  rules: {
    dailyPrice: string;    // "last_seen_price_utc"
    entry: string;         // "first_available_day_of_month"
    regimeThreshold: number;  // 0.10
  };
  generatedAt: string;     // ISO timestamp
}

/**
 * DCA Simulation input
 */
export interface DCASimulationInput {
  startDate: string;       // YYYY-MM-DD
  monthlyAmount: number;
  currency: Currency;
}

/**
 * DCA Simulation result
 */
export interface DCASimulationResult {
  totalInvested: number;
  totalBTC: number;
  currentValue: number;
  currentPnL: number;
  currentPnLPercent: number;
  daysInDrawdown: number;
  longestNegativeStreak: number;
  participatedInKeyDays: {
    top10: number;
    top50: number;
    top100: number;
  };
}

/**
 * LocalStorage cache entry
 */
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

/**
 * User settings
 */
export interface UserSettings {
  locale: Language;
  currency: Currency;
}
