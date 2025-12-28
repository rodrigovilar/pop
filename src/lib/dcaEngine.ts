/**
 * DCA (Dollar-Cost Averaging) Simulation Engine
 *
 * Simulates monthly Bitcoin purchases and tracks:
 * - Total invested and BTC accumulated
 * - Current value and P&L
 * - Days in drawdown (below cost basis)
 * - Longest negative streak
 */

export interface DailyPrice {
  date: string;   // YYYY-MM-DD
  price: number;
}

export interface DCAResult {
  totalInvested: number;
  totalBTC: number;
  currentValue: number;
  currentPnL: number;
  currentPnLPercent: number;
  daysInDrawdown: number;
  longestNegativeStreak: number;
}

interface Purchase {
  date: string;
  amount: number;
  price: number;
  btcAmount: number;
}

/**
 * Simulate DCA strategy
 *
 * @param dailyPrices - Historical daily prices (sorted by date)
 * @param startDate - Start date for simulation (YYYY-MM-DD)
 * @param monthlyAmount - Monthly purchase amount in fiat currency
 * @returns Simulation results
 */
export function simulateDCA(
  dailyPrices: DailyPrice[],
  startDate: string,
  monthlyAmount: number
): DCAResult {
  // Validation
  if (dailyPrices.length === 0) {
    throw new Error('Daily prices cannot be empty');
  }

  if (monthlyAmount <= 0) {
    throw new Error('Monthly amount must be positive');
  }

  // Sort prices by date
  const sorted = [...dailyPrices].sort((a, b) => a.date.localeCompare(b.date));

  // Find actual start date (first date >= startDate)
  const actualStartDate = sorted.find(p => p.date >= startDate)?.date || sorted[0].date;

  // Track purchases
  const purchases: Purchase[] = [];
  let totalInvested = 0;
  let totalBTC = 0;

  // Group prices by month
  const pricesByMonth = new Map<string, DailyPrice[]>();
  for (const price of sorted) {
    const month = price.date.substring(0, 7); // YYYY-MM
    if (!pricesByMonth.has(month)) {
      pricesByMonth.set(month, []);
    }
    pricesByMonth.get(month)!.push(price);
  }

  // Determine which months to purchase in
  const startMonth = actualStartDate.substring(0, 7);
  const monthsToPurchase: string[] = [];

  // Add start month
  if (pricesByMonth.has(startMonth)) {
    monthsToPurchase.push(startMonth);
  }

  // Add subsequent months
  // Parse start date to get year and month
  const [startYear, startMonthNum] = actualStartDate.split('-').map(Number);
  const [endYear, endMonthNum] = sorted[sorted.length - 1].date.split('-').map(Number);

  let year = startYear;
  let monthNum = startMonthNum + 1; // Next month

  while (year < endYear || (year === endYear && monthNum <= endMonthNum)) {
    if (monthNum > 12) {
      monthNum = 1;
      year++;
    }

    const month = `${year}-${String(monthNum).padStart(2, '0')}`;
    if (pricesByMonth.has(month) && !monthsToPurchase.includes(month)) {
      monthsToPurchase.push(month);
    }

    monthNum++;
  }

  // Execute purchases (first available day of each month)
  for (const month of monthsToPurchase.sort()) {
    const monthPrices = pricesByMonth.get(month)!;

    // For start month, use actual start date
    let purchaseDate: DailyPrice;
    if (month === startMonth) {
      purchaseDate = monthPrices.find(p => p.date >= actualStartDate)!;
    } else {
      // For subsequent months, use first available day
      purchaseDate = monthPrices[0];
    }

    const btcAmount = monthlyAmount / purchaseDate.price;

    purchases.push({
      date: purchaseDate.date,
      amount: monthlyAmount,
      price: purchaseDate.price,
      btcAmount,
    });

    totalInvested += monthlyAmount;
    totalBTC += btcAmount;
  }

  // Calculate current value (at last available price)
  const currentPrice = sorted[sorted.length - 1].price;
  const currentValue = totalBTC * currentPrice;
  const currentPnL = currentValue - totalInvested;
  const currentPnLPercent = (currentPnL / totalInvested) * 100;

  // Track drawdown
  let daysInDrawdown = 0;
  let currentStreak = 0;
  let longestNegativeStreak = 0;

  // Start tracking after first purchase
  const firstPurchaseIndex = sorted.findIndex(p => p.date >= actualStartDate);

  for (let i = firstPurchaseIndex + 1; i < sorted.length; i++) {
    const price = sorted[i].price;

    // Check if below cost basis at this point in time
    // Recalculate cost basis up to this date
    let investedSoFar = 0;
    let btcSoFar = 0;

    for (const purchase of purchases) {
      if (purchase.date <= sorted[i].date) {
        investedSoFar += purchase.amount;
        btcSoFar += purchase.btcAmount;
      }
    }

    if (btcSoFar > 0) {
      const valueAtThisTime = btcSoFar * price;

      if (valueAtThisTime < investedSoFar) {
        daysInDrawdown++;
        currentStreak++;
        longestNegativeStreak = Math.max(longestNegativeStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
  }

  return {
    totalInvested,
    totalBTC,
    currentValue,
    currentPnL,
    currentPnLPercent,
    daysInDrawdown,
    longestNegativeStreak,
  };
}

/**
 * Calculate average cost basis
 */
export function calculateCostBasis(totalInvested: number, totalBTC: number): number {
  if (totalBTC === 0) {
    throw new Error('Cannot calculate cost basis with zero BTC');
  }
  return totalInvested / totalBTC;
}
