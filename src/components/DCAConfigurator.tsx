import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';

interface DCAConfiguratorProps {
  currency: string;
  defaultAmount: number;
  onAmountChange: (amount: number) => void;
}

export const DCAConfigurator = ({ currency, defaultAmount, onAmountChange }: DCAConfiguratorProps) => {
  const theme = useTheme();
  const [amount, setAmount] = useState(defaultAmount);

  const presetAmounts = currency === 'USD'
    ? [50, 100, 250, 500, 1000]
    : currency === 'EUR'
    ? [50, 100, 250, 500, 1000]
    : currency === 'BRL'
    ? [100, 250, 500, 1000, 2500]
    : [50, 100, 250, 500, 1000];

  const handleAmountChange = (newAmount: number) => {
    setAmount(newAmount);
    onAmountChange(newAmount);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px'
    }}>
      <h3 style={{
        fontSize: '28px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '16px',
        color: theme.colors.text
      }}>
        Try the DCA Strategy
      </h3>

      <p style={{
        textAlign: 'center',
        fontSize: '16px',
        color: theme.colors.textSecondary,
        marginBottom: '40px'
      }}>
        Choose how much you would invest every month
      </p>

      {/* Custom Amount Input */}
      <div style={{
        padding: '32px',
        background: theme.colors.surface,
        borderRadius: '16px',
        border: `2px solid ${theme.colors.text}20`,
        marginBottom: '24px'
      }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '600',
          color: theme.colors.textSecondary,
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Monthly Investment Amount
        </label>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: theme.colors.background,
          padding: '16px',
          borderRadius: '12px',
          border: `2px solid ${theme.colors.accent}40`
        }}>
          <span style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: theme.colors.text
          }}>
            {currency}
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => handleAmountChange(Number(e.target.value))}
            min="1"
            step="10"
            style={{
              flex: 1,
              fontSize: '32px',
              fontWeight: 'bold',
              color: theme.colors.accent,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              padding: '0'
            }}
          />
        </div>

        {/* Preset Buttons */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginTop: '20px',
          justifyContent: 'center'
        }}>
          {presetAmounts.map(preset => (
            <button
              key={preset}
              onClick={() => handleAmountChange(preset)}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                borderRadius: '8px',
                border: amount === preset
                  ? `2px solid ${theme.colors.accent}`
                  : `2px solid ${theme.colors.text}20`,
                background: amount === preset
                  ? theme.colors.accent + '20'
                  : 'transparent',
                color: amount === preset
                  ? theme.colors.accent
                  : theme.colors.text,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (amount !== preset) {
                  e.currentTarget.style.background = theme.colors.text + '10';
                }
              }}
              onMouseLeave={(e) => {
                if (amount !== preset) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {currency} {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div style={{
        padding: '20px',
        background: theme.colors.text + '08',
        borderRadius: '12px',
        fontSize: '14px',
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: '1.6'
      }}>
        💡 This simulation assumes you would have invested <strong style={{ color: theme.colors.text }}>{currency} {amount}</strong> on the first day of every month, starting from your reference date.
      </div>
    </div>
  );
};
