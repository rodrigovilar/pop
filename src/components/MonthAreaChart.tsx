import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../hooks/useI18n';
import type { MonthlyData } from '../types';

interface MonthAreaChartProps {
  data: MonthlyData[];
  referenceMonth?: string; // Month to highlight (e.g., "2022-01")
  onMonthClick?: (month: MonthlyData) => void;
  height?: number;
}

interface ChartDataPoint {
  month: string;
  monthLabel: string;
  positivePercent: number;
  negativePercent: number;
  lateralPercent: number;
  fullData: MonthlyData;
}

export const MonthAreaChart = ({
  data,
  referenceMonth,
  onMonthClick,
  height = 400
}: MonthAreaChartProps) => {
  const theme = useTheme();
  const { t } = useI18n();

  // Transform data for stacked area chart
  const chartData: ChartDataPoint[] = useMemo(() => {
    return data.map((monthData) => {
      const total = monthData.daysTotal || 1; // Avoid division by zero
      const daysLateral = total - monthData.daysPositive - monthData.daysNegative;

      return {
        month: monthData.month,
        monthLabel: formatMonthLabel(monthData.month),
        positivePercent: (monthData.daysPositive / total) * 100,
        negativePercent: (monthData.daysNegative / total) * 100,
        lateralPercent: (daysLateral / total) * 100,
        fullData: monthData
      };
    });
  }, [data]);

  // Find reference month index for annotation
  const referenceIndex = useMemo(() => {
    if (!referenceMonth) return -1;
    return chartData.findIndex(d => d.month === referenceMonth);
  }, [chartData, referenceMonth]);

  const handleBarClick = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const point: ChartDataPoint = data.activePayload[0].payload;
      onMonthClick?.(point.fullData);
    }
  };

  return (
    <div style={{
      width: '100%',
      height,
      background: theme.colors.background,
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          onClick={handleBarClick}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme.colors.text + '20'}
          />

          <XAxis
            dataKey="monthLabel"
            stroke={theme.colors.text}
            tick={{ fill: theme.colors.text, fontSize: 11 }}
            interval="preserveStartEnd"
          />

          <YAxis
            stroke={theme.colors.text}
            tick={{ fill: theme.colors.text }}
            label={{
              value: '% of days',
              angle: -90,
              position: 'insideLeft',
              fill: theme.colors.text
            }}
          />

          <Tooltip
            content={<CustomTooltip theme={theme} />}
            cursor={{ fill: theme.colors.text + '10' }}
          />

          {/* Reference line for the starting month */}
          {referenceIndex >= 0 && (
            <ReferenceLine
              x={chartData[referenceIndex].monthLabel}
              stroke={theme.colors.accent}
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{
                value: t('narrative.visualization.referenceLabel') || 'You started here',
                position: 'top',
                fill: theme.colors.accent,
                fontSize: 12,
                fontWeight: 'bold'
              }}
            />
          )}

          {/* Stacked areas - order matters (bottom to top) */}
          <Area
            type="monotone"
            dataKey="positivePercent"
            stackId="1"
            stroke={theme.colors.success}
            fill={theme.colors.success}
            fillOpacity={0.6}
            name="Positive Days"
          />

          <Area
            type="monotone"
            dataKey="lateralPercent"
            stackId="1"
            stroke={theme.colors.text + '40'}
            fill={theme.colors.text + '30'}
            fillOpacity={0.4}
            name="Lateral Days"
          />

          <Area
            type="monotone"
            dataKey="negativePercent"
            stackId="1"
            stroke={theme.colors.error}
            fill={theme.colors.error}
            fillOpacity={0.6}
            name="Negative Days"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Chart legend */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginTop: '10px',
        fontSize: '12px',
        color: theme.colors.text
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            background: theme.colors.success,
            borderRadius: '2px'
          }} />
          <span>Positive Days</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            background: theme.colors.error,
            borderRadius: '2px'
          }} />
          <span>Negative Days</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            background: theme.colors.text + '30',
            borderRadius: '2px'
          }} />
          <span>Lateral Days</span>
        </div>
      </div>

      {/* Hint text */}
      <div style={{
        textAlign: 'center',
        marginTop: '10px',
        fontSize: '11px',
        color: theme.colors.textSecondary,
        opacity: 0.7
      }}>
        {t('narrative.visualization.clickHint')}
      </div>
    </div>
  );
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, theme }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data: ChartDataPoint = payload[0].payload;
  const monthData = data.fullData;

  return (
    <div style={{
      background: theme.colors.surface,
      border: `1px solid ${theme.colors.text}30`,
      borderRadius: '8px',
      padding: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      minWidth: '200px'
    }}>
      <div style={{
        fontWeight: 'bold',
        marginBottom: '8px',
        color: theme.colors.text,
        borderBottom: `1px solid ${theme.colors.text}20`,
        paddingBottom: '6px'
      }}>
        {formatMonthLabel(data.month)}
      </div>

      <div style={{ fontSize: '12px', color: theme.colors.text }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '4px' }}>
          <span style={{ color: theme.colors.success }}>Positive:</span>
          <strong>{monthData.daysPositive} days ({data.positivePercent.toFixed(1)}%)</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '4px' }}>
          <span style={{ color: theme.colors.error }}>Negative:</span>
          <strong>{monthData.daysNegative} days ({data.negativePercent.toFixed(1)}%)</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
          <span style={{ color: theme.colors.textSecondary }}>Lateral:</span>
          <strong>{Math.max(0, monthData.daysTotal - monthData.daysPositive - monthData.daysNegative)} days ({data.lateralPercent.toFixed(1)}%)</strong>
        </div>

        <div style={{
          borderTop: `1px solid ${theme.colors.text}20`,
          paddingTop: '6px',
          marginTop: '6px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '4px' }}>
            <span>Month Change:</span>
            <strong style={{
              color: (monthData.pctChangeVsPrevMonthStart ?? 0) >= 0
                ? theme.colors.success
                : theme.colors.error
            }}>
              {monthData.pctChangeVsPrevMonthStart != null
                ? `${monthData.pctChangeVsPrevMonthStart >= 0 ? '+' : ''}${monthData.pctChangeVsPrevMonthStart.toFixed(1)}%`
                : 'N/A'}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
            <span>Regime:</span>
            <strong style={{
              color: monthData.regime === 'BULL'
                ? theme.colors.success
                : monthData.regime === 'BEAR'
                  ? theme.colors.error
                  : theme.colors.textSecondary
            }}>
              {monthData.regime}
            </strong>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '8px',
        fontSize: '10px',
        color: theme.colors.textSecondary,
        fontStyle: 'italic',
        textAlign: 'center'
      }}>
        Click to see full details
      </div>
    </div>
  );
};

// Helper function to format month labels
function formatMonthLabel(month: string): string {
  const [year, monthNum] = month.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(monthNum) - 1]} '${year.slice(2)}`;
}
