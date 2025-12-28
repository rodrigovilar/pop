/**
 * Types for data generation scripts
 */

export interface CoinGeckoDailyPrice {
  date: string;      // YYYY-MM-DD
  price: number;
}

export interface DailyPriceData {
  date: string;      // YYYY-MM-DD
  price: number;
  change: number;    // Percentage change from entry
}

export interface MonthProcessingResult {
  month: string;           // YYYY-MM
  currency: string;
  entryDate: string;       // YYYY-MM-DD
  entryPrice: number;
  daysPositive: number;
  daysNegative: number;
  daysTotal: number;
  pctChangeVsPrevMonthStart: number | null;
  regime: 'BULL' | 'BEAR' | 'LATERAL' | 'N/A';
}
