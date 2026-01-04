import { describe, it, expect } from 'vitest';
import { processMonth } from '../../scripts/lib/monthProcessor';

/**
 * TDD: Month Processor Tests
 *
 * Processes daily price data for a single month and calculates:
 * - Entry date (first available day of month)
 * - Entry price
 * - Days positive (Bull days: price > +10% vs entry)
 * - Days negative (Bear days: price < -10% vs entry)
 * - Days total
 * - Days lateral are NOT counted in positive/negative (between -10% and +10%)
 */

describe('Month Processor', () => {
  it('should extract entry date as first day of month', () => {
    const dailyPrices = [
      { date: '2024-01-01', price: 42000 },
      { date: '2024-01-02', price: 43000 },
      { date: '2024-01-03', price: 44000 },
    ];

    const result = processMonth(dailyPrices, '2024-01');
    expect(result.entryDate).toBe('2024-01-01');
    expect(result.entryPrice).toBe(42000);
  });

  it('should extract exit date as last day of month', () => {
    const dailyPrices = [
      { date: '2024-01-01', price: 42000 },
      { date: '2024-01-02', price: 43000 },
      { date: '2024-01-03', price: 44000 },
    ];

    const result = processMonth(dailyPrices, '2024-01');
    expect(result.exitDate).toBe('2024-01-03');
    expect(result.exitPrice).toBe(44000);
  });

  it('should calculate percentage change within month correctly', () => {
    const dailyPrices = [
      { date: '2024-01-01', price: 40000 }, // entry
      { date: '2024-01-02', price: 41000 },
      { date: '2024-01-03', price: 42000 }, // exit (+5%)
    ];

    const result = processMonth(dailyPrices, '2024-01');
    expect(result.pctChangeWithinMonth).toBeCloseTo(5.0, 1);
  });

  it('should handle negative percentage change within month', () => {
    const dailyPrices = [
      { date: '2024-01-01', price: 50000 }, // entry
      { date: '2024-01-02', price: 48000 },
      { date: '2024-01-03', price: 45000 }, // exit (-10%)
    ];

    const result = processMonth(dailyPrices, '2024-01');
    expect(result.pctChangeWithinMonth).toBeCloseTo(-10.0, 1);
  });

  it('should count days positive correctly', () => {
    const dailyPrices = [
      { date: '2024-01-01', price: 40000 }, // entry
      { date: '2024-01-02', price: 41000 }, // +2.5% - lateral (not bull)
      { date: '2024-01-03', price: 44500 }, // +11.25% - bull
      { date: '2024-01-04', price: 45000 }, // +12.5% - bull
    ];

    const result = processMonth(dailyPrices, '2024-01');
    expect(result.daysPositive).toBe(2); // Only days > +10%
  });

  it('should count days negative correctly', () => {
    const dailyPrices = [
      { date: '2024-01-01', price: 40000 }, // entry
      { date: '2024-01-02', price: 41000 }, // +2.5% - lateral (not bear)
      { date: '2024-01-03', price: 35500 }, // -11.25% - bear
      { date: '2024-01-04', price: 35000 }, // -12.5% - bear
    ];

    const result = processMonth(dailyPrices, '2024-01');
    expect(result.daysNegative).toBe(2); // Only days < -10%
  });

  it('should not count entry day in positive/negative', () => {
    const dailyPrices = [
      { date: '2024-01-01', price: 40000 }, // entry - not counted
      { date: '2024-01-02', price: 44500 }, // +11.25% - bull
    ];

    const result = processMonth(dailyPrices, '2024-01');
    expect(result.daysPositive).toBe(1);
    expect(result.daysNegative).toBe(0);
    expect(result.daysTotal).toBe(2);
  });

  it('should handle month with only entry day', () => {
    const dailyPrices = [
      { date: '2024-01-01', price: 40000 },
    ];

    const result = processMonth(dailyPrices, '2024-01');
    expect(result.daysPositive).toBe(0);
    expect(result.daysNegative).toBe(0);
    expect(result.daysTotal).toBe(1);
  });

  it('should handle days at exactly entry price as neither positive nor negative', () => {
    const dailyPrices = [
      { date: '2024-01-01', price: 40000 }, // entry
      { date: '2024-01-02', price: 40000 }, // same - not counted
      { date: '2024-01-03', price: 44500 }, // +11.25% - bull
    ];

    const result = processMonth(dailyPrices, '2024-01');
    expect(result.daysPositive).toBe(1);
    expect(result.daysNegative).toBe(0);
  });

  it('should calculate total days correctly', () => {
    const dailyPrices = [
      { date: '2024-01-01', price: 40000 },
      { date: '2024-01-02', price: 41000 },
      { date: '2024-01-03', price: 39000 },
      { date: '2024-01-04', price: 42000 },
      { date: '2024-01-05', price: 38000 },
    ];

    const result = processMonth(dailyPrices, '2024-01');
    expect(result.daysTotal).toBe(5);
  });

  it('should handle realistic Bitcoin price data', () => {
    const dailyPrices = [
      { date: '2024-03-01', price: 61234.56 },
      { date: '2024-03-02', price: 67500.00 }, // +10.23% - bull
      { date: '2024-03-03', price: 55000.00 }, // -10.18% - bear
      { date: '2024-03-04', price: 68000.00 }, // +11.05% - bull
      { date: '2024-03-05', price: 61234.56 }, // same as entry - lateral
      { date: '2024-03-06', price: 54500.00 }, // -11.0% - bear
    ];

    const result = processMonth(dailyPrices, '2024-03');
    expect(result.entryDate).toBe('2024-03-01');
    expect(result.entryPrice).toBe(61234.56);
    expect(result.daysPositive).toBe(2); // 03-02, 03-04
    expect(result.daysNegative).toBe(2); // 03-03, 03-06
    expect(result.daysTotal).toBe(6);
  });
});
