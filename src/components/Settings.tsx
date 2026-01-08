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
  'HKD', 'SGD',
  'INR', 'KRW',
  'MXN', 'ARS',
  'ZAR', 'TRY',
];

const AVAILABLE_LANGUAGES: Array<{ code: Language; label: string }> = [
  { code: 'en', label: 'English' },
  { code: 'pt-BR', label: 'Português' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'fi', label: 'Suomi' },
  { code: 'pl', label: 'Polski' },
  { code: 'cs', label: 'Čeština' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.xs,
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
        backgroundColor: theme.colors.background.elevated,
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${theme.colors.border.light}`,
        boxShadow: theme.shadows.sm,
        transition: theme.transitions.smooth,
      }}>
        <label
          htmlFor="language-select"
          style={{
            fontSize: theme.typography.fontSize.lg,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          🌐
        </label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          style={{
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
            fontSize: theme.typography.fontSize.sm,
            border: 'none',
            borderRadius: theme.borderRadius.md,
            backgroundColor: 'transparent',
            color: theme.colors.text.primary,
            fontWeight: theme.typography.fontWeight.semibold,
            cursor: 'pointer',
            outline: 'none',
            transition: theme.transitions.fast,
            fontFamily: theme.typography.fontFamily.sans,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.background.tertiary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          onFocus={(e) => {
            e.currentTarget.parentElement!.style.borderColor = theme.colors.primary[500];
            e.currentTarget.parentElement!.style.boxShadow = theme.shadows.glow;
          }}
          onBlur={(e) => {
            e.currentTarget.parentElement!.style.borderColor = theme.colors.border.light;
            e.currentTarget.parentElement!.style.boxShadow = theme.shadows.sm;
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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.xs,
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
        backgroundColor: theme.colors.background.elevated,
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${theme.colors.border.light}`,
        boxShadow: theme.shadows.sm,
        transition: theme.transitions.smooth,
      }}>
        <label
          htmlFor="currency-select"
          style={{
            fontSize: theme.typography.fontSize.lg,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          💱
        </label>
        <select
          id="currency-select"
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value as Currency)}
          style={{
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
            fontSize: theme.typography.fontSize.sm,
            border: 'none',
            borderRadius: theme.borderRadius.md,
            backgroundColor: 'transparent',
            color: theme.colors.text.primary,
            fontWeight: theme.typography.fontWeight.semibold,
            cursor: 'pointer',
            outline: 'none',
            transition: theme.transitions.fast,
            fontFamily: theme.typography.fontFamily.mono,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.background.tertiary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          onFocus={(e) => {
            e.currentTarget.parentElement!.style.borderColor = theme.colors.primary[500];
            e.currentTarget.parentElement!.style.boxShadow = theme.shadows.glow;
          }}
          onBlur={(e) => {
            e.currentTarget.parentElement!.style.borderColor = theme.colors.border.light;
            e.currentTarget.parentElement!.style.boxShadow = theme.shadows.sm;
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
