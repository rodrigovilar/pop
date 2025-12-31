import { useState } from 'react';
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

function MonthCard({ month, colorData }: { month: MonthlyData; colorData: { backgroundColor: string; textColor: string } }) {
  const [flipped, setFlipped] = useState(false);
  const { formatCurrency } = useI18n();

  const pctChange = month.pctChangeVsPrevMonthStart;
  const changeLabel = pctChange !== null
    ? `${pctChange >= 0 ? '+' : ''}${pctChange.toFixed(1)}%`
    : 'N/A';

  // Safe Date Parsing for Label (avoids timezone shifts)
  const [year, monthNum] = month.month.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthLabel = monthNames[parseInt(monthNum) - 1];

  const chartData = [
    { label: 'Bull', value: month.daysPositive, color: theme.colors.status.success },
    { label: 'Bear', value: month.daysNegative, color: theme.colors.status.error },
    { label: 'Lateral', value: month.daysTotal - month.daysPositive - month.daysNegative, color: theme.colors.secondary[500] },
  ].filter(d => d.value > 0);

  return (
    <div
      style={{
        perspective: '1000px',
        width: '100%',
        height: '110px', // Fixed height
        cursor: 'pointer',
      }}
      onClick={() => setFlipped(!flipped)}
      onMouseLeave={() => setFlipped(false)} // Auto flip back on mouse leave
    >
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        textAlign: 'center',
        transition: 'transform 0.6s',
        transformStyle: 'preserve-3d',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}>
        {/* FRONT */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          backgroundColor: colorData.backgroundColor,
          color: colorData.textColor,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.xs,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: theme.shadows.md,
          border: `1px solid rgba(255,255,255,0.05)`,
        }}>
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

          {/* Regime indicator (small dot) */}
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: month.regime === 'BULL' ? theme.colors.status.success :
              month.regime === 'BEAR' ? theme.colors.status.error : theme.colors.secondary[500],
            boxShadow: '0 0 5px rgba(0,0,0,0.5)',
          }} />
        </div>

        {/* BACK */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          backgroundColor: theme.colors.background.secondary,
          borderRadius: theme.borderRadius.md,
          border: `1px solid ${theme.colors.secondary[700]}`,
          boxShadow: theme.shadows.glow, // Glow effect on interaction
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <div style={{ transform: 'scale(0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DonutChart data={chartData} size={80} thickness={18} />
          </div>

          <div style={{
            position: 'absolute',
            bottom: '6px',
            width: '100%',
            textAlign: 'center',
            fontSize: '11px',
            fontWeight: 'bold',
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.mono,
            letterSpacing: '-0.02em',
          }}>
            {formatCurrency(month.entryPrice, month.currency).split('.')[0]}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MonthGrid({ monthlyData }: MonthGridProps) {
  const { t } = useI18n();

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

      {/* Grid: 6 columns, requested by user */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: theme.spacing.md,
      }}>
        {cellsData.map((cellData) => (
          <MonthCard
            key={cellData.month.month}
            month={cellData.month}
            colorData={cellData}
          />
        ))}
      </div>
    </div>
  );
}
