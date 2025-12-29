/**
 * CryptoCompare API client for fetching historical Bitcoin prices
 *
 * Docs: https://min-api.cryptocompare.com/documentation
 */

export interface PricePoint {
  timestamp: number;  // Unix timestamp in milliseconds
  price: number;
}

export interface DailyPrice {
  date: string;  // YYYY-MM-DD
  price: number;
}

interface CryptoCompareHistoryResponse {
  Response: string;
  Message?: string;
  Data: {
    Data: Array<{
      time: number;        // Unix timestamp in seconds
      close: number;       // Closing price
      high: number;
      low: number;
      open: number;
      volumefrom: number;
      volumeto: number;
    }>;
  };
}

/**
 * Fetch historical Bitcoin price data from CryptoCompare
 *
 * @param currency - Currency code (uppercase, e.g., 'USD', 'EUR', 'BRL')
 * @param limit - Number of days to fetch (max 2000 per request)
 * @param toTimestamp - End timestamp in seconds (optional, defaults to now)
 * @param apiKey - Optional CryptoCompare API key
 * @returns Array of price points [timestamp, price]
 */
export async function fetchBitcoinHistory(
  currency: string,
  limit: number = 2000,
  toTimestamp?: number,
  apiKey?: string
): Promise<PricePoint[]> {
  const baseUrl = 'https://min-api.cryptocompare.com/data/v2/histoday';

  const params = new URLSearchParams({
    fsym: 'BTC',
    tsym: currency.toUpperCase(),
    limit: Math.min(limit, 2000).toString(), // Max 2000 per request
  });

  if (toTimestamp) {
    params.append('toTs', toTimestamp.toString());
  }

  if (apiKey) {
    params.append('api_key', apiKey);
  }

  const url = `${baseUrl}?${params}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`CryptoCompare API error: ${response.status} ${response.statusText}`);
  }

  const data: CryptoCompareHistoryResponse = await response.json();

  if (data.Response === 'Error') {
    throw new Error(`CryptoCompare API error: ${data.Message || 'Unknown error'}`);
  }

  if (!data.Data || !data.Data.Data || !Array.isArray(data.Data.Data)) {
    throw new Error('Invalid response format from CryptoCompare API');
  }

  return data.Data.Data
    .filter(d => d.close > 0) // Filter out days with no price data
    .map(d => ({
      timestamp: d.time * 1000, // Convert seconds to milliseconds
      price: d.close,
    }));
}

/**
 * Fetch ALL historical Bitcoin data for a currency (since 2010)
 * Makes multiple requests if needed (2000 days per request)
 *
 * @param currency - Currency code (e.g., 'USD', 'EUR', 'BRL')
 * @param apiKey - Optional CryptoCompare API key
 * @returns Array of all price points
 */
export async function fetchAllBitcoinHistory(
  currency: string,
  apiKey?: string
): Promise<PricePoint[]> {
  const allData: PricePoint[] = [];
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  const batchSize = 2000;
  let toTimestamp = now;
  let hasMoreData = true;

  console.log(`  Fetching all historical data for ${currency}...`);

  while (hasMoreData) {
    const batch = await fetchBitcoinHistory(currency, batchSize, toTimestamp, apiKey);

    if (batch.length === 0) {
      break;
    }

    // Add to beginning since we're going backwards in time
    allData.unshift(...batch);

    // Check if we got less than batch size (means we reached the beginning)
    if (batch.length < batchSize) {
      hasMoreData = false;
    } else {
      // Set next toTimestamp to the oldest timestamp from this batch minus 1 day
      const oldestTimestamp = Math.min(...batch.map(p => p.timestamp));
      toTimestamp = Math.floor(oldestTimestamp / 1000) - 86400; // Go back 1 day

      // Stop if we've reached 2010 (Bitcoin's early days)
      const year2010 = new Date('2010-01-01').getTime() / 1000;
      if (toTimestamp < year2010) {
        hasMoreData = false;
      }

      // Small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log(`  Received total of ${allData.length} data points`);
  return allData;
}

/**
 * Convert price points to daily prices in YYYY-MM-DD format
 *
 * @param pricePoints - Array of price points with timestamps
 * @returns Array of daily prices
 */
export function convertToDailyPrices(pricePoints: PricePoint[]): DailyPrice[] {
  return pricePoints.map(point => {
    const date = new Date(point.timestamp);
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    return { date: dateStr, price: point.price };
  });
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
