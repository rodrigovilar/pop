import { describe, it, expect } from 'vitest';
import { convertToDailyPrices, groupByMonth, type PricePoint, type DailyPrice } from '../../scripts/lib/cryptoCompareClient';

describe('CryptoCompare Client', () => {
  describe('convertToDailyPrices', () => {
    it('should convert price points to daily prices', () => {
      const pricePoints: PricePoint[] = [
        { timestamp: 1704067200000, price: 42000 }, // 2024-01-01 00:00:00 UTC
        { timestamp: 1704153600000, price: 43000 }, // 2024-01-02 00:00:00 UTC
      ];

      const result = convertToDailyPrices(pricePoints);

      expect(result).toHaveLength(2);
      expect(result[0].date).toBe('2024-01-01');
      expect(result[0].price).toBe(42000);
      expect(result[1].date).toBe('2024-01-02');
      expect(result[1].price).toBe(43000);
    });

    it('should handle empty array', () => {
      const result = convertToDailyPrices([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('groupByMonth', () => {
    it('should group daily prices by month', () => {
      const dailyPrices: DailyPrice[] = [
        { date: '2024-01-01', price: 42000 },
        { date: '2024-01-15', price: 43000 },
        { date: '2024-02-01', price: 45000 },
        { date: '2024-02-20', price: 46000 },
      ];

      const result = groupByMonth(dailyPrices);

      expect(result.size).toBe(2);
      expect(result.get('2024-01')).toHaveLength(2);
      expect(result.get('2024-02')).toHaveLength(2);
    });

    it('should handle single month', () => {
      const dailyPrices: DailyPrice[] = [
        { date: '2024-01-01', price: 42000 },
        { date: '2024-01-15', price: 43000 },
        { date: '2024-01-31', price: 44000 },
      ];

      const result = groupByMonth(dailyPrices);

      expect(result.size).toBe(1);
      expect(result.get('2024-01')).toHaveLength(3);
    });

    it('should handle multiple years', () => {
      const dailyPrices: DailyPrice[] = [
        { date: '2023-12-31', price: 42000 },
        { date: '2024-01-01', price: 43000 },
        { date: '2024-01-15', price: 44000 },
      ];

      const result = groupByMonth(dailyPrices);

      expect(result.size).toBe(2);
      expect(result.get('2023-12')).toHaveLength(1);
      expect(result.get('2024-01')).toHaveLength(2);
    });

    it('should handle empty array', () => {
      const result = groupByMonth([]);
      expect(result.size).toBe(0);
    });
  });
});
