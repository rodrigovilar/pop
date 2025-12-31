import { useState } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { theme } from '../styles/theme';
import type { MonthlyData } from '../types';

interface MonthGridProps {
  monthlyData: MonthlyData[];
}

interface MonthCellData {
  month: MonthlyData;
  backgroundColor: string;
  textColor: string;
}

function calculateCellColor(data: MonthlyData): { backgroundColor: string; textColor: string } {
  const totalDays = data.daysTotal;
  const positiveRatio = data.daysPositive / totalDays;
  const negativeRatio = data.daysNegative / totalDays;

  // Determine dominant regime
  if (positiveRatio > 0.6) {
    // Bull: Green with opacity based on intensity
    // Dark mode friendly: darker base, higher saturation
    const intensity = Math.min(positiveRatio, 1);
    // Use rgba for transparency on dark bg
    const alpha = 0.3 + (intensity * 0.7); // 0.3 to 1.0
    return {
      backgroundColor: `rgba(16, 185, 129, ${alpha})`, // Emulator styling
      textColor: '#ffffff',
    };
  } else if (negativeRatio > 0.6) {
    // Bear: Red
    const intensity = Math.min(negativeRatio, 1);
    const alpha = 0.3 + (intensity * 0.7);
    return {
      backgroundColor: `rgba(239, 68, 68, ${alpha})`,
      textColor: '#ffffff',
    };
  } else {
    // Lateral: Dark Gray
    return {
      backgroundColor: theme.colors.secondary[800],
      textColor: theme.colors.text.secondary,
    };
  }
}

function MonthCell({ data, onClick }: { data: MonthCellData; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  const pctChange = data.month.pctChangeVsPrevMonthStart;
  const changeLabel = pctChange !== null
    ? `${pctChange >= 0 ? '+' : ''}${pctChange.toFixed(1)}%`
    : 'N/A';

  const [year, month] = data.month.month.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthLabel = monthNames[parseInt(month) - 1];

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: data.backgroundColor,
        color: data.textColor,
        border: `1px solid ${isHovered ? theme.colors.accent[500] : 'transparent'}`,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        cursor: 'pointer',
        transition: theme.transitions.default,
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        boxShadow: isHovered ? theme.shadows.glow : 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80px',
        position: 'relative',
        zIndex: isHovered ? 10 : 1,
      }}
    >
      {/* Month/Year Label */}
      <div style={{
        fontSize: theme.typography.fontSize.xs,
        fontWeight: theme.typography.fontWeight.bold,
        marginBottom: theme.spacing.xs,
        fontFamily: theme.typography.fontFamily.mono,
        textTransform: 'uppercase',
      }}>
        {monthLabel}/{year.slice(2)}
      </div>

      {/* Delta % */}
      <div style={{
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.bold,
        opacity: 0.9,
      }}>
        {changeLabel}
      </div>

      {/* Regime indicator (small dot) */}
      <div style={{
        position: 'absolute',
        top: theme.spacing.xs,
        right: theme.spacing.xs,
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: data.month.regime === 'BULL' ? theme.colors.status.success :
          data.month.regime === 'BEAR' ? theme.colors.status.error : theme.colors.secondary[500],
      }} />
    </button>
  );
}

export function MonthGrid({ monthlyData }: MonthGridProps) {
  const { t } = useI18n();
  const [selectedMonth, setSelectedMonth] = useState<MonthlyData | null>(null);

  // Calculate cell colors
  const cellsData: MonthCellData[] = monthlyData.map(month => ({
    month,
    ...calculateCellColor(month),
  }));

  return (
    <div>
      <h2 style={{
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.lg,
        fontFamily: theme.typography.fontFamily.display,
      }}>
        {t('main.monthlyProgression')}
      </h2>

      {/* Grid: 12 columns (12 months per row) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: theme.spacing.sm,
        maxHeight: '400px', // 4 rows + some padding
        overflowY: 'auto',
        padding: theme.spacing.xs,
      }}>
        {cellsData.map((cellData) => (
          <MonthCell
            key={cellData.month.month}
            data={cellData}
            onClick={() => setSelectedMonth(cellData.month)}
          />
        ))}
      </div>

      {/* Modal for month details */}
      {selectedMonth && (
        <MonthDetailModal
          month={selectedMonth}
          onClose={() => setSelectedMonth(null)}
        />
      )}
    </div>
  );
}

