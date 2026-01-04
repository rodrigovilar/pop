import { describe, it, expect } from 'vitest';
import { calculateRegime } from '../../scripts/lib/regimeCalculator';

/**
 * TDD: Regime Calculator Tests
 *
 * Rules:
 * - Bull: >= +10% within month (entry to exit price)
 * - Bear: <= -10% within month (entry to exit price)
 * - Lateral: between -10% and +10%
 * - N/A: when no exit price available
 */

describe('Regime Calculator', () => {
  const THRESHOLD = 0.10; // 10%

  it('should return N/A when no exit price available', () => {
    expect(calculateRegime(50000, null, THRESHOLD)).toBe('N/A');
  });

  it('should return BULL when price increased >= 10%', () => {
    const entryPrice = 40000;
    const exitPrice = 44000; // +10%
    expect(calculateRegime(entryPrice, exitPrice, THRESHOLD)).toBe('BULL');
  });

  it('should return BULL when price increased > 10%', () => {
    const entryPrice = 40000;
    const exitPrice = 50000; // +25%
    expect(calculateRegime(entryPrice, exitPrice, THRESHOLD)).toBe('BULL');
  });

  it('should return BEAR when price decreased >= 10%', () => {
    const entryPrice = 50000;
    const exitPrice = 45000; // -10%
    expect(calculateRegime(entryPrice, exitPrice, THRESHOLD)).toBe('BEAR');
  });

  it('should return BEAR when price decreased > 10%', () => {
    const entryPrice = 50000;
    const exitPrice = 30000; // -40%
    expect(calculateRegime(entryPrice, exitPrice, THRESHOLD)).toBe('BEAR');
  });

  it('should return LATERAL when price changed < 10% positive', () => {
    const entryPrice = 40000;
    const exitPrice = 43000; // +7.5%
    expect(calculateRegime(entryPrice, exitPrice, THRESHOLD)).toBe('LATERAL');
  });

  it('should return LATERAL when price changed < 10% negative', () => {
    const entryPrice = 50000;
    const exitPrice = 46000; // -8%
    expect(calculateRegime(entryPrice, exitPrice, THRESHOLD)).toBe('LATERAL');
  });

  it('should return LATERAL when price unchanged', () => {
    const entryPrice = 50000;
    const exitPrice = 50000; // 0%
    expect(calculateRegime(entryPrice, exitPrice, THRESHOLD)).toBe('LATERAL');
  });

  it('should handle edge case at exactly 10% increase', () => {
    const entryPrice = 40000;
    const exitPrice = 44000; // exactly +10%
    expect(calculateRegime(entryPrice, exitPrice, THRESHOLD)).toBe('BULL');
  });

  it('should handle edge case at exactly -10% decrease', () => {
    const entryPrice = 50000;
    const exitPrice = 45000; // exactly -10%
    expect(calculateRegime(entryPrice, exitPrice, THRESHOLD)).toBe('BEAR');
  });
});
