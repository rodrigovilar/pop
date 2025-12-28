/**
 * Calculate market regime based on price change vs previous month
 *
 * @param currentMonthPrice - Entry price of current month
 * @param previousMonthPrice - Entry price of previous month (null if first month)
 * @param threshold - Threshold for bull/bear classification (default 0.10 = 10%)
 * @returns Market regime: BULL, BEAR, LATERAL, or N/A
 */
export function calculateRegime(
  currentMonthPrice: number,
  previousMonthPrice: number | null,
  threshold = 0.10
): 'BULL' | 'BEAR' | 'LATERAL' | 'N/A' {
  if (previousMonthPrice === null) {
    return 'N/A';
  }

  const pctChange = (currentMonthPrice - previousMonthPrice) / previousMonthPrice;

  if (pctChange >= threshold) {
    return 'BULL';
  }

  if (pctChange <= -threshold) {
    return 'BEAR';
  }

  return 'LATERAL';
}
