import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../hooks/useI18n';
import type { DCAResult } from '../lib/dcaEngine';
import type { MonthlyBreakdown } from '../hooks/useDCA';

interface DCAResultsProps {
  result: DCAResult;
  monthlyBreakdown: MonthlyBreakdown[];
  averageMonthlyGain: number;
  currency: string;
}

export const DCAResults = ({ result, monthlyBreakdown, averageMonthlyGain, currency }: DCAResultsProps) => {
  const theme = useTheme();
  const { t } = useI18n();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatBTC = (value: number) => {
    return value.toFixed(8) + ' BTC';
  };

  const formatPercent = (value: number) => {
    return (value >= 0 ? '+' : '') + value.toFixed(1) + '%';
  };

  const formatMonthLabel = (monthStr: string): string => {
    const [year, month] = monthStr.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} '${year.slice(2)}`;
  };

  const isPositive = result.currentPnL >= 0;

  return (
    <div style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '60px 20px'
    }}>
      <h2 style={{
        fontSize: '36px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '16px',
        color: theme.colors.text
      }}>
        {t('dca.results.title')}
      </h2>

      <p style={{
        textAlign: 'center',
        fontSize: '16px',
        color: theme.colors.textSecondary,
        marginBottom: '40px'
      }}>
        {t('dca.results.subtitle')}
      </p>

      {/* Main Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {/* Total Invested */}
        <div style={{
          padding: '24px',
          background: theme.colors.surface,
          borderRadius: '16px',
          border: `2px solid ${theme.colors.text}20`
        }}>
          <div style={{
            fontSize: '14px',
            color: theme.colors.textSecondary,
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {t('dca.results.totalInvested')}
          </div>
          <div style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: theme.colors.text
          }}>
            {formatCurrency(result.totalInvested)}
          </div>
        </div>

        {/* Total BTC */}
        <div style={{
          padding: '24px',
          background: theme.colors.accent + '10',
          borderRadius: '16px',
          border: `2px solid ${theme.colors.accent}30`
        }}>
          <div style={{
            fontSize: '14px',
            color: theme.colors.textSecondary,
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {t('dca.results.totalBTC')}
          </div>
          <div style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: theme.colors.accent
          }}>
            {formatBTC(result.totalBTC)}
          </div>
        </div>

        {/* Current Value */}
        <div style={{
          padding: '24px',
          background: theme.colors.success + '10',
          borderRadius: '16px',
          border: `2px solid ${theme.colors.success}30`
        }}>
          <div style={{
            fontSize: '14px',
            color: theme.colors.textSecondary,
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {t('dca.results.currentValue')}
          </div>
          <div style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: theme.colors.success
          }}>
            {formatCurrency(result.currentValue)}
          </div>
        </div>
      </div>

      {/* Profit/Loss Card */}
      <div style={{
        padding: '32px',
        background: isPositive
          ? `linear-gradient(135deg, ${theme.colors.success}20 0%, ${theme.colors.success}10 100%)`
          : `linear-gradient(135deg, ${theme.colors.error}20 0%, ${theme.colors.error}10 100%)`,
        borderRadius: '20px',
        border: `3px solid ${isPositive ? theme.colors.success : theme.colors.error}40`,
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '16px',
          color: theme.colors.textSecondary,
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {isPositive ? t('dca.results.totalProfit') : t('dca.results.currentLoss')}
        </div>
        <div style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: isPositive ? theme.colors.success : theme.colors.error,
          marginBottom: '8px'
        }}>
          {formatCurrency(Math.abs(result.currentPnL))}
        </div>
        <div style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: isPositive ? theme.colors.success : theme.colors.error
        }}>
          {formatPercent(result.currentPnLPercent)}
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div style={{
        padding: '32px',
        background: theme.colors.surface,
        borderRadius: '16px',
        border: `2px solid ${theme.colors.text}20`,
        marginBottom: '40px',
        overflowX: 'auto'
      }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: theme.colors.text,
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          {t('dca.results.monthlyBreakdown.title')}
        </h3>

        <p style={{
          textAlign: 'center',
          fontSize: '14px',
          color: theme.colors.textSecondary,
          marginBottom: '24px'
        }}>
          {t('dca.results.monthlyBreakdown.subtitle')}
        </p>

        <div style={{
          maxHeight: '500px',
          overflowY: 'auto',
          border: `1px solid ${theme.colors.text}20`,
          borderRadius: '8px'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px'
          }}>
            <thead style={{
              position: 'sticky',
              top: 0,
              background: theme.colors.background,
              zIndex: 1,
              borderBottom: `2px solid ${theme.colors.text}30`
            }}>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: theme.colors.text, fontWeight: 'bold' }}>{t('dca.results.monthlyBreakdown.headers.month')}</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', color: theme.colors.text, fontWeight: 'bold' }}>{t('dca.results.monthlyBreakdown.headers.invested')}</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', color: theme.colors.text, fontWeight: 'bold' }}>{t('dca.results.monthlyBreakdown.headers.btcPrice')}</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', color: theme.colors.text, fontWeight: 'bold' }}>{t('dca.results.monthlyBreakdown.headers.btcBought')}</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', color: theme.colors.text, fontWeight: 'bold' }}>{t('dca.results.monthlyBreakdown.headers.totalBTC')}</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', color: theme.colors.text, fontWeight: 'bold' }}>{t('dca.results.monthlyBreakdown.headers.value')}</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', color: theme.colors.text, fontWeight: 'bold' }}>{t('dca.results.monthlyBreakdown.headers.pnl')}</th>
              </tr>
            </thead>
            <tbody>
              {monthlyBreakdown.map((month) => {
                const isInDrawdown = month.gain < 0;
                const btcPrice = month.invested / month.btcPurchased; // Calculate BTC price from invested/purchased

                return (
                  <tr
                    key={month.month}
                    style={{
                      background: isInDrawdown
                        ? theme.colors.error + '08'
                        : theme.colors.success + '08',
                      borderBottom: `1px solid ${theme.colors.text}10`
                    }}
                  >
                    <td style={{ padding: '12px 16px', color: theme.colors.text }}>
                      {formatMonthLabel(month.month)}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: theme.colors.text }}>
                      {formatCurrency(month.invested)}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: theme.colors.textSecondary }}>
                      {formatCurrency(btcPrice)}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: theme.colors.accent }}>
                      {month.btcPurchased.toFixed(6)}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: theme.colors.accent, fontWeight: 'bold' }}>
                      {month.cumulativeBTC.toFixed(6)}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: theme.colors.text }}>
                      {formatCurrency(month.currentValue)}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      color: isInDrawdown ? theme.colors.error : theme.colors.success,
                      fontWeight: 'bold'
                    }}>
                      {formatPercent(month.gainPercent)}
                      {isInDrawdown ? ' ⬇' : ' ⬆'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot style={{
              position: 'sticky',
              bottom: 0,
              background: theme.colors.background,
              borderTop: `2px solid ${theme.colors.text}30`,
              fontWeight: 'bold'
            }}>
              <tr>
                <td style={{ padding: '12px 16px', color: theme.colors.text }}>{t('dca.results.total')}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', color: theme.colors.text }}>
                  {formatCurrency(result.totalInvested)}
                </td>
                <td style={{ padding: '12px 16px' }}></td>
                <td style={{ padding: '12px 16px' }}></td>
                <td style={{ padding: '12px 16px', textAlign: 'right', color: theme.colors.accent }}>
                  {result.totalBTC.toFixed(6)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', color: theme.colors.success }}>
                  {formatCurrency(result.currentValue)}
                </td>
                <td style={{
                  padding: '12px 16px',
                  textAlign: 'right',
                  color: result.currentPnL >= 0 ? theme.colors.success : theme.colors.error
                }}>
                  {formatPercent(result.currentPnLPercent)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div style={{
          marginTop: '16px',
          padding: '16px',
          background: theme.colors.background,
          borderRadius: '8px',
          fontSize: '12px',
          color: theme.colors.textSecondary
        }}>
          <div style={{ marginBottom: '8px' }}>
            <strong style={{ color: theme.colors.text }}>{t('dca.results.monthlyBreakdown.legend.title')}</strong>
          </div>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                background: theme.colors.error + '40',
                borderRadius: '2px'
              }}></div>
              <span>⬇ = {t('dca.results.monthlyBreakdown.legend.drawdown')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                background: theme.colors.success + '40',
                borderRadius: '2px'
              }}></div>
              <span>⬆ = {t('dca.results.monthlyBreakdown.legend.profit')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Average Monthly Gain Highlight */}
      <div style={{
        padding: '40px',
        background: `linear-gradient(135deg, ${theme.colors.accent}25 0%, ${theme.colors.success}20 100%)`,
        borderRadius: '20px',
        border: `3px solid ${theme.colors.accent}60`,
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '18px',
          color: theme.colors.text,
          marginBottom: '16px',
          fontWeight: '600'
        }}>
          {t('dca.results.avgGain.title')}
        </div>
        <div style={{
          fontSize: '56px',
          fontWeight: 'bold',
          color: theme.colors.accent,
          marginBottom: '12px'
        }}>
          {formatPercent(averageMonthlyGain)}
        </div>
        <div style={{
          fontSize: '20px',
          color: theme.colors.text,
          fontWeight: '600',
          marginBottom: '16px'
        }}>
          {t('dca.results.avgGain.subtitle')}
        </div>
        <div style={{
          fontSize: '16px',
          color: theme.colors.textSecondary,
          lineHeight: '1.8',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          {t('dca.results.avgGain.explanation1')}<br />
          {t('dca.results.avgGain.explanation2')}
        </div>
      </div>
    </div>
  );
};
