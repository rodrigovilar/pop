import { useI18n } from '../contexts/I18nContext';
import { theme } from '../styles/theme';
import type { Language, Currency } from '../types';

interface SettingsProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

const AVAILABLE_CURRENCIES: Currency[] = [
  'USD', 'EUR', 'BRL', 'GBP', 'JPY',
  'CHF', 'CAD', 'AUD', 'NZD',
  'CNY', 'HKD', 'SGD',
  'INR', 'KRW',
  'MXN', 'ARS',
  'ZAR', 'TRY',
  'SEK', 'NOK',
];

const AVAILABLE_LANGUAGES: Array<{ code: Language; label: string }> = [
  { code: 'en', label: 'English' },
  { code: 'pt-BR', label: 'Português' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'sv', label: 'Svenska' },
  { code: 'da', label: 'Dansk' },
  { code: 'no', label: 'Norsk' },
  { code: 'fi', label: 'Suomi' },
  { code: 'pl', label: 'Polski' },
  { code: 'cs', label: 'Čeština' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'ru', label: 'Русский' },
  { code: 'uk', label: 'Українська' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'zh-Hans', label: '简体中文' },
  { code: 'hi', label: 'हिन्दी' },
];

export function Settings({ currency, onCurrencyChange }: SettingsProps) {
  const { language, setLanguage } = useI18n();

  return (
    <div style={{
      display: 'flex',
      gap: theme.spacing.md,
      alignItems: 'center',
    }}>
      {/* Language Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
        <label
          htmlFor="language-select"
          style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            fontWeight: theme.typography.fontWeight.medium,
          }}
        >
          🌐
        </label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          style={{
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            fontSize: theme.typography.fontSize.sm,
            border: `2px solid ${theme.colors.primary[200]}`,
            borderRadius: theme.borderRadius.md,
            backgroundColor: theme.colors.background.tertiary,
            color: theme.colors.text.primary,
            fontWeight: theme.typography.fontWeight.medium,
            cursor: 'pointer',
            outline: 'none',
            transition: theme.transitions.base,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = theme.colors.primary[400];
            e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.colors.primary[100]}`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = theme.colors.primary[200];
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {AVAILABLE_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Currency Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
        <label
          htmlFor="currency-select"
          style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            fontWeight: theme.typography.fontWeight.medium,
          }}
        >
          💱
        </label>
        <select
          id="currency-select"
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value as Currency)}
          style={{
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            fontSize: theme.typography.fontSize.sm,
            border: `2px solid ${theme.colors.primary[200]}`,
            borderRadius: theme.borderRadius.md,
            backgroundColor: theme.colors.background.tertiary,
            color: theme.colors.text.primary,
            fontWeight: theme.typography.fontWeight.medium,
            cursor: 'pointer',
            outline: 'none',
            transition: theme.transitions.base,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = theme.colors.primary[400];
            e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.colors.primary[100]}`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = theme.colors.primary[200];
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {AVAILABLE_CURRENCIES.map((curr) => (
            <option key={curr} value={curr}>
              {curr}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
