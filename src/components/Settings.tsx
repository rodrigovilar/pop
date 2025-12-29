import { useI18n } from '../contexts/I18nContext';
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
      gap: '1rem',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      padding: '0.5rem 1rem',
      borderBottom: '1px solid #e5e7eb',
    }}>
      {/* Language Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <label
          htmlFor="language-select"
          style={{
            fontSize: '0.875rem',
            color: '#666',
            fontWeight: '500',
          }}
        >
          🌐
        </label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          style={{
            padding: '0.375rem 0.75rem',
            fontSize: '0.875rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            backgroundColor: 'white',
            cursor: 'pointer',
            outline: 'none',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <label
          htmlFor="currency-select"
          style={{
            fontSize: '0.875rem',
            color: '#666',
            fontWeight: '500',
          }}
        >
          💱
        </label>
        <select
          id="currency-select"
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value as Currency)}
          style={{
            padding: '0.375rem 0.75rem',
            fontSize: '0.875rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            backgroundColor: 'white',
            cursor: 'pointer',
            outline: 'none',
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
