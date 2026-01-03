import { useState, useEffect } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { theme } from '../styles/theme';
import type { MonthlyData } from '../types';
import { DonutChart } from './DonutChart';

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
    const intensity = Math.min(positiveRatio, 1);
    const alpha = 0.3 + (intensity * 0.7);
    return {
      backgroundColor: `rgba(16, 185, 129, ${alpha})`,
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
  const { t } = useI18n();

  // Use within-month change (with fallback for old data)
  const pctChange = data.month.pctChangeWithinMonth ?? 0;
  const changeLabel = `${pctChange >= 0 ? '+' : ''}${pctChange.toFixed(1)}%`;

  // Safe Date Parsing for Label (avoids timezone shifts)
  const [year, monthNum] = data.month.month.split('-');
  const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const monthLabel = t(`common.monthsShort.${monthKeys[parseInt(monthNum) - 1]}`);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: data.backgroundColor,
        color: data.textColor,
        border: `1px solid ${isHovered ? theme.colors.primary[400] : 'rgba(255,255,255,0.05)'}`,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.xs,
        cursor: 'pointer',
        transition: theme.transitions.base,
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        boxShadow: isHovered ? theme.shadows.lg : theme.shadows.md,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '110px',
        position: 'relative',
      }}
    >
      {/* Month/Year Label */}
      <div style={{
        fontSize: theme.typography.fontSize.xs,
        fontWeight: theme.typography.fontWeight.bold,
        marginBottom: '4px',
        fontFamily: theme.typography.fontFamily.mono,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        opacity: 0.9,
      }}>
        {monthLabel}/{year.slice(2)}
      </div>

      {/* Delta % */}
      <div style={{
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.extrabold,
        letterSpacing: '-0.02em',
      }}>
        {changeLabel}
      </div>

      {/* Within-month price change indicator (small dot) */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: pctChange > 0 ? theme.colors.status.success :
          pctChange < 0 ? theme.colors.status.error : theme.colors.secondary[500],
        boxShadow: '0 0 5px rgba(0,0,0,0.5)',
      }} />
    </button>
  );
}

