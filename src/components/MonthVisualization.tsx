import { useState } from 'react';
import { MonthAreaChart } from './MonthAreaChart';
import { MonthGrid } from './MonthGrid';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../hooks/useI18n';
import type { MonthlyData } from '../types';

interface MonthVisualizationProps {
  months: MonthlyData[];
  referenceMonth?: string;
  showToggle?: boolean;
}

type ViewMode = 'chart' | 'table';

export const MonthVisualization = ({
  months,
  referenceMonth,
  showToggle = true
}: MonthVisualizationProps) => {
  const theme = useTheme();
  const { t } = useI18n();
  const [viewMode, setViewMode] = useState<ViewMode>('chart');

  const handleMonthClick = (_month: MonthlyData) => {
    // MonthGrid component will handle opening the modal
  };

  return (
    <div style={{
      width: '100%',
      marginTop: '40px'
    }}>
      {/* Toggle buttons */}
      {showToggle && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '30px'
        }}>
          <button
            onClick={() => setViewMode('chart')}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: `2px solid ${viewMode === 'chart' ? theme.colors.accent : theme.colors.text + '30'}`,
              background: viewMode === 'chart' ? theme.colors.accent : 'transparent',
              color: viewMode === 'chart' ? theme.colors.background : theme.colors.text,
              fontSize: '14px',
              fontWeight: viewMode === 'chart' ? 'bold' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (viewMode !== 'chart') {
                e.currentTarget.style.background = theme.colors.text + '10';
              }
            }}
            onMouseLeave={(e) => {
              if (viewMode !== 'chart') {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            📊 {t('narrative.visualization.chartView')}
          </button>

          <button
            onClick={() => setViewMode('table')}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: `2px solid ${viewMode === 'table' ? theme.colors.accent : theme.colors.text + '30'}`,
              background: viewMode === 'table' ? theme.colors.accent : 'transparent',
              color: viewMode === 'table' ? theme.colors.background : theme.colors.text,
              fontSize: '14px',
              fontWeight: viewMode === 'table' ? 'bold' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (viewMode !== 'table') {
                e.currentTarget.style.background = theme.colors.text + '10';
              }
            }}
            onMouseLeave={(e) => {
              if (viewMode !== 'table') {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            📋 {t('narrative.visualization.tableView')}
          </button>
        </div>
      )}

      {/* Chart view */}
      {viewMode === 'chart' && (
        <div style={{
          opacity: 1,
          transform: 'translateY(0)',
          transition: 'all 0.4s ease'
        }}>
          <MonthAreaChart
            data={months}
            referenceMonth={referenceMonth}
            onMonthClick={handleMonthClick}
            height={450}
          />

          {/* Message below chart */}
          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: theme.colors.error + '15',
            border: `2px solid ${theme.colors.error}40`,
            borderRadius: '12px',
            maxWidth: '700px',
            margin: '30px auto 0'
          }}>
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: theme.colors.error,
              marginBottom: '12px',
              textAlign: 'center'
            }}>
              {t('narrative.visualization.message.title')}
            </div>

            <div style={{
              fontSize: '14px',
              color: theme.colors.text,
              lineHeight: '1.6',
              marginBottom: '12px'
            }}>
              <div style={{ marginBottom: '8px' }}>• {t('narrative.visualization.message.point1')}</div>
              <div style={{ marginBottom: '8px' }}>• {t('narrative.visualization.message.point2')}</div>
              <div style={{ marginBottom: '8px' }}>• {t('narrative.visualization.message.point3')}</div>
            </div>

            <div style={{
              fontSize: '14px',
              color: theme.colors.text,
              lineHeight: '1.6',
              marginBottom: '12px',
              paddingLeft: '12px',
              borderLeft: `3px solid ${theme.colors.error}`
            }}>
              {t('narrative.visualization.message.suffering')}
            </div>

            <div style={{
              fontSize: '12px',
              color: theme.colors.textSecondary,
              marginTop: '12px',
              fontStyle: 'italic'
            }}>
              • {t('narrative.visualization.message.emotion1')}<br />
              • {t('narrative.visualization.message.emotion2')}<br />
              • {t('narrative.visualization.message.emotion3')}
            </div>

            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: theme.colors.background,
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: 'bold',
              color: theme.colors.error
            }}>
              {t('narrative.visualization.message.conclusion')}
            </div>
          </div>
        </div>
      )}

      {/* Table view */}
      {viewMode === 'table' && (
        <div style={{
          opacity: 1,
          transform: 'translateY(0)',
          transition: 'all 0.4s ease'
        }}>
          <MonthGrid monthlyData={months} />
        </div>
      )}
    </div>
  );
};
