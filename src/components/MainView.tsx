import { useState, useMemo } from 'react';
import { MonthGrid } from './MonthGrid';
import { useI18n } from '../contexts/I18nContext';
import { theme } from '../styles/theme';
import { simulateDCA } from '../lib/dcaEngine';
import type { MonthlyData, Currency } from '../types';

interface MainViewProps {
  monthlyData: Map<string, MonthlyData>;
  currency: Currency;
  startMonth: string;
}

export function MainView({ monthlyData, currency, startMonth }: MainViewProps) {
  const { t, formatCurrency } = useI18n();
  const [monthlyAmount, setMonthlyAmount] = useState(100);

  // Get months from startMonth to now, in ascending order
  // Memoize to ensure stable reference for downstream calculations
  const displayMonths = useMemo(() => {
    return Array.from(monthlyData.values())
      .filter(m => m.month >= startMonth)
      .sort((a, b) => a.month.localeCompare(b.month)); // Ascending: oldest first
  }, [monthlyData, startMonth]);

  // Run DCA simulation from start month (using filtered months)
  const dcaResult = useMemo(() => {
    if (displayMonths.length === 0) return null;

    // Convert display months to daily prices for simulation
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
    <>
      <style>{`
        .main-view-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: ${theme.spacing.xl};
        }

        .main-view-heading {
          font-size: ${theme.typography.fontSize['3xl']};
          font-family: ${theme.typography.fontFamily.display};
          font-weight: ${theme.typography.fontWeight.bold};
          color: ${theme.colors.text.primary};
          margin-bottom: ${theme.spacing.xl};
          text-align: center;
          line-height: ${theme.typography.lineHeight?.tight};
        }

        .main-view-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: ${theme.spacing.xl};
          align-items: start;
        }

        .dca-sidebar {
          position: sticky;
          top: ${theme.spacing['4xl']};
          width: 100%;
        }

        @media (max-width: 1023px) {
          .main-view-container {
            padding: ${theme.spacing.md};
          }

          .main-view-heading {
            font-size: ${theme.typography.fontSize['2xl']};
            margin-bottom: ${theme.spacing.lg};
          }

          .main-view-grid {
            grid-template-columns: 1fr;
            gap: ${theme.spacing.lg};
          }

          .dca-sidebar {
            position: static;
            top: 0;
          }
        }

        @media (max-width: 767px) {
          .main-view-container {
            padding: ${theme.spacing.sm};
          }

          .main-view-heading {
            font-size: ${theme.typography.fontSize.xl};
            margin-bottom: ${theme.spacing.md};
          }

          .main-view-grid {
            gap: ${theme.spacing.md};
          }
        }
      `}</style>

      <div className="main-view-container">
        {/* Heading: "If you had invested in BTC on DATE" */}
        <h1 className="main-view-heading">
          {t('main.ifYouHadInvested')} {(() => {
            // Safe date parsing to avoid timezone issues
            const [year, monthNum] = startMonth.split('-');
            const monthNamesLong = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const monthName = monthNamesLong[parseInt(monthNum) - 1];
            return `${monthName} ${year}`;
          })()}
        </h1>

        {/* Two-column layout - STRICT 50/50 on desktop, stacked on mobile */}
        <div className="main-view-grid">
        {/* LEFT: Monthly progression */}
        <section style={{ width: '100%' }}>
          <MonthGrid monthlyData={displayMonths} />
        </section>

        {/* RIGHT: DCA Simulation (sticky on desktop, normal on mobile) */}
        <section className="dca-sidebar">
          <h2 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.lg,
            fontFamily: theme.typography.fontFamily.display,
          }}>
            {t('main.dcaSimulation')}
          </h2>

          {/* Monthly Amount Input */}
          <div style={{
            backgroundColor: theme.colors.background.secondary,
            padding: theme.spacing.xl,
            borderRadius: theme.borderRadius.xl,
            marginBottom: theme.spacing.lg,
            border: `1px solid ${theme.colors.border.light}`,
            boxShadow: theme.shadows.elevatedCard,
            transition: theme.transitions.smooth,
          }}>
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
                e.currentTarget.style.borderColor = theme.colors.accent[500];
                e.currentTarget.style.boxShadow = theme.shadows.glow;
                e.currentTarget.style.transform = 'scale(1.01)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = theme.colors.border.medium;
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />
          </div>

          {/* DCA Results */}
          {dcaResult && (
            <div style={{
              backgroundColor: theme.colors.background.secondary,
              padding: theme.spacing['2xl'],
              borderRadius: theme.borderRadius.xl,
              border: `1px solid ${theme.colors.border.light}`,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: theme.shadows.elevatedCard,
              animation: 'slideUp 0.4s ease-out',
            }}>
              {/* Top Accent Line with glow */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(90deg, ${theme.colors.accent[600]}, ${theme.colors.accent[400]}, ${theme.colors.accent[600]})`,
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s linear infinite',
                boxShadow: `0 0 12px ${theme.colors.accent.glow}`,
              }} />

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
                  color: theme.colors.accent[400], // Orange for value
                  fontFamily: theme.typography.fontFamily.mono,
                  textShadow: '0 0 20px rgba(251, 146, 60, 0.2)', // Glow
                }}>
                  {formatCurrency(dcaResult.currentValue, currency)}
                </div>
              </div>

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

              {/* Additional metrics */}
              <div style={{
                marginTop: theme.spacing.xl,
                paddingTop: theme.spacing.xl,
                borderTop: `1px solid ${theme.colors.border.light}`,
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: theme.spacing.md,
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: theme.spacing.md,
                  backgroundColor: theme.colors.background.tertiary,
                  borderRadius: theme.borderRadius.md,
                  border: `1px solid ${theme.colors.border.subtle}`,
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
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: theme.spacing.md,
                  backgroundColor: theme.colors.background.tertiary,
                  borderRadius: theme.borderRadius.md,
                  border: `1px solid ${theme.colors.border.subtle}`,
                }}>
                  <span style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.secondary,
                  }}>
                    {t('dca.results.daysInDrawdown')}
                  </span>
                  <strong style={{
                    color: theme.colors.text.primary,
                    fontFamily: theme.typography.fontFamily.mono,
                    fontSize: theme.typography.fontSize.base,
                  }}>
                    {dcaResult.daysInDrawdown} {t('common.days')}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
    </>
  );
}
