#!/usr/bin/env tsx

/**
 * Data Generation Script
 *
 * Fetches historical Bitcoin data from CoinGecko and generates:
 * - Monthly JSON shards per currency
 * - Manifest file with metadata
 *
 * Usage:
 *   npm run generate:data
 *   tsx scripts/generateData.ts
 *   tsx scripts/generateData.ts --currency=USD --test
 */

import 'dotenv/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fetchAllBitcoinHistory, convertToDailyPrices, groupByMonth } from './lib/cryptoCompareClient';
import { getMockDataForCurrency } from './lib/mockData';
import { processMonth } from './lib/monthProcessor';
import { calculateRegime } from './lib/regimeCalculator';
import type { MonthlyData, Manifest, Currency } from '../src/types';

const CURRENCIES: Currency[] = [
  'USD', 'EUR', 'BRL', 'GBP', 'JPY',
  'CHF', 'CAD', 'AUD', 'NZD',
  'CNY', 'HKD', 'SGD',
  'INR', 'KRW',
  'MXN', 'ARS',
  'ZAR', 'TRY',
  'SEK', 'NOK',
];

const REGIME_THRESHOLD = 0.10; // 10%
const DATA_DIR = path.join(process.cwd(), 'public', 'data');
const MONTHLY_DIR = path.join(DATA_DIR, 'monthly');

interface GenerationOptions {
  currencies?: Currency[];
  testMode?: boolean;
  useMockData?: boolean;
  apiKey?: string;
}

/**
 * Generate monthly data shards for a currency
 */
async function generateCurrencyData(currency: Currency, options: GenerationOptions = {}) {
  console.log(`\n📊 Generating data for ${currency}...`);

  // Fetch historical data
  let pricePoints;
  if (options.useMockData) {
    console.log(`  Using mock data...`);
    pricePoints = getMockDataForCurrency(currency.toLowerCase());
  } else {
    console.log(`  Fetching from CryptoCompare...`);
    pricePoints = await fetchAllBitcoinHistory(currency, options.apiKey);
  }
  console.log(`  Received ${pricePoints.length} data points`);

  // Convert to daily prices
  const dailyPrices = convertToDailyPrices(pricePoints);
  console.log(`  Converted to ${dailyPrices.length} daily prices`);

  // Group by month
  const monthlyGroups = groupByMonth(dailyPrices);
  console.log(`  Grouped into ${monthlyGroups.size} months`);

  // Process each month
  const monthlyData: MonthlyData[] = [];
  const months = Array.from(monthlyGroups.keys()).sort();

  for (let i = 0; i < months.length; i++) {
    const month = months[i];
    const prices = monthlyGroups.get(month)!;

    // Process month
    const result = processMonth(prices, month);

    // Calculate regime
    const previousMonthEntry = i > 0 ? monthlyData[i - 1].entryPrice : null;
    const regime = calculateRegime(result.entryPrice, previousMonthEntry, REGIME_THRESHOLD);

    // Calculate percentage change
    const pctChange = previousMonthEntry !== null
      ? ((result.entryPrice - previousMonthEntry) / previousMonthEntry) * 100
      : null;

    const data: MonthlyData = {
      month: result.month,
      currency,
      entryDate: result.entryDate,
      entryPrice: result.entryPrice,
      exitDate: result.exitDate,
      exitPrice: result.exitPrice,
      pctChangeWithinMonth: result.pctChangeWithinMonth,
      daysPositive: result.daysPositive,
      daysNegative: result.daysNegative,
      daysTotal: result.daysTotal,
      pctChangeVsPrevMonthStart: pctChange,
      regime,
    };

    monthlyData.push(data);
  }

  // Create currency directory
  const currencyDir = path.join(MONTHLY_DIR, currency);
  await fs.mkdir(currencyDir, { recursive: true });

  // Write monthly shards
  console.log(`  Writing ${monthlyData.length} monthly files...`);
  for (const data of monthlyData) {
    const filename = `${data.month}.json`;
    const filepath = path.join(currencyDir, filename);
    await fs.writeFile(filepath, JSON.stringify(data, null, 2));
  }

  console.log(`✅ Completed ${currency}: ${monthlyData.length} months`);

  return {
    currency,
    months: months,
    totalMonths: monthlyData.length,
  };
}

/**
 * Generate manifest file
 */
async function generateManifest(currencies: Currency[], allMonths: Set<string>) {
  console.log(`\n📝 Generating manifest...`);

  const manifest: Manifest = {
    version: 'v1',
    asset: 'BTC',
    monthsAvailable: Array.from(allMonths).sort(),
    currencies,
    rules: {
      dailyPrice: 'last_seen_price_utc',
      entry: 'first_available_day_of_month',
      regimeThreshold: REGIME_THRESHOLD,
    },
    generatedAt: new Date().toISOString(),
  };

  const manifestPath = path.join(DATA_DIR, 'manifest.v1.json');
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`✅ Manifest written to ${manifestPath}`);
  console.log(`   ${manifest.monthsAvailable.length} months available`);
  console.log(`   ${manifest.currencies.length} currencies`);
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const options: GenerationOptions = {
    testMode: args.includes('--test'),
    useMockData: args.includes('--mock'),
    apiKey: process.env.CRYPTOCOMPARE_API_KEY, // Optional, works without key
  };

  // Parse currency argument
  const currencyArg = args.find(arg => arg.startsWith('--currency='));
  if (currencyArg) {
    const currency = currencyArg.split('=')[1] as Currency;
    options.currencies = [currency];
  }

  const currencies = options.currencies || (options.testMode ? ['USD'] : CURRENCIES);

  console.log('🚀 PoP Data Generation Script');
  console.log(`📅 Mode: ${options.testMode ? 'TEST (USD only)' : 'FULL'}`);
  console.log(`💱 Currencies: ${currencies.join(', ')}`);
  console.log(`📊 Data source: ${options.useMockData ? 'MOCK' : 'CryptoCompare API (FREE)'}`);
  if (options.apiKey) {
    console.log(`🔑 API Key: LOADED (${options.apiKey.substring(0, 10)}...)`);
  }

  try {
    // Create directories
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(MONTHLY_DIR, { recursive: true });

    // Generate data for each currency
    const results = [];
    const allMonths = new Set<string>();

    for (const currency of currencies) {
      try {
        const result = await generateCurrencyData(currency, options);
        results.push(result);
        result.months.forEach(m => allMonths.add(m));

        // Rate limiting: wait 1 second between currencies
        if (currencies.length > 1) {
          console.log('  ⏳ Waiting 1s (rate limiting)...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`❌ Error processing ${currency}:`, error);
      }
    }

    // Generate manifest
    await generateManifest(currencies, allMonths);

    console.log('\n✨ Data generation complete!');
    console.log(`📊 Summary:`);
    results.forEach(r => {
      console.log(`   ${r.currency}: ${r.totalMonths} months`);
    });

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateCurrencyData, generateManifest };
