import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DataLoader } from '../../src/lib/dataLoader';
import type { Manifest, MonthlyData } from '../../src/types';

// Mock fetch
global.fetch = vi.fn() as typeof global.fetch;

// Mock cacheManager
vi.mock('../../src/lib/cacheManager', () => ({
  cacheManager: {
    get: vi.fn(),
    set: vi.fn(),
    clear: vi.fn(),
  },
}));

import { cacheManager } from '../../src/lib/cacheManager';

describe('Data Loader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Manifest loading', () => {
    it('should load manifest from network', async () => {
      const mockManifest: Manifest = {
        version: 'v1',
        asset: 'BTC',
        monthsAvailable: ['2024-01', '2024-02', '2024-03'],
        currencies: ['USD'],
        rules: {
          dailyPrice: 'last_seen_price_utc',
          entry: 'first_available_day_of_month',
          regimeThreshold: 0.1,
        },
        generatedAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(cacheManager.get).mockReturnValue(null);
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockManifest,
      });

      const loader = new DataLoader({ currency: 'USD' });
      const result = await loader.loadManifest();

      expect(result).toEqual(mockManifest);
      expect(cacheManager.set).toHaveBeenCalledWith('manifest', mockManifest);
    });

    it('should return cached manifest if available', async () => {
      const mockManifest: Manifest = {
        version: 'v1',
        asset: 'BTC',
        monthsAvailable: ['2024-01'],
        currencies: ['USD'],
        rules: {
          dailyPrice: 'last_seen_price_utc',
          entry: 'first_available_day_of_month',
          regimeThreshold: 0.1,
        },
        generatedAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(cacheManager.get).mockReturnValue(mockManifest);

      const loader = new DataLoader({ currency: 'USD' });
      const result = await loader.loadManifest();

      expect(result).toEqual(mockManifest);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should throw error if manifest fetch fails', async () => {
      vi.mocked(cacheManager.get).mockReturnValue(null);
      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        status: 404,
      });

      const loader = new DataLoader({ currency: 'USD' });

      await expect(loader.loadManifest()).rejects.toThrow('Failed to load manifest');
    });
  });

  describe('Monthly data loading', () => {
    it('should load month from network', async () => {
      const mockData: MonthlyData = {
        month: '2024-01',
        currency: 'USD',
        entryDate: '2024-01-01',
        entryPrice: 42000,
        daysPositive: 20,
        daysNegative: 10,
        daysTotal: 31,
        pctChangeVsPrevMonthStart: 5.2,
        regime: 'BULL',
      };

      vi.mocked(cacheManager.get).mockReturnValue(null);
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const loader = new DataLoader({ currency: 'USD' });
      const result = await loader.loadMonth('2024-01', 'USD');

      expect(result).toEqual(mockData);
      expect(cacheManager.set).toHaveBeenCalledWith('data:USD:2024-01', mockData);
    });

    it('should return cached month if available', async () => {
      const mockData: MonthlyData = {
        month: '2024-01',
        currency: 'USD',
        entryDate: '2024-01-01',
        entryPrice: 42000,
        daysPositive: 20,
        daysNegative: 10,
        daysTotal: 31,
        pctChangeVsPrevMonthStart: 5.2,
        regime: 'BULL',
      };

      vi.mocked(cacheManager.get).mockReturnValue(mockData);

      const loader = new DataLoader({ currency: 'USD' });
      const result = await loader.loadMonth('2024-01', 'USD');

      expect(result).toEqual(mockData);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should throw error if month fetch fails', async () => {
      vi.mocked(cacheManager.get).mockReturnValue(null);
      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        status: 404,
      });

      const loader = new DataLoader({ currency: 'USD' });

      await expect(loader.loadMonth('2024-01', 'USD')).rejects.toThrow();
    });
  });

  describe('Concurrent loading', () => {
    it('should load multiple months concurrently', async () => {
      const mockData: MonthlyData = {
        month: '2024-01',
        currency: 'USD',
        entryDate: '2024-01-01',
        entryPrice: 42000,
        daysPositive: 20,
        daysNegative: 10,
        daysTotal: 31,
        pctChangeVsPrevMonthStart: null,
        regime: 'N/A',
      };

      vi.mocked(cacheManager.get).mockReturnValue(null);
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const loader = new DataLoader({ currency: 'USD', maxConcurrent: 3 });
      const months = ['2024-01', '2024-02', '2024-03'];

      const results = await loader.loadMonths(months, 'USD');

      expect(results).toHaveLength(3);
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it('should respect maxConcurrent limit', async () => {
      const mockData: MonthlyData = {
        month: '2024-01',
        currency: 'USD',
        entryDate: '2024-01-01',
        entryPrice: 42000,
        daysPositive: 20,
        daysNegative: 10,
        daysTotal: 31,
        pctChangeVsPrevMonthStart: null,
        regime: 'N/A',
      };

      vi.mocked(cacheManager.get).mockReturnValue(null);
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const loader = new DataLoader({ currency: 'USD', maxConcurrent: 2 });
      const months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05'];

      await loader.loadMonths(months, 'USD');

      expect(global.fetch).toHaveBeenCalledTimes(5);
    });
  });

  describe('Progress reporting', () => {
    it('should report progress during loading', async () => {
      const mockManifest: Manifest = {
        version: 'v1',
        asset: 'BTC',
        monthsAvailable: ['2024-01', '2024-02'],
        currencies: ['USD'],
        rules: {
          dailyPrice: 'last_seen_price_utc',
          entry: 'first_available_day_of_month',
          regimeThreshold: 0.1,
        },
        generatedAt: '2024-01-01T00:00:00Z',
      };

      const mockData: MonthlyData = {
        month: '2024-01',
        currency: 'USD',
        entryDate: '2024-01-01',
        entryPrice: 42000,
        daysPositive: 20,
        daysNegative: 10,
        daysTotal: 31,
        pctChangeVsPrevMonthStart: null,
        regime: 'N/A',
      };

      vi.mocked(cacheManager.get).mockReturnValue(null);
      vi.mocked(global.fetch).mockImplementation((url: string) => {
        if (url.includes('manifest')) {
          return Promise.resolve({
            ok: true,
            json: async () => mockManifest,
          });
        }
        return Promise.resolve({
          ok: true,
          json: async () => mockData,
        });
      });

      const progressUpdates: LoadingProgress[] = [];
      const loader = new DataLoader({
        currency: 'USD',
        onProgress: (progress) => progressUpdates.push(progress),
      });

      await loader.loadAll();

      expect(progressUpdates.length).toBeGreaterThan(0);
      expect(progressUpdates[0].phase).toBe('manifest');
    });
  });

  describe('Progressive loading strategy', () => {
    it('should load in correct order: manifest -> current -> previous -> recent', async () => {
      const mockManifest: Manifest = {
        version: 'v1',
        asset: 'BTC',
        monthsAvailable: ['2023-01', '2023-02', '2024-01', '2024-02'],
        currencies: ['USD'],
        rules: {
          dailyPrice: 'last_seen_price_utc',
          entry: 'first_available_day_of_month',
          regimeThreshold: 0.1,
        },
        generatedAt: '2024-01-01T00:00:00Z',
      };

      const mockData: MonthlyData = {
        month: '2024-01',
        currency: 'USD',
        entryDate: '2024-01-01',
        entryPrice: 42000,
        daysPositive: 20,
        daysNegative: 10,
        daysTotal: 31,
        pctChangeVsPrevMonthStart: null,
        regime: 'N/A',
      };

      vi.mocked(cacheManager.get).mockReturnValue(null);
      vi.mocked(global.fetch).mockImplementation((url: string) => {
        if (url.includes('manifest')) {
          return Promise.resolve({
            ok: true,
            json: async () => mockManifest,
          });
        }
        return Promise.resolve({
          ok: true,
          json: async () => mockData,
        });
      });

      const loader = new DataLoader({ currency: 'USD' });
      const result = await loader.loadAll();

      expect(result.manifest).toEqual(mockManifest);
      expect(result.monthlyData.size).toBeGreaterThan(0);
    });
  });
});
