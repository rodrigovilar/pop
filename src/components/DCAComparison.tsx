import { useTheme } from '../hooks/useTheme';

interface DCAComparisonProps {
  lumpSumAmount: number;
  dcaMonthlyAmount: number;
  dcaMonths: number;
  dcaTotalProfit: number;
  dcaProfitPercent: number;
  lumpSumProfit: number;
  lumpSumProfitPercent: number;
  dcaDaysInDrawdown: number;
  lumpSumMonthsInDrawdown: number;
  currency: string;
}

export const DCAComparison = ({
  lumpSumAmount,
  dcaMonthlyAmount,
  dcaMonths,
  dcaTotalProfit,
  dcaProfitPercent,
  lumpSumProfit,
  lumpSumProfitPercent,
  dcaDaysInDrawdown,
  lumpSumMonthsInDrawdown,
  currency
}: DCAComparisonProps) => {
  const theme = useTheme();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return (value >= 0 ? '+' : '') + value.toFixed(1) + '%';
  };

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
        Lump Sum vs DCA
      </h2>

      <p style={{
        textAlign: 'center',
        fontSize: '18px',
        color: theme.colors.textSecondary,
        marginBottom: '48px',
        maxWidth: '800px',
        margin: '0 auto 48px'
      }}>
        Both strategies can make money. But <strong style={{ color: theme.colors.text }}>only one</strong> lets you sleep at night.
      </p>

      {/* Comparison Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '32px',
        marginBottom: '48px'
      }}>
        {/* Lump Sum Card */}
        <div style={{
          padding: '32px',
          background: theme.colors.surface,
          borderRadius: '20px',
          border: `2px solid ${theme.colors.error}40`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <span style={{ fontSize: '40px' }}>😰</span>
            <h3 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: theme.colors.text,
              margin: 0
            }}>
              Lump Sum
            </h3>
          </div>

          {/* Strategy Description */}
          <div style={{
            padding: '16px',
            background: theme.colors.background,
            borderRadius: '12px',
            marginBottom: '24px',
            fontSize: '14px',
            color: theme.colors.textSecondary,
            textAlign: 'center'
          }}>
            Invest {formatCurrency(lumpSumAmount)} all at once<br />
            and check the price every month
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gap: '16px'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '4px' }}>
                Profit
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: lumpSumProfit >= 0 ? theme.colors.success : theme.colors.error
              }}>
                {formatCurrency(lumpSumProfit)} ({formatPercent(lumpSumProfitPercent)})
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '4px' }}>
                Months in Drawdown
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: theme.colors.error
              }}>
                {lumpSumMonthsInDrawdown}
              </div>
            </div>
          </div>

          {/* Negatives */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: theme.colors.error + '10',
            borderRadius: '12px',
            fontSize: '13px',
            color: theme.colors.text
          }}>
            <div style={{ marginBottom: '8px' }}>❌ High emotional stress</div>
            <div style={{ marginBottom: '8px' }}>❌ Checked price {dcaMonths} times</div>
            <div style={{ marginBottom: '8px' }}>❌ Felt panic during drops</div>
            <div>❌ Tempted to sell at a loss</div>
          </div>
        </div>

        {/* DCA Card */}
        <div style={{
          padding: '32px',
          background: `linear-gradient(135deg, ${theme.colors.success}15 0%, ${theme.colors.accent}10 100%)`,
          borderRadius: '20px',
          border: `3px solid ${theme.colors.success}50`,
          boxShadow: `0 8px 30px ${theme.colors.success}20`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <span style={{ fontSize: '40px' }}>😌</span>
            <h3 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: theme.colors.success,
              margin: 0
            }}>
              DCA
            </h3>
          </div>

          {/* Strategy Description */}
          <div style={{
            padding: '16px',
            background: theme.colors.background,
            borderRadius: '12px',
            marginBottom: '24px',
            fontSize: '14px',
            color: theme.colors.textSecondary,
            textAlign: 'center'
          }}>
            Invest {formatCurrency(dcaMonthlyAmount)} every month<br />
            for {dcaMonths} months (automated)
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gap: '16px'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '4px' }}>
                Profit
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: dcaTotalProfit >= 0 ? theme.colors.success : theme.colors.error
              }}>
                {formatCurrency(dcaTotalProfit)} ({formatPercent(dcaProfitPercent)})
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '4px' }}>
                Days in Drawdown
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: theme.colors.success
              }}>
                {dcaDaysInDrawdown}
              </div>
            </div>
          </div>

          {/* Positives */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: theme.colors.success + '15',
            borderRadius: '12px',
            fontSize: '13px',
            color: theme.colors.text
          }}>
            <div style={{ marginBottom: '8px' }}>✅ Zero emotional stress</div>
            <div style={{ marginBottom: '8px' }}>✅ Never checked price</div>
            <div style={{ marginBottom: '8px' }}>✅ Automated purchases</div>
            <div>✅ No temptation to sell</div>
          </div>
        </div>
      </div>

      {/* Key Insight */}
      <div style={{
        padding: '40px',
        background: `linear-gradient(135deg, ${theme.colors.accent}20 0%, ${theme.colors.success}15 100%)`,
        borderRadius: '20px',
        border: `3px solid ${theme.colors.accent}50`,
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: theme.colors.text,
          marginBottom: '20px'
        }}>
          The Real Difference
        </div>
        <div style={{
          fontSize: '18px',
          color: theme.colors.textSecondary,
          lineHeight: '1.8',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          It's not about which strategy makes more money.<br />
          It's about <strong style={{ color: theme.colors.text }}>which one you can actually stick to</strong> without suffering through every price movement.
        </div>
        <div style={{
          marginTop: '24px',
          fontSize: '16px',
          fontStyle: 'italic',
          color: theme.colors.textSecondary
        }}>
          DCA removes the emotional barrier that causes most investors to fail.
        </div>
      </div>
    </div>
  );
};
