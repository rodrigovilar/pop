/**
 * LocalStorage Cache Manager with LRU Eviction
 *
 * Features:
 * - Namespaced keys (btcReport:v1:*)
 * - Metadata tracking (timestamp, access count, last accessed)
 * - LRU eviction when approaching quota limit
 * - Protected keys (never evict current settings/currency/language)
 * - Storage quota monitoring
 */

const NAMESPACE = 'btcReport:v1';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

export interface CacheOptions {
  maxUsagePercent?: number; // Default 85%
}

export interface StorageInfo {
  usage: number;
  quota: number;
  usagePercent: number;
}

export class CacheManager {
  private maxUsagePercent: number;

  constructor(options: CacheOptions = {}) {
    this.maxUsagePercent = options.maxUsagePercent || 85;
  }

  /**
   * Build namespaced key
   */
  private buildKey(key: string): string {
    return `${NAMESPACE}:${key}`;
  }

  /**
   * Store data in cache with metadata
   */
  set<T>(key: string, data: T): void {
    const fullKey = this.buildKey(key);
    const now = Date.now();

    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      accessCount: 0,
      lastAccessed: now,
    };

    try {
      localStorage.setItem(fullKey, JSON.stringify(entry));
    } catch (error) {
      // QuotaExceededError - try to free up space
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.evictLRU([key]); // Don't evict the item we're trying to save
        // Retry
        localStorage.setItem(fullKey, JSON.stringify(entry));
      } else {
        throw error;
      }
    }
  }

  /**
   * Retrieve data from cache and update access metadata
   */
  get<T>(key: string): T | null {
    const fullKey = this.buildKey(key);
    const raw = localStorage.getItem(fullKey);

    if (!raw) {
      return null;
    }

    try {
      const entry: CacheEntry<T> = JSON.parse(raw);

      // Update access metadata
      entry.accessCount++;
      entry.lastAccessed = Date.now();

      localStorage.setItem(fullKey, JSON.stringify(entry));

      return entry.data;
    } catch (error) {
      // Invalid JSON - remove corrupted entry
      localStorage.removeItem(fullKey);
      return null;
    }
  }

  /**
   * Remove item from cache
   */
  remove(key: string): void {
    const fullKey = this.buildKey(key);
    localStorage.removeItem(fullKey);
  }

  /**
   * Clear all cache (only namespaced keys)
   */
  clear(): void {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${NAMESPACE}:`)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Get storage usage information
   */
  async getStorageInfo(): Promise<StorageInfo> {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 5000000; // 5MB fallback

      return {
        usage,
        quota,
        usagePercent: (usage / quota) * 100,
      };
    }

    // Fallback: estimate based on localStorage size
    let totalSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        totalSize += key.length + (value?.length || 0);
      }
    }

    const estimatedQuota = 5000000; // 5MB typical limit

    return {
      usage: totalSize,
      quota: estimatedQuota,
      usagePercent: (totalSize / estimatedQuota) * 100,
    };
  }

  /**
   * Evict least recently used items
   *
   * @param protectedKeys - Keys that should never be evicted
   * @param count - Number of items to evict (default: 1)
   * @returns Number of items actually evicted
   */
  evictLRU(protectedKeys: string[] = [], count: number = 1): number {
    const items: Array<{
      key: string;
      fullKey: string;
      entry: CacheEntry<any>;
    }> = [];

    // Collect all cache entries
    for (let i = 0; i < localStorage.length; i++) {
      const fullKey = localStorage.key(i);
      if (!fullKey || !fullKey.startsWith(`${NAMESPACE}:`)) {
        continue;
      }

      // Extract user key
      const key = fullKey.substring(`${NAMESPACE}:`.length);

      // Skip protected keys
      if (protectedKeys.includes(key)) {
        continue;
      }

      const raw = localStorage.getItem(fullKey);
      if (!raw) continue;

      try {
        const entry: CacheEntry<any> = JSON.parse(raw);
        items.push({ key, fullKey, entry });
      } catch {
        // Invalid JSON - remove it
        localStorage.removeItem(fullKey);
      }
    }

    if (items.length === 0) {
      return 0;
    }

    // Sort by LRU criteria:
    // 1. Least recently accessed
    // 2. If equal, lowest access count
    // 3. If equal, oldest timestamp
    items.sort((a, b) => {
      if (a.entry.lastAccessed !== b.entry.lastAccessed) {
        return a.entry.lastAccessed - b.entry.lastAccessed;
      }
      if (a.entry.accessCount !== b.entry.accessCount) {
        return a.entry.accessCount - b.entry.accessCount;
      }
      return a.entry.timestamp - b.entry.timestamp;
    });

    // Evict the requested number of items
    const toEvict = Math.min(count, items.length);
    for (let i = 0; i < toEvict; i++) {
      localStorage.removeItem(items[i].fullKey);
    }

    return toEvict;
  }

  /**
   * Check if cleanup is needed and perform it
   */
  async cleanupIfNeeded(protectedKeys: string[] = []): Promise<number> {
    const info = await this.getStorageInfo();

    if (info.usagePercent < this.maxUsagePercent) {
      return 0;
    }

    // Evict items until we're below threshold
    let totalEvicted = 0;
    const targetPercent = this.maxUsagePercent - 10; // Clean up to 10% below threshold

    while (info.usagePercent > targetPercent) {
      const evicted = this.evictLRU(protectedKeys, 5);
      if (evicted === 0) {
        break; // No more items to evict
      }
      totalEvicted += evicted;

      // Re-check usage
      const newInfo = await this.getStorageInfo();
      if (newInfo.usagePercent <= targetPercent) {
        break;
      }
    }

    return totalEvicted;
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();
