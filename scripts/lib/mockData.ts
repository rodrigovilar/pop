/**
 * Mock Bitcoin price data for development and testing
 *
 * Generates realistic-looking historical price data for testing purposes.
 * This is NOT real historical data.
 */

import type { PricePoint } from './cryptoCompareClient';

/**
 * Generate mock Bitcoin price data
 *
 * Creates a price series starting from 2020-01-01 with:
 * - Bull runs
 * - Bear markets
 * - Lateral movements
 * - Realistic volatility
 *
 * @param startDate - Start date (YYYY-MM-DD)
 * @param endDate - End date (YYYY-MM-DD)
 * @param basePrice - Starting price (default 7000)
 * @returns Array of mock price points
 */
export function generateMockBitcoinData(
  startDate: string = '2020-01-01',
  endDate: string = new Date().toISOString().split('T')[0],
  basePrice: number = 7000
): PricePoint[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const pricePoints: PricePoint[] = [];

  let currentPrice = basePrice;
  // eslint-disable-next-line prefer-const -- Date object is mutated, not reassigned
  let currentDate = new Date(start);

  // Simulate different market phases
  const phases = [
    { duration: 120, trend: 0.02, volatility: 0.05 },  // Bull run
    { duration: 90, trend: -0.015, volatility: 0.04 }, // Bear market
    { duration: 60, trend: 0.001, volatility: 0.02 },  // Lateral
    { duration: 150, trend: 0.025, volatility: 0.06 }, // Strong bull
    { duration: 120, trend: -0.02, volatility: 0.05 }, // Bear
    { duration: 90, trend: 0.005, volatility: 0.03 },  // Recovery
    { duration: 180, trend: 0.015, volatility: 0.04 }, // Steady growth
  ];

  let phaseIndex = 0;
  let daysInPhase = 0;

  while (currentDate <= end) {
    // Get current phase
    const phase = phases[phaseIndex % phases.length];

    // Calculate daily change
    const trendChange = phase.trend;
    const randomChange = (Math.random() - 0.5) * 2 * phase.volatility;
    const totalChange = trendChange + randomChange;

    // Update price
    currentPrice = currentPrice * (1 + totalChange);

    // Ensure price doesn't go negative
    currentPrice = Math.max(currentPrice, 1000);

    // Add price point
    pricePoints.push({
      timestamp: currentDate.getTime(),
      price: Math.round(currentPrice * 100) / 100, // Round to 2 decimals
    });

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
    daysInPhase++;

    // Move to next phase
    if (daysInPhase >= phase.duration) {
      phaseIndex++;
      daysInPhase = 0;
    }
  }

  return pricePoints;
}

/**
 * Get mock data for a specific currency
 *
 * Applies currency multiplier to base USD data
 */
export function getMockDataForCurrency(
  currency: string,
  startDate?: string,
  endDate?: string
): PricePoint[] {
  // Currency multipliers (approximate)
  const multipliers: Record<string, number> = {
    usd: 1,
    eur: 0.92,
    brl: 5.0,
    gbp: 0.79,
    jpy: 149.0,
    chf: 0.88,
    cad: 1.35,
    aud: 1.52,
    nzd: 1.65,
    cny: 7.24,
    hkd: 7.82,
    sgd: 1.34,
    inr: 83.0,
    krw: 1320.0,
    mxn: 17.0,
    ars: 350.0,
    zar: 18.5,
    try: 32.0,
    sek: 10.5,
    nok: 10.8,
  };

  const multiplier = multipliers[currency.toLowerCase()] || 1;
  const baseData = generateMockBitcoinData(startDate, endDate);

  return baseData.map(point => ({
    ...point,
    price: point.price * multiplier,
  }));
}
