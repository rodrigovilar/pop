import { useState } from 'react';
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
  const allMonths = Array.from(monthlyData.values())
    .filter(m => m.month >= startMonth)
    .sort((a, b) => a.month.localeCompare(b.month)); // Ascending: oldest first

  // LIMIT TO 48 MONTHS (4 years)
  // If we have more than 48, take the *last* 48 to show recent history up to now
  // OR take the first 48 from start date? Usually "last 48" makes more sense for a fixed grid,
  // but if the user selected a specific start date, maybe they want to see FROM that date.
  // Given the request "shown 49 cards, want 48", let's slice the array.
  const displayMonths = allMonths.slice(0, 48);

  // Run DCA simulation from start month (using filtered months)
  const dcaResult = (() => {
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
  })();

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: theme.spacing.xl,
    }}>
      {/* Heading: "If you had invested in BTC on DATE" */}
      <h1 style={{
        fontSize: theme.typography.fontSize['3xl'],
        fontFamily: theme.typography.fontFamily.display,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xl,
        textAlign: 'center',
        lineHeight: theme.typography.lineHeight?.tight,
      }}>
        {t('main.ifYouHadInvested')} {(() => {
          // Safe date parsing to avoid timezone issues
          const [year, monthNum] = startMonth.split('-');
          const monthNamesLong = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          const monthName = monthNamesLong[parseInt(monthNum) - 1];
          return `${monthName} ${year}`;
        })()}
      </h1>

      {/* Two-column layout - STRICT 50/50 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', // Strict 50/50 ignoring content width
        gap: theme.spacing.xl,
        alignItems: 'start',
      }}>
        {/* LEFT: Monthly progression */}
        <section style={{ width: '100%' }}>
          <MonthGrid monthlyData={displayMonths} />
        </section>

        {/* RIGHT: DCA Simulation (sticky) */}
        <section style={{
          position: 'sticky',
          top: theme.spacing['4xl'], // Increased top offset for sticky header
          width: '100%',
        }}>
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
            border: `1px solid ${theme.colors.secondary[700]}`,
            boxShadow: theme.shadows.md,
          }}>
            <label style={{
              display: 'block',
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.text.secondary,
              marginBottom: theme.spacing.sm,
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
                padding: theme.spacing.md,
                fontSize: theme.typography.fontSize.lg,
                fontWeight: theme.typography.fontWeight.semibold,
                backgroundColor: theme.colors.background.tertiary,
                color: theme.colors.text.primary,
                border: `1px solid ${theme.colors.secondary[600]}`,
                borderRadius: theme.borderRadius.md,
                outline: 'none',
                transition: theme.transitions.default,
                fontFamily: theme.typography.fontFamily.mono,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.colors.accent[500];
                e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.colors.accent.glow}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = theme.colors.secondary[600];
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* DCA Results */}
          {dcaResult && (
            <div style={{
              backgroundColor: theme.colors.background.secondary, // Dark card
              padding: theme.spacing.xl,
              borderRadius: theme.borderRadius.xl,
              border: `1px solid ${theme.colors.secondary[700]}`, // Subtle border
              position: 'relative',
              overflow: 'hidden',
              boxShadow: theme.shadows.lg,
            }}>
              {/* Top Accent Line */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${theme.colors.accent[500]}, ${theme.colors.accent[400]})`,
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
                paddingTop: theme.spacing.lg,
                borderTop: `1px solid ${theme.colors.secondary[700]}`,
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
                  fontSize: theme.typography.fontSize['2xl'],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: dcaResult.currentPnLPercent >= 0 ? theme.colors.status.success : theme.colors.status.error,
                  fontFamily: theme.typography.fontFamily.mono,
                }}>
                  {dcaResult.currentPnLPercent >= 0 ? '+' : ''}{dcaResult.currentPnLPercent.toFixed(2)}%
                </div>
                <div style={{
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: dcaResult.currentPnLPercent >= 0 ? theme.colors.status.success : theme.colors.status.error,
                  marginTop: theme.spacing.xs,
                  fontFamily: theme.typography.fontFamily.mono,
                }}>
                  {dcaResult.currentPnL >= 0 ? '+' : ''}{formatCurrency(dcaResult.currentPnL, currency)}
                </div>
              </div>

              {/* Additional metrics */}
              <div style={{
                marginTop: theme.spacing.xl,
                paddingTop: theme.spacing.lg,
                borderTop: `1px solid ${theme.colors.secondary[700]}`,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.secondary,
              }}>
                <div style={{ marginBottom: theme.spacing.sm }}>
                  {t('dca.results.totalBTC')}: <strong style={{ color: theme.colors.text.primary }}>{dcaResult.totalBTC.toFixed(8)} BTC</strong>
                </div>
                <div>
                  {t('dca.results.daysInDrawdown')}: <strong style={{ color: theme.colors.text.primary }}>{dcaResult.daysInDrawdown} {t('common.days')}</strong>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
