/**
 * i18n (Internationalization) System
 *
 * Features:
 * - Lazy loading of translation files
 * - Type-safe translation keys (via TypeScript)
 * - Fallback to English
 * - Parameter interpolation
 * - React Context integration
 */

import type { Language } from '../types';

export type TranslationKey = string;

export interface Translations {
  [key: string]: string | Translations;
}

export interface I18nConfig {
  defaultLanguage: Language;
  fallbackLanguage: Language;
  availableLanguages: Language[];
}

const DEFAULT_CONFIG: I18nConfig = {
  defaultLanguage: 'en',
  fallbackLanguage: 'en',
  availableLanguages: [
    'en', 'pt-BR', 'es', 'fr', 'de', 'it', 'nl',
    'sv', 'da', 'no', 'fi',
    'pl', 'cs', 'tr',
    'ru', 'uk',
    'ja', 'ko', 'zh-Hans', 'hi',
  ],
};

export class I18n {
  private config: I18nConfig;
  private loadedTranslations: Map<Language, Translations> = new Map();
  private currentLanguage: Language;

  constructor(config: Partial<I18nConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.currentLanguage = this.config.defaultLanguage;
  }

  /**
   * Get current language
   */
  getLanguage(): Language {
    return this.currentLanguage;
  }

  /**
   * Set current language
   */
  setLanguage(language: Language): void {
    if (!this.config.availableLanguages.includes(language)) {
      console.warn(`Language "${language}" not available, falling back to ${this.config.fallbackLanguage}`);
      this.currentLanguage = this.config.fallbackLanguage;
      return;
    }
    this.currentLanguage = language;
  }

  /**
   * Load translations for a language
   */
  async loadLanguage(language: Language): Promise<void> {
    if (this.loadedTranslations.has(language)) {
      return; // Already loaded
    }

    try {
      const base = import.meta.env.BASE_URL || '/';
      const response = await fetch(`${base}i18n/${language}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${language}`);
      }

      const translations = await response.json();
      this.loadedTranslations.set(language, translations);
    } catch (error) {
      console.error(`Failed to load language ${language}:`, error);

      // Load fallback if not already loaded
      if (language !== this.config.fallbackLanguage) {
        await this.loadLanguage(this.config.fallbackLanguage);
      }
    }
  }

  /**
   * Get translation by key
   *
   * Supports nested keys with dot notation: "app.title"
   * Supports parameter interpolation: "Hello {name}"
   */
  t(key: string, params: Record<string, string | number> = {}): string {
    const translation = this.getTranslation(key, this.currentLanguage);

    // Interpolate parameters
    return this.interpolate(translation, params);
  }

  /**
   * Get translation from loaded translations
   */
  private getTranslation(key: string, language: Language): string {
    const translations = this.loadedTranslations.get(language);

    if (!translations) {
      // Try fallback
      if (language !== this.config.fallbackLanguage) {
        return this.getTranslation(key, this.config.fallbackLanguage);
      }
      return key; // Return key as last resort
    }

    // Navigate nested keys
    const keys = key.split('.');
    let value: unknown = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        // Key not found, try fallback
        if (language !== this.config.fallbackLanguage) {
          return this.getTranslation(key, this.config.fallbackLanguage);
        }
        return key; // Return key as last resort
      }
    }

    if (typeof value === 'string') {
      return value;
    }

    // Invalid translation (object instead of string)
    return key;
  }

  /**
   * Interpolate parameters in translation
   *
   * Example: "Hello {name}" with { name: "World" } => "Hello World"
   */
  private interpolate(text: string, params: Record<string, string | number>): string {
    let result = text;

    for (const [key, value] of Object.entries(params)) {
      const placeholder = `{${key}}`;
      result = result.replace(new RegExp(placeholder, 'g'), String(value));
    }

    return result;
  }

  /**
   * Format number according to current locale
   */
  formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(this.currentLanguage, options).format(value);
  }

  /**
   * Format currency according to current locale
   */
  formatCurrency(value: number, currency: string): string {
    return new Intl.NumberFormat(this.currentLanguage, {
      style: 'currency',
      currency,
    }).format(value);
  }

  /**
   * Format date according to current locale
   */
  formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(this.currentLanguage, options).format(dateObj);
  }
}

// Export singleton instance
export const i18n = new I18n();
