import { describe, it, expect, beforeEach } from 'vitest';
import { I18n } from '../../src/lib/i18n';

describe('I18n System', () => {
  let i18n: I18n;

  beforeEach(() => {
    i18n = new I18n({
      defaultLanguage: 'en',
      fallbackLanguage: 'en',
    });

    // Mock translations
    (i18n as any).loadedTranslations.set('en', {
      app: {
        title: 'PoP - Proof of Patience',
        tagline: 'Bitcoin rewards few days',
      },
      greeting: 'Hello {name}',
      count: 'You have {count} items',
    });

    (i18n as any).loadedTranslations.set('pt-BR', {
      app: {
        title: 'PoP - Prova de Paciência',
        tagline: 'Bitcoin recompensa poucos dias',
      },
      greeting: 'Olá {name}',
    });
  });

  describe('Language management', () => {
    it('should get current language', () => {
      expect(i18n.getLanguage()).toBe('en');
    });

    it('should set language', () => {
      i18n.setLanguage('pt-BR');
      expect(i18n.getLanguage()).toBe('pt-BR');
    });

    it('should fallback to default for unavailable language', () => {
      // Mock console.warn to avoid test output noise
      const originalWarn = console.warn;
      console.warn = () => {};

      i18n.setLanguage('xyz' as any);
      expect(i18n.getLanguage()).toBe('en');

      console.warn = originalWarn;
    });
  });

  describe('Translation', () => {
    it('should translate simple key', () => {
      const result = i18n.t('app.title');
      expect(result).toBe('PoP - Proof of Patience');
    });

    it('should translate nested key', () => {
      const result = i18n.t('app.tagline');
      expect(result).toBe('Bitcoin rewards few days');
    });

    it('should return key if translation not found', () => {
      const result = i18n.t('nonexistent.key');
      expect(result).toBe('nonexistent.key');
    });

    it('should translate in different language', () => {
      i18n.setLanguage('pt-BR');
      const result = i18n.t('app.title');
      expect(result).toBe('PoP - Prova de Paciência');
    });

    it('should fallback to English if key not found in current language', () => {
      i18n.setLanguage('pt-BR');
      const result = i18n.t('count', { count: 5 });
      expect(result).toBe('You have 5 items'); // Falls back to English
    });
  });

  describe('Parameter interpolation', () => {
    it('should interpolate single parameter', () => {
      const result = i18n.t('greeting', { name: 'World' });
      expect(result).toBe('Hello World');
    });

    it('should interpolate multiple parameters', () => {
      const result = i18n.t('count', { count: 5 });
      expect(result).toBe('You have 5 items');
    });

    it('should interpolate number parameters', () => {
      const result = i18n.t('count', { count: 42 });
      expect(result).toBe('You have 42 items');
    });

    it('should handle missing parameters', () => {
      const result = i18n.t('greeting');
      expect(result).toBe('Hello {name}'); // Placeholder remains
    });
  });

  describe('Number formatting', () => {
    it('should format number with default locale', () => {
      const result = i18n.formatNumber(1234.56);
      expect(result).toMatch(/1.*234.*56/); // Allows different separators
    });

    it('should format number with options', () => {
      const result = i18n.formatNumber(0.42, {
        style: 'percent',
        minimumFractionDigits: 0,
      });
      expect(result).toMatch(/42/);
    });
  });

  describe('Currency formatting', () => {
    it('should format currency', () => {
      const result = i18n.formatCurrency(1234.56, 'USD');
      expect(result).toMatch(/1.*234.*56/);
      expect(result).toMatch(/\$/);
    });

    it('should format currency in different locale', () => {
      i18n.setLanguage('pt-BR');
      const result = i18n.formatCurrency(1234.56, 'BRL');
      expect(result).toMatch(/1.*234.*56/);
    });
  });

  describe('Date formatting', () => {
    it('should format date string', () => {
      const result = i18n.formatDate('2024-01-15');
      expect(result).toMatch(/2024|Jan|15/);
    });

    it('should format Date object', () => {
      const date = new Date('2024-01-15');
      const result = i18n.formatDate(date);
      expect(result).toMatch(/2024|Jan|15/);
    });

    it('should format date with options', () => {
      const result = i18n.formatDate('2024-01-15', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      expect(result).toMatch(/2024/);
      expect(result).toMatch(/January|15/);
    });
  });
});
