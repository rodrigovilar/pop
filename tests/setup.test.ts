import { describe, it, expect, beforeEach } from 'vitest';

describe('Test Environment Setup', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should have localStorage available', () => {
    expect(localStorage).toBeDefined();
    expect(localStorage.setItem).toBeDefined();
    expect(localStorage.getItem).toBeDefined();
  });

  it('should mock localStorage correctly', () => {
    localStorage.setItem('test', 'value');
    expect(localStorage.getItem('test')).toBe('value');

    localStorage.removeItem('test');
    expect(localStorage.getItem('test')).toBeNull();
  });

  it('should have navigator.storage.estimate available', async () => {
    expect(navigator.storage).toBeDefined();
    expect(navigator.storage.estimate).toBeDefined();

    const estimate = await navigator.storage.estimate();
    expect(estimate.quota).toBeDefined();
    expect(estimate.usage).toBeDefined();
  });
});
