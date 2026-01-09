import { useState, useEffect } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { theme } from '../styles/theme';
import type { MonthlyData } from '../types';
import { PieChart } from './PieChart';

interface MonthGridProps {
  monthlyData: MonthlyData[];
}

interface MonthCellData {
  month: MonthlyData;
  backgroundColor: string;
  textColor: string;
}

function calculateCellColor(data: MonthlyData): { backgroundColor: string; textColor: string } {
  // Calculate proportion of bull/bear/lateral days
  const totalDays = data.daysTotal;
  const daysLateral = totalDays - data.daysPositive - data.daysNegative;

  const bullRatio = data.daysPositive / totalDays;
  const bearRatio = data.daysNegative / totalDays;
  const lateralRatio = daysLateral / totalDays;

  // Define RGB colors for each type (lateral is transparent/white)
  const bullColor = { r: 16, g: 185, b: 129 };    // Green
  const bearColor = { r: 239, g: 68, b: 68 };     // Red
  const lateralColor = { r: 255, g: 255, b: 255 }; // White (transparent effect)

  // Mix colors based on proportions
  const r = Math.round(bullColor.r * bullRatio + bearColor.r * bearRatio + lateralColor.r * lateralRatio);
  const g = Math.round(bullColor.g * bullRatio + bearColor.g * bearRatio + lateralColor.g * lateralRatio);
  const b = Math.round(bullColor.b * bullRatio + bearColor.b * bearRatio + lateralColor.b * lateralRatio);

  // Determine dominant type for text color
  const maxRatio = Math.max(bullRatio, bearRatio, lateralRatio);
  const textColor = maxRatio === lateralRatio ? theme.colors.text.primary : '#ffffff';

  return {
    backgroundColor: `rgb(${r}, ${g}, ${b})`,
    textColor,
  };
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
        border: `1px solid ${isHovered ? theme.colors.border.strong : theme.colors.border.subtle}`,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        cursor: 'pointer',
        transition: theme.transitions.smooth,
        transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isHovered ? theme.shadows.xl : theme.shadows.sm,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '120px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle gradient overlay on hover */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: isHovered
          ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)'
          : 'transparent',
        transition: theme.transitions.smooth,
        pointerEvents: 'none',
      }} />

      {/* Click indicator on hover */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          bottom: theme.spacing.xs,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '0.625rem',
          opacity: 0.6,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontWeight: theme.typography.fontWeight.medium,
          animation: 'fadeIn 0.2s ease-out',
          zIndex: 2,
        }}>
          👆 Click for details
        </div>
      )}

      {/* Month/Year Label */}
      <div style={{
        fontSize: theme.typography.fontSize.xs,
        fontWeight: theme.typography.fontWeight.bold,
        marginBottom: theme.spacing.xs,
        fontFamily: theme.typography.fontFamily.mono,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        opacity: 0.85,
        position: 'relative',
        zIndex: 1,
      }}>
        {monthLabel}/{year.slice(2)}
      </div>

      {/* Delta % */}
      <div style={{
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.extrabold,
        letterSpacing: '-0.02em',
        position: 'relative',
        zIndex: 1,
      }}>
        {changeLabel}
      </div>

      {/* Within-month price change indicator (refined dot) */}
      <div style={{
        position: 'absolute',
        top: theme.spacing.sm,
        right: theme.spacing.sm,
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: pctChange > 0 ? theme.colors.status.success :
          pctChange < 0 ? theme.colors.status.error : theme.colors.secondary[500],
        boxShadow: pctChange !== 0
          ? `0 0 8px ${pctChange > 0 ? theme.colors.status.success : theme.colors.status.error}`
          : 'none',
        transition: theme.transitions.fast,
        transform: isHovered ? 'scale(1.2)' : 'scale(1)',
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
    { label: t('overview.regimes.LATERAL'), value: month.daysTotal - month.daysPositive - month.daysNegative, color: theme.colors.text.quaternary },
  ].filter(d => d.value > 0);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: theme.spacing.xl,
        backdropFilter: 'blur(12px)',
        animation: 'fadeIn 0.2s ease-out',
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
            padding: theme.spacing['3xl'],
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: theme.shadows['2xl'],
            border: `1px solid ${theme.colors.border.light}`,
          }}>
            {/* Close button - FRONT */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              style={{
                position: 'absolute',
                top: theme.spacing.lg,
                right: theme.spacing.lg,
                background: theme.colors.background.overlayLight,
                border: `1px solid ${theme.colors.border.medium}`,
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '24px',
                cursor: 'pointer',
                color: colorData.textColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: theme.transitions.fast,
                zIndex: 10,
                backdropFilter: 'blur(8px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.colors.background.overlay;
                e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = theme.colors.background.overlayLight;
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
              }}
            >
              ×
            </button>

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
              backgroundColor: 'rgba(255,255,255,0.25)',
              borderRadius: theme.borderRadius.full,
              marginBottom: theme.spacing.xl,
              border: `1px solid rgba(255,255,255,0.4)`,
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
            border: `1px solid ${theme.colors.border.medium}`,
            boxShadow: theme.shadows.elevatedCard,
            padding: theme.spacing['2xl'],
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {/* Close button - BACK */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              style={{
                position: 'absolute',
                top: theme.spacing.lg,
                right: theme.spacing.lg,
                background: theme.colors.background.tertiary,
                border: `1px solid ${theme.colors.border.medium}`,
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '24px',
                cursor: 'pointer',
                color: theme.colors.text.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: theme.transitions.fast,
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.colors.background.elevated;
                e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = theme.colors.background.tertiary;
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
              }}
            >
              ×
            </button>

            {/* Header */}
            <div style={{
              marginBottom: theme.spacing.md,
              textAlign: 'center',
            }}>
              <h3 style={{
                fontSize: theme.typography.fontSize.xl,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                margin: 0,
                fontFamily: theme.typography.fontFamily.display,
              }}>
                {monthLabel} {year}
              </h3>
            </div>

            {/* Pie Chart */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: theme.spacing.md,
            }}>
              <PieChart data={chartData} size={140} />
            </div>

            {/* Price Change Summary */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: theme.spacing.md,
              marginBottom: theme.spacing.md,
              padding: theme.spacing.md,
              backgroundColor: theme.colors.background.elevated,
              border: `1px solid ${theme.colors.border.light}`,
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
                  fontSize: theme.typography.fontSize.xl,
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
              marginBottom: theme.spacing.md,
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
                  {t('overview.daysLateral') || 'Days Lateral'}
                </div>
                <div style={{
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.text.secondary,
                }}>
                  {month.daysTotal - month.daysPositive - month.daysNegative}
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
    <>
      <style>{`
        .month-grid-container h2 {
          font-size: ${theme.typography.fontSize.xl};
          font-weight: ${theme.typography.fontWeight.bold};
          color: ${theme.colors.text.primary};
          margin-bottom: ${theme.spacing.lg};
          font-family: ${theme.typography.fontFamily.display};
        }

        .month-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: ${theme.spacing.md};
        }

        @media (max-width: 1439px) {
          .month-grid {
            grid-template-columns: repeat(10, 1fr);
          }
        }

        @media (max-width: 1279px) {
          .month-grid {
            grid-template-columns: repeat(8, 1fr);
          }
        }

        @media (max-width: 1023px) {
          .month-grid {
            grid-template-columns: repeat(6, 1fr);
            gap: ${theme.spacing.sm};
          }
        }

        @media (max-width: 767px) {
          .month-grid-container h2 {
            font-size: ${theme.typography.fontSize.lg};
            margin-bottom: ${theme.spacing.md};
          }

          .month-grid {
            grid-template-columns: repeat(6, 1fr);
            gap: ${theme.spacing.xs};
          }
        }

        @media (max-width: 479px) {
          .month-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="month-grid-container">
        <h2>
          {t('main.monthlyProgression')}
        </h2>

        {/* Responsive Grid: 6 cols on desktop, 4 on large tablets, 3 on tablets, 2 on mobile, 1 on small mobile */}
        <div className="month-grid">
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
    </>
  );
}
