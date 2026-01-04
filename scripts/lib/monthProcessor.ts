/**
 * Process daily price data for a single month
 */

export interface DailyPrice {
  date: string;   // YYYY-MM-DD
  price: number;
}

export interface MonthResult {
  month: string;           // YYYY-MM
  entryDate: string;       // YYYY-MM-DD (first day of month)
  entryPrice: number;
  exitDate: string;        // YYYY-MM-DD (last day of month)
  exitPrice: number;
  pctChangeWithinMonth: number;  // % change from entry to exit price
  daysPositive: number;    // Days when price > +10% vs entry price (Bull days)
  daysNegative: number;    // Days when price < -10% vs entry price (Bear days)
  daysTotal: number;       // Total days in month
}

/**
 * Process a month of daily prices
 *
 * @param dailyPrices - Array of daily prices for the month
 * @param month - Month identifier (YYYY-MM)
 * @returns Monthly processing result
 */
export function processMonth(
  dailyPrices: DailyPrice[],
  month: string
): MonthResult {
  if (dailyPrices.length === 0) {
    throw new Error(`No price data for month ${month}`);
  }

  // Sort by date to ensure correct order
  const sorted = [...dailyPrices].sort((a, b) => a.date.localeCompare(b.date));

  // Entry is first day of month
  const entryDate = sorted[0].date;
  const entryPrice = sorted[0].price;

  // Exit is last day of month
  const exitDate = sorted[sorted.length - 1].date;
  const exitPrice = sorted[sorted.length - 1].price;

  // Calculate percentage change within month
  const pctChangeWithinMonth = ((exitPrice - entryPrice) / entryPrice) * 100;

  // Count bull/bear/lateral days (excluding entry day)
  // Bull: > +10% vs entry, Bear: < -10% vs entry, Lateral: between -10% and +10%
  const THRESHOLD = 0.10; // 10%
  let daysPositive = 0; // Bull days
  let daysNegative = 0; // Bear days

  for (let i = 1; i < sorted.length; i++) {
    const price = sorted[i].price;
    const pctChange = (price - entryPrice) / entryPrice;

    if (pctChange >= THRESHOLD) {
      daysPositive++;
    } else if (pctChange <= -THRESHOLD) {
      daysNegative++;
    }
    // If between -10% and +10%, it's a lateral day (not counted in positive/negative)
  }

  return {
    month,
    entryDate,
    entryPrice,
    exitDate,
    exitPrice,
    pctChangeWithinMonth,
    daysPositive,
    daysNegative,
    daysTotal: sorted.length,
  };
}
