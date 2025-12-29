import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { i18n } from '../lib/i18n';
import type { Language } from '../types';

interface I18nContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (value: number, currency: string) => string;
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
  isLoading: boolean;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(i18n.getLanguage());
  const [isLoading, setIsLoading] = useState(true);

  // Load initial language
  useEffect(() => {
    const loadInitialLanguage = async () => {
      setIsLoading(true);
      await i18n.loadLanguage(language);
      setIsLoading(false);
    };

    loadInitialLanguage();
  }, [language]);

  const setLanguage = useCallback(async (lang: Language) => {
    setIsLoading(true);
    await i18n.loadLanguage(lang);
    i18n.setLanguage(lang);
    setLanguageState(lang);
    setIsLoading(false);
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    return i18n.t(key, params);
  }, []); // i18n is a singleton with internal state

  const formatNumber = useCallback((value: number, options?: Intl.NumberFormatOptions) => {
    return i18n.formatNumber(value, options);
  }, []);

  const formatCurrency = useCallback((value: number, currency: string) => {
    return i18n.formatCurrency(value, currency);
  }, []);

  const formatDate = useCallback((date: Date | string, options?: Intl.DateTimeFormatOptions) => {
    return i18n.formatDate(date, options);
  }, []);

  const value: I18nContextValue = {
    language,
    setLanguage,
    t,
    formatNumber,
    formatCurrency,
    formatDate,
    isLoading,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- Exporting hook alongside provider is common pattern
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
