import { useState, useMemo } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import { theme } from '../../styles/theme';
import { simulateDCA } from '../../lib/dcaEngine';
import type { MonthlyData, Currency } from '../../types';

interface LongTermSectionProps {
  monthlyData: Map<string, MonthlyData>;
  currency: Currency;
  startMonth: string;
}

export function LongTermSection({ monthlyData, currency, startMonth }: LongTermSectionProps) {
  const { t, formatCurrency } = useI18n();
  const [monthlyAmount, setMonthlyAmount] = useState(100);

  // Get months from startMonth to now
  const displayMonths = useMemo(() => {
    return Array.from(monthlyData.values())
      .filter(m => m.month >= startMonth)
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [monthlyData, startMonth]);

  // Run DCA simulation
  const dcaResult = useMemo(() => {
    if (displayMonths.length === 0) return null;

    const dailyPrices = displayMonths.map(m => ({
      date: m.entryDate,
      price: m.entryPrice,
    }));

    try {
      return simulateDCA(dailyPrices, dailyPrices[0].date, monthlyAmount);
    } catch {
      return null;
    }
  }, [displayMonths, monthlyAmount]);

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: `${theme.spacing['4xl']} ${theme.spacing.xl}`,
      position: 'relative',
    }}>
      {/* Section Title */}
      <div style={{
        maxWidth: '900px',
        marginBottom: theme.spacing['3xl'],
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          fontFamily: theme.typography.fontFamily.display,
          fontWeight: theme.typography.fontWeight.extrabold,
          color: theme.colors.text.primary,
          marginBottom: theme.spacing.xl,
          lineHeight: theme.typography.lineHeight.tight,
        }}>
          {t('longTerm.title') || 'The Long-Term Solution: DCA'}
        </h2>

        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          color: theme.colors.text.secondary,
          lineHeight: theme.typography.lineHeight.relaxed,
          marginBottom: theme.spacing.lg,
        }}>
          {t('longTerm.what') || 'Dollar Cost Averaging (DCA) means buying a fixed amount regularly, regardless of price.'}
        </p>

        <div style={{
          padding: theme.spacing.lg,
          backgroundColor: 'rgba(16, 185, 129, 0.05)',
          border: `2px solid ${theme.colors.status.success}20`,
          borderRadius: theme.borderRadius.lg,
          marginBottom: theme.spacing.xl,
        }}>
          <p style={{
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.text.primary,
            lineHeight: theme.typography.lineHeight.relaxed,
            margin: 0,
          }}>
            {t('longTerm.why') || 'Instead of trying to time the market (buying low, selling high), DCA focuses on time in the market. What matters is how long you\'re exposed to the asset, not when you enter or exit.'}
          </p>
        </div>
      </div>

      {/* DCA Simulator */}
      <div style={{
        width: '100%',
        maxWidth: '600px',
        padding: theme.spacing.xl,
        backgroundColor: theme.colors.background.elevated,
        borderRadius: theme.borderRadius.xl,
        border: `1px solid ${theme.colors.border.light}`,
        boxShadow: theme.shadows.elevatedCard,
      }}>
        {/* Input */}
        <div style={{ marginBottom: theme.spacing.xl }}>
          <label style={{
            display: 'block',
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing.sm,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {t('dca.monthlyAmount')}
          </label>
          <input
            type="number"
            value={monthlyAmount}
            onChange={(e) => setMonthlyAmount(Number(e.target.value))}
            min="1"
            step="10"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: theme.spacing.lg,
              fontSize: theme.typography.fontSize.xl,
              fontWeight: theme.typography.fontWeight.bold,
              backgroundColor: theme.colors.background.tertiary,
              color: theme.colors.text.primary,
              border: `2px solid ${theme.colors.border.medium}`,
              borderRadius: theme.borderRadius.lg,
              outline: 'none',
              transition: theme.transitions.smooth,
              fontFamily: theme.typography.fontFamily.mono,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = theme.colors.primary[500];
              e.currentTarget.style.boxShadow = theme.shadows.glow;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = theme.colors.border.medium;
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Results */}
        {dcaResult && (
          <div>
            {/* Total Invested */}
            <div style={{ marginBottom: theme.spacing.lg }}>
              <div style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.tertiary,
                marginBottom: theme.spacing.xs,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {t('dca.results.totalInvested')}
              </div>
              <div style={{
                fontSize: theme.typography.fontSize['2xl'],
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                fontFamily: theme.typography.fontFamily.mono,
              }}>
                {formatCurrency(dcaResult.totalInvested, currency)}
              </div>
            </div>

            {/* Current Value */}
            <div style={{ marginBottom: theme.spacing.lg }}>
              <div style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.tertiary,
                marginBottom: theme.spacing.xs,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {t('dca.results.currentValue')}
              </div>
              <div style={{
                fontSize: theme.typography.fontSize['3xl'],
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.primary[600],
                fontFamily: theme.typography.fontFamily.mono,
                textShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
              }}>
                {formatCurrency(dcaResult.currentValue, currency)}
              </div>
            </div>

            {/* P&L */}
            <div style={{
              paddingTop: theme.spacing.xl,
              borderTop: `1px solid ${theme.colors.border.light}`,
            }}>
              <div style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.tertiary,
                marginBottom: theme.spacing.xs,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {t('dca.results.pnl')}
              </div>
              <div style={{
                fontSize: theme.typography.fontSize['3xl'],
                fontWeight: theme.typography.fontWeight.extrabold,
                color: dcaResult.currentPnLPercent >= 0 ? theme.colors.status.success : theme.colors.status.error,
                fontFamily: theme.typography.fontFamily.mono,
                textShadow: dcaResult.currentPnLPercent >= 0
                  ? `0 0 20px ${theme.colors.status.successDark}`
                  : `0 0 20px ${theme.colors.status.errorDark}`,
              }}>
                {dcaResult.currentPnLPercent >= 0 ? '+' : ''}{dcaResult.currentPnLPercent.toFixed(2)}%
              </div>
              <div style={{
                fontSize: theme.typography.fontSize.lg,
                fontWeight: theme.typography.fontWeight.semibold,
                color: dcaResult.currentPnLPercent >= 0 ? theme.colors.status.success : theme.colors.status.error,
                marginTop: theme.spacing.sm,
                fontFamily: theme.typography.fontFamily.mono,
              }}>
                {dcaResult.currentPnL >= 0 ? '+' : ''}{formatCurrency(dcaResult.currentPnL, currency)}
              </div>
            </div>

            {/* Total BTC */}
            <div style={{
              marginTop: theme.spacing.xl,
              padding: theme.spacing.md,
              backgroundColor: theme.colors.background.tertiary,
              borderRadius: theme.borderRadius.md,
              border: `1px solid ${theme.colors.border.subtle}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.secondary,
              }}>
                {t('dca.results.totalBTC')}
              </span>
              <strong style={{
                color: theme.colors.text.primary,
                fontFamily: theme.typography.fontFamily.mono,
                fontSize: theme.typography.fontSize.base,
              }}>
                {dcaResult.totalBTC.toFixed(8)} BTC
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Message */}
      <div style={{
        maxWidth: '800px',
        marginTop: theme.spacing['3xl'],
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: theme.typography.fontSize.lg,
          color: theme.colors.text.secondary,
          fontStyle: 'italic',
          lineHeight: theme.typography.lineHeight.relaxed,
        }}>
          {t('longTerm.conclusion') || 'Consistency beats timing. Time in the market matters more than timing the market.'}
        </p>
      </div>
    </section>
  );
}
