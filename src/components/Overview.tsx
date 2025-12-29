import { useState } from 'react';
import { Manifesto } from './Manifesto';
import { MonthOverview } from './MonthOverview';
import { useI18n } from '../contexts/I18nContext';
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
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
      <Manifesto />

      <section style={{ marginTop: '3rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          marginBottom: '1.5rem',
          color: '#333',
        }}>
          {t('overview.recentMonths')}
        </h2>

        {visibleMonths.map((data) => (
          <MonthOverview key={data.month} data={data} />
        ))}

        {hasMore && (
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            marginTop: '2rem',
          }}>
            <button
              onClick={loadMore}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#f97316',
                backgroundColor: 'white',
                border: '2px solid #f97316',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fff7ed';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              {t('overview.loadMore')} (12 {t('overview.months')})
            </button>
            <button
              onClick={showAll}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'white',
                backgroundColor: '#f97316',
                border: '2px solid #f97316',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ea580c';
                e.currentTarget.style.borderColor = '#ea580c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f97316';
                e.currentTarget.style.borderColor = '#f97316';
              }}
            >
              {t('overview.showAll')} ({allMonths.length} {t('overview.months')})
            </button>
          </div>
        )}

        <p style={{
          textAlign: 'center',
          color: '#888',
          fontSize: '0.875rem',
          marginTop: '1.5rem',
        }}>
          {t('overview.showing')} {visibleMonths.length} {t('overview.of')} {allMonths.length} {t('overview.months')}
        </p>
      </section>
    </div>
  );
}
