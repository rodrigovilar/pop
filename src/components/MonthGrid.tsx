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
    // Bull: green gradient (lighter to darker based on ratio)
    const intensity = Math.min(positiveRatio, 1);
    const greenShade = Math.floor(200 + (intensity * 55)); // 200-255
    return {
      backgroundColor: `rgb(${255 - greenShade}, ${greenShade}, ${255 - greenShade})`,
      textColor: intensity > 0.7 ? '#ffffff' : theme.colors.text.primary,
    };
  } else if (negativeRatio > 0.6) {
    // Bear: red gradient
    const intensity = Math.min(negativeRatio, 1);
    const redShade = Math.floor(200 + (intensity * 55));
    return {
      backgroundColor: `rgb(${redShade}, ${255 - redShade}, ${255 - redShade})`,
      textColor: intensity > 0.7 ? '#ffffff' : theme.colors.text.primary,
    };
  } else {
    // Lateral: gray
    return {
      backgroundColor: theme.colors.secondary[200],
      textColor: theme.colors.text.primary,
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
        border: `2px solid ${isHovered ? theme.colors.primary[400] : 'transparent'}`,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        cursor: 'pointer',
        transition: theme.transitions.base,
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        boxShadow: isHovered ? theme.shadows.lg : theme.shadows.sm,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80px',
        position: 'relative',
      }}
    >
      {/* Month/Year Label */}
      <div style={{
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.bold,
        marginBottom: theme.spacing.xs,
      }}>
        {monthLabel}/{year.slice(2)}
      </div>

      {/* Delta % */}
      <div style={{
        fontSize: theme.typography.fontSize.xs,
        fontWeight: theme.typography.fontWeight.semibold,
        opacity: 0.9,
      }}>
        {changeLabel}
      </div>

      {/* Regime indicator (small dot) */}
      <div style={{
        position: 'absolute',
        top: theme.spacing.xs,
        right: theme.spacing.xs,
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: data.month.regime === 'BULL' ? '#10b981' :
                        data.month.regime === 'BEAR' ? '#ef4444' : '#9ca3af',
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
        fontWeight: theme.typography.fontWeight.semibold,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.lg,
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
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
          backgroundColor: theme.colors.background.tertiary,
          borderRadius: theme.borderRadius.xl,
          padding: theme.spacing['2xl'],
          maxWidth: '500px',
          width: '100%',
          boxShadow: theme.shadows.xl,
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
          borderBottom: `2px solid ${theme.colors.secondary[200]}`,
        }}>
          <h3 style={{
            fontSize: theme.typography.fontSize['2xl'],
            fontWeight: theme.typography.fontWeight.bold,
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
              color: theme.colors.text.secondary,
              padding: theme.spacing.xs,
            }}
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
            }}>
              Entry Price
            </div>
            <div style={{
              fontSize: theme.typography.fontSize.xl,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
            }}>
              {formatCurrency(month.entryPrice, month.currency)}
            </div>
          </div>

          <div>
            <div style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              marginBottom: theme.spacing.xs,
            }}>
              Regime
            </div>
            <div style={{
              fontSize: theme.typography.fontSize.xl,
              fontWeight: theme.typography.fontWeight.bold,
              color: month.regime === 'BULL' ? '#10b981' :
                    month.regime === 'BEAR' ? '#ef4444' : theme.colors.text.primary,
            }}>
              {t(`overview.regimes.${month.regime}`)}
            </div>
          </div>

          <div>
            <div style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              marginBottom: theme.spacing.xs,
            }}>
              Days Positive
            </div>
            <div style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semibold,
              color: '#10b981',
            }}>
              {month.daysPositive} / {month.daysTotal}
            </div>
          </div>

          <div>
            <div style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              marginBottom: theme.spacing.xs,
            }}>
              Days Negative
            </div>
            <div style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semibold,
              color: '#ef4444',
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
              }}>
                Change vs Previous Month
              </div>
              <div style={{
                fontSize: theme.typography.fontSize['2xl'],
                fontWeight: theme.typography.fontWeight.bold,
                color: month.pctChangeVsPrevMonthStart >= 0 ? '#10b981' : '#ef4444',
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
