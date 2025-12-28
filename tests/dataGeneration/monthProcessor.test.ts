import { describe, it, expect } from 'vitest';
import { processMonth } from '../../scripts/lib/monthProcessor';

/**
 * TDD: Month Processor Tests
 *
 * Processes daily price data for a single month and calculates:
 * - Entry date (first available day of month)
 * - Entry price
 * - Days positive (price > entry)
 * - Days negative (price < entry)
 * - Days total
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

  it('should count days positive correctly', () => {
    const dailyPrices = [
      { date: '2024-01-01', price: 40000 }, // entry
      { date: '2024-01-02', price: 41000 }, // positive
      { date: '2024-01-03', price: 42000 }, // positive
      { date: '2024-01-04', price: 39000 }, // negative
    ];

    const result = processMonth(dailyPrices, '2024-01');
    expect(result.daysPositive).toBe(2);
  });

  it('should count days negative correctly', () => {
    const dailyPrices = [
      { date: '2024-01-01', price: 40000 }, // entry
      { date: '2024-01-02', price: 41000 }, // positive
      { date: '2024-01-03', price: 39000 }, // negative
      { date: '2024-01-04', price: 38000 }, // negative
    ];

    const result = processMonth(dailyPrices, '2024-01');
    expect(result.daysNegative).toBe(2);
  });

  it('should not count entry day in positive/negative', () => {
    const dailyPrices = [
      { date: '2024-01-01', price: 40000 }, // entry - not counted
      { date: '2024-01-02', price: 41000 }, // positive
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
      { date: '2024-01-03', price: 41000 }, // positive
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
      { date: '2024-03-02', price: 62100.00 },
      { date: '2024-03-03', price: 60500.00 },
      { date: '2024-03-04', price: 63000.00 },
      { date: '2024-03-05', price: 61234.56 }, // same as entry
      { date: '2024-03-06', price: 59800.00 },
    ];

    const result = processMonth(dailyPrices, '2024-03');
    expect(result.entryDate).toBe('2024-03-01');
    expect(result.entryPrice).toBe(61234.56);
    expect(result.daysPositive).toBe(2); // 03-02, 03-04
    expect(result.daysNegative).toBe(2); // 03-03, 03-06
    expect(result.daysTotal).toBe(6);
  });
});