// Month Detail Modal
function MonthDetailModal({ month, onClose }: { month: MonthlyData; onClose: () => void }) {
  const { t, formatCurrency, formatDate } = useI18n();

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: theme.colors.background.overlay,
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: theme.spacing.xl,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: theme.colors.background.secondary,
          borderRadius: theme.borderRadius.xl,
          padding: theme.spacing['2xl'],
          maxWidth: '500px',
          width: '100%',
          boxShadow: theme.shadows.xl,
          border: `1px solid ${theme.colors.secondary[700]}`,
          animation: 'slideIn 0.2s ease-out',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: theme.spacing.xl,
          paddingBottom: theme.spacing.lg,
          borderBottom: `1px solid ${theme.colors.secondary[700]}`,
        }}>
          <h3 style={{
            fontSize: theme.typography.fontSize['2xl'],
            fontWeight: theme.typography.fontWeight.bold,
            fontFamily: theme.typography.fontFamily.display,
            color: theme.colors.text.primary,
            margin: 0,
          }}>
            {formatDate(new Date(month.entryDate), { year: 'numeric', month: 'long' })}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: theme.typography.fontSize['2xl'],
              cursor: 'pointer',
              color: theme.colors.text.tertiary,
              padding: theme.spacing.xs,
              transition: theme.transitions.default,
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.text.primary}
            onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.text.tertiary}
          >
            ×
          </button>
        </div>

        {/* Details Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: theme.spacing.lg,
        }}>
          <div>
            <div style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              marginBottom: theme.spacing.xs,
              textTransform: 'uppercase',
            }}>
              Entry Price
            </div>
            <div style={{
              fontSize: theme.typography.fontSize.xl,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
              fontFamily: theme.typography.fontFamily.mono,
            }}>
              {formatCurrency(month.entryPrice, month.currency)}
            </div>
          </div>

          <div>
            <div style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              marginBottom: theme.spacing.xs,
              textTransform: 'uppercase',
            }}>
              Regime
            </div>
            <div style={{
              fontSize: theme.typography.fontSize.xl,
              fontWeight: theme.typography.fontWeight.bold,
              color: month.regime === 'BULL' ? theme.colors.status.success :
                month.regime === 'BEAR' ? theme.colors.status.error : theme.colors.text.primary,
            }}>
              {t(`overview.regimes.${month.regime}`)}
            </div>
          </div>

          <div>
            <div style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              marginBottom: theme.spacing.xs,
              textTransform: 'uppercase',
            }}>
              Days Positive
            </div>
            <div style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.status.success,
              fontFamily: theme.typography.fontFamily.mono,
            }}>
              {month.daysPositive} / {month.daysTotal}
            </div>
          </div>

          <div>
            <div style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              marginBottom: theme.spacing.xs,
              textTransform: 'uppercase',
            }}>
              Days Negative
            </div>
            <div style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.status.error,
              fontFamily: theme.typography.fontFamily.mono,
            }}>
              {month.daysNegative} / {month.daysTotal}
            </div>
          </div>

          {month.pctChangeVsPrevMonthStart !== null && (
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing.xs,
                textTransform: 'uppercase',
              }}>
                Change vs Previous Month
              </div>
              <div style={{
                fontSize: theme.typography.fontSize['2xl'],
                fontWeight: theme.typography.fontWeight.bold,
                color: month.pctChangeVsPrevMonthStart >= 0 ? theme.colors.status.success : theme.colors.status.error,
                fontFamily: theme.typography.fontFamily.mono,
              }}>
                {month.pctChangeVsPrevMonthStart >= 0 ? '+' : ''}{month.pctChangeVsPrevMonthStart.toFixed(2)}%
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
