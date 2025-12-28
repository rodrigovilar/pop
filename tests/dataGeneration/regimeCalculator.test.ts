import { describe, it, expect } from 'vitest';
import { calculateRegime } from '../../scripts/lib/regimeCalculator';

/**
 * TDD: Regime Calculator Tests
 *
 * Rules:
 * - Bull: >= +10% vs previous month
 * - Bear: <= -10% vs previous month
 * - Lateral: between -10% and +10%
 * - N/A: when no previous month data
 */

describe('Regime Calculator', () => {
  const THRESHOLD = 0.10; // 10%

  it('should return N/A when no previous month data', () => {
    expect(calculateRegime(50000, null, THRESHOLD)).toBe('N/A');
  });

  it('should return BULL when price increased >= 10%', () => {
    const prev = 40000;
    const current = 44000; // +10%
    expect(calculateRegime(current, prev, THRESHOLD)).toBe('BULL');
  });

  it('should return BULL when price increased > 10%', () => {
    const prev = 40000;
    const current = 50000; // +25%
    expect(calculateRegime(current, prev, THRESHOLD)).toBe('BULL');
  });

  it('should return BEAR when price decreased >= 10%', () => {
    const prev = 50000;
    const current = 45000; // -10%
    expect(calculateRegime(current, prev, THRESHOLD)).toBe('BEAR');
  });

  it('should return BEAR when price decreased > 10%', () => {
    const prev = 50000;
    const current = 30000; // -40%
    expect(calculateRegime(current, prev, THRESHOLD)).toBe('BEAR');
  });

  it('should return LATERAL when price changed < 10% positive', () => {
    const prev = 40000;
    const current = 43000; // +7.5%
    expect(calculateRegime(current, prev, THRESHOLD)).toBe('LATERAL');
  });

  it('should return LATERAL when price changed < 10% negative', () => {
    const prev = 50000;
    const current = 46000; // -8%
    expect(calculateRegime(current, prev, THRESHOLD)).toBe('LATERAL');
  });

  it('should return LATERAL when price unchanged', () => {
    const prev = 50000;
    const current = 50000; // 0%
    expect(calculateRegime(current, prev, THRESHOLD)).toBe('LATERAL');
  });

  it('should handle edge case at exactly 10% increase', () => {
    const prev = 40000;
    const current = 44000; // exactly +10%
    expect(calculateRegime(current, prev, THRESHOLD)).toBe('BULL');
  });

  it('should handle edge case at exactly -10% decrease', () => {
    const prev = 50000;
    const current = 45000; // exactly -10%
    expect(calculateRegime(current, prev, THRESHOLD)).toBe('BEAR');
  });
});