function MonthDetailModal({ month, colorData, onClose }: { month: MonthlyData; colorData: { backgroundColor: string; textColor: string }; onClose: () => void }) {
  const { t, formatCurrency } = useI18n();
  const [flipped, setFlipped] = useState(false);

  // Auto-flip after a short delay to show the animation
  useEffect(() => {
    const timer = setTimeout(() => setFlipped(true), 600);
    return () => clearTimeout(timer);
  }, []);

  // Use within-month change for the modal (with fallback for old data)
  const pctChange = month.pctChangeWithinMonth ?? 0;
  const changeLabel = `${pctChange >= 0 ? '+' : ''}${pctChange.toFixed(1)}%`;

  const [year, monthNum] = month.month.split('-');
  const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const monthLabel = t(`common.monthsShort.${monthKeys[parseInt(monthNum) - 1]}`);

  const chartData = [
    { label: t('overview.regimes.BULL'), value: month.daysPositive, color: theme.colors.status.success },
    { label: t('overview.regimes.BEAR'), value: month.daysNegative, color: theme.colors.status.error },
    { label: t('overview.regimes.LATERAL'), value: month.daysTotal - month.daysPositive - month.daysNegative, color: theme.colors.secondary[500] },
  ].filter(d => d.value > 0);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: theme.spacing.xl,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          perspective: '2000px',
          width: '100%',
          maxWidth: '600px',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: theme.spacing.xl,
            right: theme.spacing.xl,
            background: 'rgba(0, 0, 0, 0.5)',
            border: `1px solid ${theme.colors.secondary[600]}`,
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '24px',
            cursor: 'pointer',
            color: theme.colors.text.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: theme.transitions.base,
            zIndex: 1001,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = theme.colors.secondary[700];
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ×
        </button>

        {/* Flip Card Container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '500px',
            textAlign: 'center',
            transition: 'transform 0.8s',
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            cursor: 'pointer',
          }}
          onClick={() => setFlipped(!flipped)}
        >
          {/* FRONT - Basic Info */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            backgroundColor: colorData.backgroundColor,
            color: colorData.textColor,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing['2xl'],
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: theme.shadows.xl,
            border: `1px solid rgba(255,255,255,0.1)`,
          }}>
            {/* Month/Year */}
            <div style={{
              fontSize: theme.typography.fontSize['4xl'],
              fontWeight: theme.typography.fontWeight.bold,
              marginBottom: theme.spacing.xl,
              fontFamily: theme.typography.fontFamily.display,
            }}>
              {(() => {
                // Safe date parsing to avoid timezone issues
                const [year, monthNum] = month.month.split('-');
                const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
                const monthName = t(`common.monthsLong.${monthKeys[parseInt(monthNum) - 1]}`);
                return `${monthName} ${year}`;
              })()}
            </div>

            {/* Delta % */}
            <div style={{
              fontSize: '72px',
              fontWeight: theme.typography.fontWeight.extrabold,
              letterSpacing: '-0.02em',
              marginBottom: theme.spacing.lg,
            }}>
              {changeLabel}
            </div>

            {/* Regime Badge */}
            <div style={{
              fontSize: theme.typography.fontSize.xl,
              fontWeight: theme.typography.fontWeight.semibold,
              padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: theme.borderRadius.full,
              marginBottom: theme.spacing.xl,
            }}>
              {t(`overview.regimes.${month.regime}`)}
            </div>

            {/* Click to flip hint */}
            <div style={{
              fontSize: theme.typography.fontSize.sm,
              opacity: 0.7,
              marginTop: 'auto',
            }}>
              {t('main.clickToFlip') || 'Click to see details →'}
            </div>
          </div>

          {/* BACK - Detailed Info */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            backgroundColor: theme.colors.background.secondary,
            borderRadius: theme.borderRadius.xl,
            border: `1px solid ${theme.colors.secondary[700]}`,
            boxShadow: theme.shadows.glow,
            padding: theme.spacing['2xl'],
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
          }}>
            {/* Header */}
            <div style={{
              marginBottom: theme.spacing.xl,
              textAlign: 'center',
            }}>
              <h3 style={{
                fontSize: theme.typography.fontSize['2xl'],
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                margin: 0,
                fontFamily: theme.typography.fontFamily.display,
              }}>
                {monthLabel} {year}
              </h3>
            </div>

            {/* Donut Chart */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: theme.spacing.xl,
            }}>
              <DonutChart data={chartData} size={180} thickness={35} />
            </div>

            {/* Price Change Summary */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: theme.spacing.lg,
              marginBottom: theme.spacing.xl,
              padding: theme.spacing.lg,
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: theme.borderRadius.md,
            }}>
              <div>
                <div style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.xs,
                }}>
                  {t('overview.entryPrice') || 'Entry Price'}
                </div>
                <div style={{
                  fontSize: theme.typography.fontSize.lg,
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
                }}>
                  {t('overview.exitPrice') || 'Exit Price'}
                </div>
                <div style={{
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                  fontFamily: theme.typography.fontFamily.mono,
                }}>
                  {formatCurrency(month.exitPrice ?? month.entryPrice, month.currency)}
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.xs,
                }}>
                  {t('overview.monthChange') || 'Month Change'}
                </div>
                <div style={{
                  fontSize: theme.typography.fontSize['2xl'],
                  fontWeight: theme.typography.fontWeight.extrabold,
                  color: pctChange >= 0 ? theme.colors.status.success : theme.colors.status.error,
                }}>
                  {changeLabel}
                </div>
              </div>
            </div>

            {/* Days Breakdown */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: theme.spacing.md,
              marginBottom: theme.spacing.lg,
            }}>
              <div>
                <div style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.xs,
                }}>
                  {t('overview.daysPositive') || 'Days Positive'}
                </div>
                <div style={{
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.status.success,
                }}>
                  {month.daysPositive}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.xs,
                }}>
                  {t('overview.daysNegative') || 'Days Negative'}
                </div>
                <div style={{
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.status.error,
                }}>
                  {month.daysNegative}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.xs,
                }}>
                  {t('overview.totalDays') || 'Total Days'}
                </div>
                <div style={{
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                }}>
                  {month.daysTotal}
                </div>
              </div>
            </div>

            {/* Click to flip back hint */}
            <div style={{
              fontSize: theme.typography.fontSize.sm,
              opacity: 0.7,
              textAlign: 'center',
              marginTop: 'auto',
              color: theme.colors.text.secondary,
            }}>
              {t('main.clickToFlipBack') || '← Click to flip back'}
            </div>
          </div>
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

export function MonthGrid({ monthlyData }: MonthGridProps) {
  const { t } = useI18n();
  const [selectedMonth, setSelectedMonth] = useState<MonthlyData | null>(null);

  // Calculate cell colors
  const cellsData: MonthCellData[] = monthlyData.map(month => ({
    month,
    ...calculateCellColor(month),
  }));

  // Find color data for selected month
  const selectedColorData = selectedMonth
    ? cellsData.find(cd => cd.month.month === selectedMonth.month)
    : null;

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

      {/* Grid: 6 columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: theme.spacing.md,
      }}>
        {cellsData.map((cellData) => (
          <MonthCell
            key={cellData.month.month}
            data={cellData}
            onClick={() => setSelectedMonth(cellData.month)}
          />
        ))}
      </div>

      {/* Modal for month details with flip animation */}
      {selectedMonth && selectedColorData && (
        <MonthDetailModal
          month={selectedMonth}
          colorData={selectedColorData}
          onClose={() => setSelectedMonth(null)}
        />
      )}
    </div>
  );
}
