import { useState } from 'react';
import { Manifesto } from './Manifesto';
import { MonthOverview } from './MonthOverview';
import { useI18n } from '../contexts/I18nContext';
import { theme } from '../styles/theme';
import type { MonthlyData } from '../types';

interface OverviewProps {
  monthlyData: Map<string, MonthlyData>;
}

export function Overview({ monthlyData }: OverviewProps) {
  const { t } = useI18n();
  const [visibleCount, setVisibleCount] = useState(12); // Show 12 months initially

  // Get all months sorted by date (newest first)
  const allMonths = Array.from(monthlyData.values())
    .sort((a, b) => b.month.localeCompare(a.month));

  const visibleMonths = allMonths.slice(0, visibleCount);
  const hasMore = visibleCount < allMonths.length;

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 12, allMonths.length));
  };

  const showAll = () => {
    setVisibleCount(allMonths.length);
  };

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: `${theme.spacing['2xl']} ${theme.spacing.md}`,
    }}>
      <Manifesto />

      <section style={{ marginTop: theme.spacing['3xl'] }}>
        <h2 style={{
          fontSize: theme.typography.fontSize['2xl'],
          marginBottom: theme.spacing['2xl'],
          color: theme.colors.text.primary,
          fontWeight: theme.typography.fontWeight.semibold,
        }}>
          {t('overview.recentMonths')}
        </h2>

        {visibleMonths.map((data) => (
          <MonthOverview key={data.month} data={data} />
        ))}

        {hasMore && (
          <div style={{
            display: 'flex',
            gap: theme.spacing.md,
            justifyContent: 'center',
            marginTop: theme.spacing['2xl'],
            flexWrap: 'wrap',
          }}>
            <button
              onClick={loadMore}
              style={{
                padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.primary[700],
                backgroundColor: theme.colors.background.tertiary,
                border: `2px solid ${theme.colors.primary[300]}`,
                borderRadius: theme.borderRadius.lg,
                cursor: 'pointer',
                transition: theme.transitions.base,
                boxShadow: theme.shadows.sm,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primary[50];
                e.currentTarget.style.borderColor = theme.colors.primary[400];
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = theme.shadows.md;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.background.tertiary;
                e.currentTarget.style.borderColor = theme.colors.primary[300];
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = theme.shadows.sm;
              }}
            >
              {t('overview.loadMore')} (12 {t('overview.months')})
            </button>
            <button
              onClick={showAll}
              style={{
                padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.background.tertiary,
                backgroundColor: theme.colors.primary[600],
                border: `2px solid ${theme.colors.primary[600]}`,
                borderRadius: theme.borderRadius.lg,
                cursor: 'pointer',
                transition: theme.transitions.base,
                boxShadow: theme.shadows.md,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primary[700];
                e.currentTarget.style.borderColor = theme.colors.primary[700];
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = theme.shadows.lg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primary[600];
                e.currentTarget.style.borderColor = theme.colors.primary[600];
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = theme.shadows.md;
              }}
            >
              {t('overview.showAll')} ({allMonths.length} {t('overview.months')})
            </button>
          </div>
        )}

        <p style={{
          textAlign: 'center',
          color: theme.colors.text.tertiary,
          fontSize: theme.typography.fontSize.sm,
          marginTop: theme.spacing.xl,
          fontWeight: theme.typography.fontWeight.medium,
        }}>
          {t('overview.showing')} {visibleMonths.length} {t('overview.of')} {allMonths.length} {t('overview.months')}
        </p>
      </section>
    </div>
  );
}
