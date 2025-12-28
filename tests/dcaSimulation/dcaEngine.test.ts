import { describe, it, expect } from 'vitest';
import { simulateDCA } from '../../src/lib/dcaEngine';

/**
 * TDD: DCA Simulation Engine Tests
 *
 * The DCA engine simulates dollar-cost averaging Bitcoin purchases:
 * - Monthly purchases at entry price (first day of month)
 * - No selling, no rebalancing
 * - Tracks cost basis and drawdown periods
 * - Identifies participation in key appreciation days
 */

interface DailyPrice {
  date: string;
  price: number;
}

describe('DCA Simulation Engine', () => {
  describe('Basic calculations', () => {
    it('should calculate single purchase correctly', () => {
      const dailyPrices: DailyPrice[] = [
        { date: '2024-01-01', price: 40000 },
        { date: '2024-01-02', price: 41000 },
      ];

      const result = simulateDCA(dailyPrices, '2024-01-01', 1000);

      expect(result.totalInvested).toBe(1000);
      expect(result.totalBTC).toBe(0.025); // 1000 / 40000
      expect(result.currentValue).toBe(1025); // 0.025 * 41000
      expect(result.currentPnL).toBe(25);
      expect(result.currentPnLPercent).toBe(2.5);
    });

    it('should calculate two monthly purchases', () => {
      const dailyPrices: DailyPrice[] = [
        { date: '2024-01-01', price: 40000 },
        { date: '2024-01-15', price: 42000 },
        { date: '2024-02-01', price: 45000 },
        { date: '2024-02-15', price: 46000 },
      ];

      const result = simulateDCA(dailyPrices, '2024-01-01', 1000);

      // Jan: 1000 / 40000 = 0.025 BTC
      // Feb: 1000 / 45000 = 0.02222... BTC
      // Total: 0.04722... BTC
      expect(result.totalInvested).toBe(2000);
      expect(result.totalBTC).toBeCloseTo(0.04722, 4);
      expect(result.currentValue).toBeCloseTo(2172.22, 2); // 0.04722 * 46000
      expect(result.currentPnL).toBeCloseTo(172.22, 2);
      expect(result.currentPnLPercent).toBeCloseTo(8.61, 2);
    });

    it('should only purchase on first day of month', () => {
      const dailyPrices: DailyPrice[] = [
        { date: '2024-01-01', price: 40000 },
        { date: '2024-01-15', price: 50000 }, // Mid-month - no purchase
        { date: '2024-02-01', price: 45000 },
      ];

      const result = simulateDCA(dailyPrices, '2024-01-01', 1000);

      // Should only buy on 2024-01-01 and 2024-02-01
      expect(result.totalInvested).toBe(2000);
    });

    it('should handle start date mid-month', () => {
      const dailyPrices: DailyPrice[] = [
        { date: '2024-01-01', price: 40000 },
        { date: '2024-01-15', price: 42000 }, // Start here
        { date: '2024-02-01', price: 45000 },
      ];

      const result = simulateDCA(dailyPrices, '2024-01-15', 1000);

      // First purchase at start date, then monthly
      expect(result.totalInvested).toBe(2000);
      expect(result.totalBTC).toBeCloseTo(0.02380952 + 0.02222222, 6);
    });
  });

  describe('Drawdown tracking', () => {
    it('should track days in drawdown when price drops', () => {
      const dailyPrices: DailyPrice[] = [
        { date: '2024-01-01', price: 40000 }, // Buy at 40k
        { date: '2024-01-02', price: 39000 }, // Below cost basis
        { date: '2024-01-03', price: 38000 }, // Still below
        { date: '2024-01-04', price: 41000 }, // Above cost basis
      ];

      const result = simulateDCA(dailyPrices, '2024-01-01', 1000);

      expect(result.daysInDrawdown).toBe(2); // Days 2 and 3
    });

    it('should track longest negative streak', () => {
      const dailyPrices: DailyPrice[] = [
        { date: '2024-01-01', price: 40000 }, // Buy
        { date: '2024-01-02', price: 39000 }, // -1
        { date: '2024-01-03', price: 38000 }, // -2
        { date: '2024-01-04', price: 37000 }, // -3
        { date: '2024-01-05', price: 41000 }, // Back up
        { date: '2024-01-06', price: 39000 }, // -1
        { date: '2024-01-07', price: 38000 }, // -2
        { date: '2024-01-08', price: 42000 }, // Back up
      ];

      const result = simulateDCA(dailyPrices, '2024-01-01', 1000);

      expect(result.longestNegativeStreak).toBe(3); // Days 2-4
    });

    it('should handle always profitable scenario', () => {
      const dailyPrices: DailyPrice[] = [
        { date: '2024-01-01', price: 40000 },
        { date: '2024-01-02', price: 41000 },
        { date: '2024-01-03', price: 42000 },
      ];

      const result = simulateDCA(dailyPrices, '2024-01-01', 1000);

      expect(result.daysInDrawdown).toBe(0);
      expect(result.longestNegativeStreak).toBe(0);
    });

    it('should track drawdown with multiple purchases', () => {
      const dailyPrices: DailyPrice[] = [
        { date: '2024-01-01', price: 40000 }, // Buy 0.025 BTC, basis = 40k
        { date: '2024-01-15', price: 42000 },
        { date: '2024-02-01', price: 30000 }, // Buy 0.0333 BTC, basis drops
        { date: '2024-02-15', price: 32000 }, // Still below first basis
      ];

      const result = simulateDCA(dailyPrices, '2024-01-01', 1000);

      // After 2nd purchase: total invested = 2000, total BTC = 0.05833...
      // Cost basis = 2000 / 0.05833 = 34285.71
      // At 32000: below cost basis
      expect(result.daysInDrawdown).toBeGreaterThan(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty price data', () => {
      expect(() => simulateDCA([], '2024-01-01', 1000)).toThrow();
    });

    it('should handle start date before data', () => {
      const dailyPrices: DailyPrice[] = [
        { date: '2024-02-01', price: 40000 },
      ];

      const result = simulateDCA(dailyPrices, '2024-01-01', 1000);

      // Should start at first available date
      expect(result.totalInvested).toBe(1000);
    });

    it('should handle zero monthly amount', () => {
      const dailyPrices: DailyPrice[] = [
        { date: '2024-01-01', price: 40000 },
      ];

      expect(() => simulateDCA(dailyPrices, '2024-01-01', 0)).toThrow();
    });

    it('should handle negative monthly amount', () => {
      const dailyPrices: DailyPrice[] = [
        { date: '2024-01-01', price: 40000 },
      ];

      expect(() => simulateDCA(dailyPrices, '2024-01-01', -1000)).toThrow();
    });
  });

  describe('Real-world scenario', () => {
    it('should simulate realistic 6-month DCA', () => {
      const dailyPrices: DailyPrice[] = [
        { date: '2024-01-01', price: 42000 },
        { date: '2024-01-15', price: 43000 },
        { date: '2024-02-01', price: 45000 },
        { date: '2024-02-15', price: 44000 },
        { date: '2024-03-01', price: 62000 },
        { date: '2024-03-15', price: 65000 },
        { date: '2024-04-01', price: 68000 },
        { date: '2024-04-15', price: 67000 },
        { date: '2024-05-01', price: 62000 },
        { date: '2024-05-15', price: 64000 },
        { date: '2024-06-01', price: 70000 },
        { date: '2024-06-15', price: 71000 },
      ];

      const result = simulateDCA(dailyPrices, '2024-01-01', 500);

      expect(result.totalInvested).toBe(3000); // 6 months * 500
      expect(result.totalBTC).toBeGreaterThan(0);
      expect(result.currentValue).toBeGreaterThan(result.totalInvested);
      expect(result.currentPnL).toBeGreaterThan(0);
      expect(result.currentPnLPercent).toBeGreaterThan(0);
    });
  });
});
