import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import type { MonthlyData } from '../types';

interface MonthCardProps {
  month: MonthlyData;
}

export const MonthCard = ({ month }: MonthCardProps) => {
  const theme = useTheme();
  const [flipped, setFlipped] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: month.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatMonthYear = (monthStr: string) => {
    const [year, monthNum] = monthStr.split('-');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[parseInt(monthNum) - 1]} ${year}`;
  };

  const daysLateral = month.daysTotal - month.daysPositive - month.daysNegative;
  const monthChange = month.pctChangeVsPrevMonthStart || 0;

  const regimeColor = month.regime === 'BULL' ? theme.colors.success
                    : month.regime === 'BEAR' ? theme.colors.error
                    : theme.colors.textSecondary;

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      style={{
        width: '100%',
        maxWidth: '400px',
        height: '450px',
        perspective: '1000px',
        cursor: 'pointer'
      }}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        transition: 'transform 0.6s',
        transformStyle: 'preserve-3d',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
      }}>
        {/* Front Side */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          padding: '24px',
          background: theme.colors.surface,
          borderRadius: '16px',
          border: `2px solid ${regimeColor}40`,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            {formatMonthYear(month.month)}
          </h3>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px'
          }}>
            <div style={{
              padding: '12px',
              background: theme.colors.success + '15',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.colors.success }}>
                {month.daysPositive}
              </div>
              <div style={{ fontSize: '10px', color: theme.colors.textSecondary, marginTop: '4px' }}>
                Positive Days
              </div>
              <div style={{ fontSize: '12px', color: theme.colors.text, marginTop: '2px' }}>
                {((month.daysPositive / month.daysTotal) * 100).toFixed(1)}%
              </div>
            </div>

            <div style={{
              padding: '12px',
              background: theme.colors.error + '15',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.colors.error }}>
                {month.daysNegative}
              </div>
              <div style={{ fontSize: '10px', color: theme.colors.textSecondary, marginTop: '4px' }}>
                Negative Days
              </div>
              <div style={{ fontSize: '12px', color: theme.colors.text, marginTop: '2px' }}>
                {((month.daysNegative / month.daysTotal) * 100).toFixed(1)}%
              </div>
            </div>

            <div style={{
              padding: '12px',
              background: theme.colors.text + '10',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.colors.text }}>
                {daysLateral}
              </div>
              <div style={{ fontSize: '10px', color: theme.colors.textSecondary, marginTop: '4px' }}>
                Lateral Days
              </div>
              <div style={{ fontSize: '12px', color: theme.colors.text, marginTop: '2px' }}>
                {((daysLateral / month.daysTotal) * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Total Days */}
          <div style={{
            padding: '12px',
            background: theme.colors.background,
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '14px', color: theme.colors.textSecondary }}>
              Total Days
            </div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: theme.colors.text }}>
              {month.daysTotal}
            </div>
          </div>

          {/* Regime Badge */}
          <div style={{
            padding: '16px',
            background: regimeColor + '15',
            border: `2px solid ${regimeColor}40`,
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '4px' }}>
              Regime
            </div>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: regimeColor
            }}>
              {month.regime}
            </div>
          </div>

          {/* Click hint */}
          <div style={{
            fontSize: '12px',
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginTop: 'auto',
            opacity: 0.7
          }}>
            Click for details →
          </div>
        </div>

        {/* Back Side */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          padding: '24px',
          background: theme.colors.surface,
          borderRadius: '16px',
          border: `2px solid ${regimeColor}40`,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            Price Details
          </h3>

          <div style={{
            padding: '12px',
            background: theme.colors.background,
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '11px', color: theme.colors.textSecondary, marginBottom: '4px' }}>
              Entry Price ({formatDate(month.entryDate)})
            </div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: theme.colors.text }}>
              {formatCurrency(month.entryPrice)}
            </div>
          </div>

          {month.exitPrice && (
            <div style={{
              padding: '12px',
              background: theme.colors.background,
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '11px', color: theme.colors.textSecondary, marginBottom: '4px' }}>
                Exit Price ({month.exitDate ? formatDate(month.exitDate) : 'End of month'})
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: theme.colors.text }}>
                {formatCurrency(month.exitPrice)}
              </div>
            </div>
          )}

          <div style={{
            padding: '16px',
            background: monthChange >= 0 ? theme.colors.success + '15' : theme.colors.error + '15',
            border: `2px solid ${monthChange >= 0 ? theme.colors.success : theme.colors.error}40`,
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '11px', color: theme.colors.textSecondary, marginBottom: '4px' }}>
              Month Change
            </div>
            <div style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: monthChange >= 0 ? theme.colors.success : theme.colors.error
            }}>
              {monthChange >= 0 ? '+' : ''}{monthChange.toFixed(1)}%
            </div>
          </div>

          {/* Click hint */}
          <div style={{
            fontSize: '12px',
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginTop: 'auto',
            opacity: 0.7
          }}>
            ← Click to flip back
          </div>
        </div>
      </div>
    </div>
  );
};
