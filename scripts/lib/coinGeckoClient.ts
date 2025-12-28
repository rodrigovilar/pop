/**
 * CoinGecko API client for fetching historical Bitcoin prices
 *
 * Docs: https://docs.coingecko.com/reference/coins-id-market-chart
 */

export interface CoinGeckoPricePoint {
  timestamp: number;  // Unix timestamp in milliseconds
  price: number;
}

export interface DailyPrice {
  date: string;  // YYYY-MM-DD
  price: number;
}

/**
 * Fetch historical Bitcoin price data from CoinGecko
 *
 * @param currency - Currency code (lowercase, e.g., 'usd', 'eur', 'brl')
 * @param days - Number of days of historical data ('max' for all available)
 * @param apiKey - Optional CoinGecko API key (required for some plans)
 * @returns Array of price points [timestamp, price]
 */
export async function fetchBitcoinHistory(
  currency: string,
  days: number | 'max' = 'max',
  apiKey?: string
): Promise<CoinGeckoPricePoint[]> {
  const url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=${currency.toLowerCase()}&days=${days}&interval=daily`;

  const headers: HeadersInit = apiKey
    ? { 'x-cg-demo-api-key': apiKey }
    : {};

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.prices || !Array.isArray(data.prices)) {
    throw new Error('Invalid response format from CoinGecko API');
  }

  return data.prices.map(([timestamp, price]: [number, number]) => ({
    timestamp,
    price,
  }));
}

/**
 * Convert price points to daily prices in YYYY-MM-DD format
 *
 * Groups prices by date (UTC) and uses the last seen price of each day.
 *
 * @param pricePoints - Array of price points with timestamps
 * @returns Array of daily prices
 */
export function convertToDailyPrices(pricePoints: CoinGeckoPricePoint[]): DailyPrice[] {
  const dailyMap = new Map<string, number>();

  for (const point of pricePoints) {
    const date = new Date(point.timestamp);
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD

    // Use last seen price for each day
    dailyMap.set(dateStr, point.price);
  }

  // Convert to array and sort by date
  return Array.from(dailyMap.entries())
    .map(([date, price]) => ({ date, price }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Group daily prices by month (YYYY-MM)
 *
 * @param dailyPrices - Array of daily prices
 * @returns Map of month -> daily prices
 */
export function groupByMonth(dailyPrices: DailyPrice[]): Map<string, DailyPrice[]> {
  const monthlyMap = new Map<string, DailyPrice[]>();

  for (const daily of dailyPrices) {
    const month = daily.date.substring(0, 7); // YYYY-MM

    if (!monthlyMap.has(month)) {
      monthlyMap.set(month, []);
    }

    monthlyMap.get(month)!.push(daily);
  }

  return monthlyMap;
}
