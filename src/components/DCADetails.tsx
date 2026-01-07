import { useMemo } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { theme } from '../styles/theme';
import type { MonthlyData, Currency } from '../types';

interface DCADetailsProps {
  monthlyData: Map<string, MonthlyData>;
  currency: Currency;
  startMonth: string;
  monthlyAmount: number;
  onBack: () => void;
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

export function DCADetails({ monthlyData, currency, startMonth, monthlyAmount, onBack }: DCADetailsProps) {
  const { t, formatCurrency, formatNumber } = useI18n();

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

      // Calculate compound monthly gain: ((1 + totalGain)^(1/months) - 1) * 100
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

  // Calculate totals
  const totals = useMemo(() => {
    const totalInvested = dcaEntries.reduce((sum, entry) => sum + entry.amountInvested, 0);
    const totalBTC = dcaEntries.reduce((sum, entry) => sum + entry.btcBought, 0);
    const totalCurrentValue = dcaEntries.reduce((sum, entry) => sum + entry.currentValue, 0);
    const totalGainPercent = totalInvested > 0 ? ((totalCurrentValue - totalInvested) / totalInvested) * 100 : 0;

    return {
      totalInvested,
      totalBTC,
      totalCurrentValue,
      totalGainPercent,
    };
  }, [dcaEntries]);

  return (
    <>
      <style>{`
        .dca-details-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: ${theme.spacing.xl};
        }

        .dca-details-table-wrapper {
          overflow-x: auto;
          border-radius: ${theme.borderRadius.xl};
          border: 1px solid ${theme.colors.border.light};
          background-color: ${theme.colors.background.secondary};
          box-shadow: ${theme.shadows.elevatedCard};
        }

        .dca-details-table {
          width: 100%;
          border-collapse: collapse;
          font-size: ${theme.typography.fontSize.sm};
        }

        .dca-details-table thead {
          background-color: ${theme.colors.background.tertiary};
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .dca-details-table th {
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          text-align: left;
          font-weight: ${theme.typography.fontWeight.bold};
          color: ${theme.colors.text.secondary};
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: ${theme.typography.fontSize.xs};
          border-bottom: 2px solid ${theme.colors.border.medium};
        }

        .dca-details-table th:nth-child(n+2) {
          text-align: right;
        }

        .dca-details-table tbody tr {
          border-bottom: 1px solid ${theme.colors.border.subtle};
          transition: ${theme.transitions.fast};
        }

        .dca-details-table tbody tr:hover {
          background-color: ${theme.colors.background.elevated};
        }

        .dca-details-table tbody tr:last-child {
          border-bottom: none;
        }

        .dca-details-table td {
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          color: ${theme.colors.text.primary};
          font-family: ${theme.typography.fontFamily.mono};
        }

        .dca-details-table td:first-child {
          font-family: ${theme.typography.fontFamily.sans};
          font-weight: ${theme.typography.fontWeight.medium};
        }

        .dca-details-table td:nth-child(n+2) {
          text-align: right;
        }

        .dca-details-table tfoot {
          background-color: ${theme.colors.background.tertiary};
          font-weight: ${theme.typography.fontWeight.bold};
          border-top: 2px solid ${theme.colors.border.strong};
        }

        .dca-details-table tfoot td {
          padding: ${theme.spacing.lg};
          font-size: ${theme.typography.fontSize.base};
        }

        .positive-gain {
          color: ${theme.colors.status.success};
        }

        .negative-gain {
          color: ${theme.colors.status.error};
        }

        @media (max-width: 767px) {
          .dca-details-container {
            padding: ${theme.spacing.md};
          }

          .dca-details-table {
            font-size: ${theme.typography.fontSize.xs};
          }

          .dca-details-table th,
          .dca-details-table td {
            padding: ${theme.spacing.sm} ${theme.spacing.md};
          }
        }
      `}</style>

      <div className="dca-details-container">
        {/* Header with back button */}
        <div style={{
          marginBottom: theme.spacing['2xl'],
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.lg,
        }}>
          <button
            onClick={onBack}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
              backgroundColor: theme.colors.background.tertiary,
              border: `1px solid ${theme.colors.border.medium}`,
              borderRadius: theme.borderRadius.lg,
              color: theme.colors.text.primary,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.semibold,
              cursor: 'pointer',
              transition: theme.transitions.smooth,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.background.elevated;
              e.currentTarget.style.transform = 'translateX(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.background.tertiary;
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            ← {t('common.back') || 'Back'}
          </button>

          <h1 style={{
            fontSize: theme.typography.fontSize['3xl'],
            fontFamily: theme.typography.fontFamily.display,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.primary,
            margin: 0,
          }}>
            {t('dca.details.title') || 'DCA Details'}
          </h1>
        </div>

        {/* Summary cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: theme.spacing.md,
          marginBottom: theme.spacing['2xl'],
        }}>
          <div style={{
            padding: theme.spacing.lg,
            backgroundColor: theme.colors.background.secondary,
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.border.light}`,
            boxShadow: theme.shadows.md,
          }}>
            <div style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.tertiary,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: theme.spacing.xs,
            }}>
              Total Invested
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
            backgroundColor: theme.colors.background.secondary,
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.border.light}`,
            boxShadow: theme.shadows.md,
          }}>
            <div style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.tertiary,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: theme.spacing.xs,
            }}>
              Total BTC
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
            backgroundColor: theme.colors.background.secondary,
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.border.light}`,
            boxShadow: theme.shadows.md,
          }}>
            <div style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.tertiary,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: theme.spacing.xs,
            }}>
              Current Value
            </div>
            <div style={{
              fontSize: theme.typography.fontSize.xl,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.accent[400],
              fontFamily: theme.typography.fontFamily.mono,
            }}>
              {formatCurrency(totals.totalCurrentValue, currency)}
            </div>
          </div>

          <div style={{
            padding: theme.spacing.lg,
            backgroundColor: theme.colors.background.secondary,
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.border.light}`,
            boxShadow: theme.shadows.md,
          }}>
            <div style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.tertiary,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: theme.spacing.xs,
            }}>
              Total Gain
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
        </div>

        {/* Table */}
        <div className="dca-details-table-wrapper">
          <table className="dca-details-table">
            <thead>
              <tr>
                <th>{t('dca.details.month') || 'Month'}</th>
                <th>{t('dca.details.invested') || 'Invested'}</th>
                <th>{t('dca.details.btcBought') || 'BTC Bought'}</th>
                <th>{t('dca.details.currentValue') || 'Current Value'}</th>
                <th>{t('dca.details.totalGain') || 'Total Gain %'}</th>
                <th>{t('dca.details.monthlyGain') || 'Monthly Gain %'}</th>
              </tr>
            </thead>
            <tbody>
              {dcaEntries.map((entry) => (
                <tr key={entry.month}>
                  <td>{entry.month}</td>
                  <td>{formatCurrency(entry.amountInvested, currency)}</td>
                  <td>{formatNumber(entry.btcBought, { minimumFractionDigits: 8, maximumFractionDigits: 8 })}</td>
                  <td>{formatCurrency(entry.currentValue, currency)}</td>
                  <td className={entry.totalGainPercent >= 0 ? 'positive-gain' : 'negative-gain'}>
                    {entry.totalGainPercent >= 0 ? '+' : ''}{entry.totalGainPercent.toFixed(2)}%
                  </td>
                  <td className={entry.monthlyGainPercent >= 0 ? 'positive-gain' : 'negative-gain'}>
                    {entry.monthlyGainPercent >= 0 ? '+' : ''}{entry.monthlyGainPercent.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>TOTAL</td>
                <td>{formatCurrency(totals.totalInvested, currency)}</td>
                <td>{formatNumber(totals.totalBTC, { minimumFractionDigits: 8, maximumFractionDigits: 8 })}</td>
                <td>{formatCurrency(totals.totalCurrentValue, currency)}</td>
                <td className={totals.totalGainPercent >= 0 ? 'positive-gain' : 'negative-gain'}>
                  {totals.totalGainPercent >= 0 ? '+' : ''}{totals.totalGainPercent.toFixed(2)}%
                </td>
                <td>—</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Educational note */}
        <div style={{
          marginTop: theme.spacing['2xl'],
          padding: theme.spacing.xl,
          backgroundColor: theme.colors.background.secondary,
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.border.light}`,
          borderLeft: `4px solid ${theme.colors.accent[500]}`,
        }}>
          <h3 style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.primary,
            marginTop: 0,
            marginBottom: theme.spacing.sm,
          }}>
            📊 {t('dca.details.noteTitle') || 'About the Calculations'}
          </h3>
          <p style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            lineHeight: theme.typography.lineHeight.relaxed,
            margin: 0,
          }}>
            {t('dca.details.noteText') || 'The "Monthly Gain %" represents the compound monthly return needed to achieve the total gain over the investment period. It\'s calculated using the formula: ((Current Value / Amount Invested)^(1/Months Elapsed) - 1) × 100. This helps you understand the average monthly performance of each investment.'}
          </p>
        </div>
      </div>
    </>
  );
}
