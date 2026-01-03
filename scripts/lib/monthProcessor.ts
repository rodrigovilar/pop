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
  daysPositive: number;    // Days when price > entry price
  daysNegative: number;    // Days when price < entry price
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

  // Count positive and negative days (excluding entry day)
  let daysPositive = 0;
  let daysNegative = 0;

  for (let i = 1; i < sorted.length; i++) {
    const price = sorted[i].price;

    if (price > entryPrice) {
      daysPositive++;
    } else if (price < entryPrice) {
      daysNegative++;
    }
    // If price === entryPrice, don't count as positive or negative
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
