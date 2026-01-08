import { useState, useMemo } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import { theme } from '../../styles/theme';
import type { MonthlyData, Currency } from '../../types';

interface DetailsSectionProps {
  monthlyData: Map<string, MonthlyData>;
  currency: Currency;
  startMonth: string;
}

interface MonthlyDCAEntry {
  month: string;
  amountInvested: number;
  btcBought: number;
  currentValue: number;
  totalGainPercent: number;
  monthlyGainPercent: number;
  monthsElapsed: number;
}

export function DetailsSection({ monthlyData, currency, startMonth }: DetailsSectionProps) {
  const { t, formatCurrency, formatNumber } = useI18n();
  const [monthlyAmount] = useState(100);

  // Calculate DCA entries for each month
  const dcaEntries = useMemo(() => {
    const months = Array.from(monthlyData.values())
      .filter(m => m.month >= startMonth)
      .sort((a, b) => a.month.localeCompare(b.month));

    if (months.length === 0) return [];

    const entries: MonthlyDCAEntry[] = [];
    const currentPrice = months[months.length - 1].entryPrice;

    months.forEach((month, index) => {
      const btcBought = monthlyAmount / month.entryPrice;
      const currentValue = btcBought * currentPrice;
      const totalGainPercent = ((currentValue - monthlyAmount) / monthlyAmount) * 100;
      const monthsElapsed = months.length - index;

      const monthlyGainPercent = monthsElapsed > 0
        ? (Math.pow(currentValue / monthlyAmount, 1 / monthsElapsed) - 1) * 100
        : 0;

      entries.push({
        month: month.month,
        amountInvested: monthlyAmount,
        btcBought,
        currentValue,
        totalGainPercent,
        monthlyGainPercent,
        monthsElapsed,
      });
    });

    return entries;
  }, [monthlyData, startMonth, monthlyAmount]);

  // Calculate totals and weighted average monthly gain
  const totals = useMemo(() => {
    const totalInvested = dcaEntries.reduce((sum, entry) => sum + entry.amountInvested, 0);
    const totalBTC = dcaEntries.reduce((sum, entry) => sum + entry.btcBought, 0);
    const totalCurrentValue = dcaEntries.reduce((sum, entry) => sum + entry.currentValue, 0);
    const totalGainPercent = totalInvested > 0 ? ((totalCurrentValue - totalInvested) / totalInvested) * 100 : 0;

    let weightedSum = 0;
    let totalWeight = 0;

    dcaEntries.forEach(entry => {
      const weight = entry.monthsElapsed;
      weightedSum += entry.monthlyGainPercent * weight;
      totalWeight += weight;
    });

    const avgMonthlyGainPercent = totalWeight > 0 ? weightedSum / totalWeight : 0;

    return {
      totalInvested,
      totalBTC,
      totalCurrentValue,
      totalGainPercent,
      avgMonthlyGainPercent,
    };
  }, [dcaEntries]);

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
        marginBottom: theme.spacing['2xl'],
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
          {t('details.title') || 'The Real Numbers'}
        </h2>

        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          color: theme.colors.text.secondary,
          lineHeight: theme.typography.lineHeight.relaxed,
          marginBottom: theme.spacing.lg,
        }}>
          {t('details.intro') || 'Here\'s the month-by-month breakdown. Notice the average monthly gain - it may not look impressive, but it\'s the true indicator of Bitcoin\'s growth.'}
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.xl,
        maxWidth: '1200px',
        width: '100%',
      }}>
        <div style={{
          padding: theme.spacing.lg,
          backgroundColor: theme.colors.background.elevated,
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.border.light}`,
          boxShadow: theme.shadows.sm,
        }}>
          <div style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.tertiary,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: theme.spacing.xs,
          }}>
            {t('dca.results.totalInvested')}
          </div>
          <div style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.mono,
          }}>
            {formatCurrency(totals.totalInvested, currency)}
          </div>
        </div>

        <div style={{
          padding: theme.spacing.lg,
          backgroundColor: theme.colors.background.elevated,
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.border.light}`,
          boxShadow: theme.shadows.sm,
        }}>
          <div style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.tertiary,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: theme.spacing.xs,
          }}>
            {t('dca.results.totalBTC')}
          </div>
          <div style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.mono,
          }}>
            {formatNumber(totals.totalBTC, { minimumFractionDigits: 8, maximumFractionDigits: 8 })} BTC
          </div>
        </div>

        <div style={{
          padding: theme.spacing.lg,
          backgroundColor: theme.colors.background.elevated,
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.border.light}`,
          boxShadow: theme.shadows.sm,
        }}>
          <div style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.tertiary,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: theme.spacing.xs,
          }}>
            {t('dca.results.currentValue')}
          </div>
          <div style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.primary[600],
            fontFamily: theme.typography.fontFamily.mono,
          }}>
            {formatCurrency(totals.totalCurrentValue, currency)}
          </div>
        </div>

        <div style={{
          padding: theme.spacing.lg,
          backgroundColor: theme.colors.background.elevated,
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.border.light}`,
          boxShadow: theme.shadows.sm,
        }}>
          <div style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.tertiary,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: theme.spacing.xs,
          }}>
            {t('dca.details.totalGain')}
          </div>
          <div style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            color: totals.totalGainPercent >= 0 ? theme.colors.status.success : theme.colors.status.error,
            fontFamily: theme.typography.fontFamily.mono,
          }}>
            {totals.totalGainPercent >= 0 ? '+' : ''}{totals.totalGainPercent.toFixed(2)}%
          </div>
        </div>

        <div style={{
          padding: theme.spacing.lg,
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderRadius: theme.borderRadius.lg,
          border: `2px solid ${theme.colors.primary[400]}`,
          boxShadow: theme.shadows.md,
        }}>
          <div style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.primary[700],
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: theme.spacing.xs,
            fontWeight: theme.typography.fontWeight.bold,
          }}>
            {t('dca.details.avgMonthlyGain')}
          </div>
          <div style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.extrabold,
            color: theme.colors.primary[700],
            fontFamily: theme.typography.fontFamily.mono,
          }}>
            {totals.avgMonthlyGainPercent >= 0 ? '+' : ''}{totals.avgMonthlyGainPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Final Message */}
      <div style={{
        maxWidth: '900px',
        padding: theme.spacing.xl,
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        border: `2px solid ${theme.colors.status.success}20`,
        borderRadius: theme.borderRadius.xl,
        marginBottom: theme.spacing.xl,
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: theme.typography.fontSize.lg,
          color: theme.colors.text.primary,
          lineHeight: theme.typography.lineHeight.relaxed,
          marginBottom: theme.spacing.md,
          fontWeight: theme.typography.fontWeight.semibold,
        }}>
          {t('details.keyInsight') || 'The average monthly gain might seem modest, but this is what Bitcoin truly offers.'}
        </p>
        <p style={{
          fontSize: theme.typography.fontSize.base,
          color: theme.colors.text.secondary,
          lineHeight: theme.typography.lineHeight.relaxed,
          margin: 0,
        }}>
          {t('details.finalMessage') || 'This is the metric that should guide your investment decision - not daily volatility or short-term swings. Bitcoin rewards patience and consistency.'}
        </p>
      </div>
    </section>
  );
}
