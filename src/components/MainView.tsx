import { useState } from 'react';
import { MonthOverview } from './MonthOverview';
import { useI18n } from '../contexts/I18nContext';
import { theme } from '../styles/theme';
import { simulateDCA } from '../lib/dcaEngine';
import type { MonthlyData, Currency } from '../types';

interface MainViewProps {
  monthlyData: Map<string, MonthlyData>;
  currency: Currency;
}

export function MainView({ monthlyData, currency }: MainViewProps) {
  const { t, formatCurrency, formatDate } = useI18n();
  const [monthlyAmount, setMonthlyAmount] = useState(100);

  // Calculate start date: 4 years ago
  const now = new Date();
  const fourYearsAgo = new Date(now.getFullYear() - 4, now.getMonth(), 1);
  const startMonth = fourYearsAgo.toISOString().split('T')[0].substring(0, 7); // YYYY-MM

  // Get months from 4 years ago to now, in ascending order
  const allMonths = Array.from(monthlyData.values())
    .filter(m => m.month >= startMonth)
    .sort((a, b) => a.month.localeCompare(b.month)); // Ascending: oldest first

  // Run DCA simulation for 4 years
  const dcaResult = (() => {
    if (monthlyData.size === 0) return null;

    // Convert monthly data to daily prices for simulation
    const dailyPrices = Array.from(monthlyData.values())
      .filter(m => m.month >= startMonth)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map(m => ({
        date: m.entryDate,
        price: m.entryPrice,
      }));

    if (dailyPrices.length === 0) return null;

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
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xl,
        textAlign: 'center',
        lineHeight: theme.typography.lineHeight.tight,
      }}>
        {t('main.ifYouHadInvested')} {formatDate(fourYearsAgo, { year: 'numeric', month: 'long' })}
      </h1>

      {/* Two-column layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: theme.spacing.xl,
        alignItems: 'start',
      }}>
        {/* LEFT: Monthly progression */}
        <section>
          <h2 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.lg,
          }}>
            {t('main.monthlyProgression')}
          </h2>

          <div style={{
            maxHeight: '800px',
            overflowY: 'auto',
            paddingRight: theme.spacing.sm,
          }}>
            {allMonths.map((data) => (
              <MonthOverview key={data.month} data={data} />
            ))}
          </div>
        </section>

        {/* RIGHT: DCA Simulation (sticky) */}
        <section style={{
          position: 'sticky',
          top: theme.spacing.xl,
        }}>
          <h2 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.lg,
          }}>
            {t('main.dcaSimulation')}
          </h2>

          {/* Monthly Amount Input */}
          <div style={{
            backgroundColor: theme.colors.background.secondary,
            padding: theme.spacing.xl,
            borderRadius: theme.borderRadius.xl,
            marginBottom: theme.spacing.lg,
            border: `2px solid ${theme.colors.primary[200]}`,
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
                border: `2px solid ${theme.colors.primary[300]}`,
                borderRadius: theme.borderRadius.md,
                outline: 'none',
                transition: theme.transitions.base,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.colors.primary[500];
                e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.colors.primary[100]}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = theme.colors.primary[300];
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* DCA Results */}
          {dcaResult && (
            <div style={{
              backgroundColor: theme.colors.primary[50],
              padding: theme.spacing.xl,
              borderRadius: theme.borderRadius.xl,
              border: `2px solid ${theme.colors.primary[200]}`,
            }}>
              <div style={{ marginBottom: theme.spacing.lg }}>
                <div style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.xs,
                }}>
                  {t('dca.results.totalInvested')}
                </div>
                <div style={{
                  fontSize: theme.typography.fontSize['2xl'],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                }}>
                  {formatCurrency(dcaResult.totalInvested, currency)}
                </div>
              </div>

              <div style={{ marginBottom: theme.spacing.lg }}>
                <div style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.xs,
                }}>
                  {t('dca.results.currentValue')}
                </div>
                <div style={{
                  fontSize: theme.typography.fontSize['3xl'],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.primary[700],
                }}>
                  {formatCurrency(dcaResult.currentValue, currency)}
                </div>
              </div>

              <div style={{
                paddingTop: theme.spacing.lg,
                borderTop: `1px solid ${theme.colors.primary[200]}`,
              }}>
                <div style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.xs,
                }}>
                  {t('dca.results.pnl')}
                </div>
                <div style={{
                  fontSize: theme.typography.fontSize['2xl'],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: dcaResult.currentPnLPercent >= 0 ? '#059669' : '#dc2626',
                }}>
                  {dcaResult.currentPnLPercent >= 0 ? '+' : ''}{dcaResult.currentPnLPercent.toFixed(2)}%
                </div>
                <div style={{
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: dcaResult.currentPnLPercent >= 0 ? '#059669' : '#dc2626',
                  marginTop: theme.spacing.xs,
                }}>
                  {dcaResult.currentPnL >= 0 ? '+' : ''}{formatCurrency(dcaResult.currentPnL, currency)}
                </div>
              </div>

              {/* Additional metrics */}
              <div style={{
                marginTop: theme.spacing.xl,
                paddingTop: theme.spacing.lg,
                borderTop: `1px solid ${theme.colors.primary[200]}`,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.secondary,
              }}>
                <div style={{ marginBottom: theme.spacing.sm }}>
                  {t('dca.results.totalBTC')}: <strong>{dcaResult.totalBTC.toFixed(8)} BTC</strong>
                </div>
                <div>
                  {t('dca.results.daysInDrawdown')}: <strong>{dcaResult.daysInDrawdown} {t('common.days')}</strong>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
