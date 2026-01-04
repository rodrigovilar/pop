/**
 * Calculate market regime based on price change within the month
 *
 * @param entryPrice - Entry price (first day of month)
 * @param exitPrice - Exit price (last day of month), null if not available
 * @param threshold - Threshold for bull/bear classification (default 0.10 = 10%)
 * @returns Market regime: BULL, BEAR, LATERAL, or N/A
 */
export function calculateRegime(
  entryPrice: number,
  exitPrice: number | null,
  threshold = 0.10
): 'BULL' | 'BEAR' | 'LATERAL' | 'N/A' {
  if (exitPrice === null) {
    return 'N/A';
  }

  const pctChange = (exitPrice - entryPrice) / entryPrice;

  if (pctChange >= threshold) {
    return 'BULL';
  }

  if (pctChange <= -threshold) {
    return 'BEAR';
  }

  return 'LATERAL';
}
