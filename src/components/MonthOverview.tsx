import { useI18n } from '../contexts/I18nContext';
import type { MonthlyData } from '../types';

interface MonthOverviewProps {
  data: MonthlyData;
}

export function MonthOverview({ data }: MonthOverviewProps) {
  const { t, formatCurrency, formatNumber } = useI18n();

  const totalDays = data.daysTotal;
  const positivePercent = (data.daysPositive / totalDays) * 100;
  const negativePercent = (data.daysNegative / totalDays) * 100;
  const lateralPercent = 100 - positivePercent - negativePercent;

  const getRegimeColor = (regime: string) => {
    switch (regime) {
      case 'BULL': return '#22c55e';
      case 'BEAR': return '#ef4444';
      case 'LATERAL': return '#f59e0b';
      default: return '#94a3b8';
    }
  };

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '1.5rem',
      marginBottom: '1rem',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{data.month}</h3>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#666' }}>
            {t('overview.currentMonth')}
          </p>
        </div>
        <div style={{
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          backgroundColor: getRegimeColor(data.regime),
          color: 'white',
          fontWeight: 'bold',
        }}>
          {t(`overview.regimes.${data.regime}`)}
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ margin: '0.5rem 0', fontSize: '0.875rem' }}>
          <strong>{t('common.price')}:</strong> {formatCurrency(data.entryPrice, data.currency)}
        </p>
        {data.pctChangeVsPrevMonthStart !== null && (
          <p style={{
            margin: '0.5rem 0',
            fontSize: '0.875rem',
            color: data.pctChangeVsPrevMonthStart >= 0 ? '#22c55e' : '#ef4444',
          }}>
            <strong>{t('common.change')}:</strong> {formatNumber(data.pctChangeVsPrevMonthStart, {
              signDisplay: 'always',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}%
          </p>
        )}
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '0.5rem',
        }}>
          <div style={{
            flex: positivePercent,
            height: '24px',
            backgroundColor: '#22c55e',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 'bold',
          }}>
            {data.daysPositive > 0 && `${Math.round(positivePercent)}%`}
          </div>
          <div style={{
            flex: negativePercent,
            height: '24px',
            backgroundColor: '#ef4444',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 'bold',
          }}>
            {data.daysNegative > 0 && `${Math.round(negativePercent)}%`}
          </div>
          <div style={{
            flex: lateralPercent,
            height: '24px',
            backgroundColor: '#94a3b8',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 'bold',
          }}>
            {lateralPercent > 0 && `${Math.round(lateralPercent)}%`}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          fontSize: '0.75rem',
          color: '#666',
        }}>
          <div>
            <span style={{ color: '#22c55e' }}>●</span> {t('overview.daysPositive')}: {data.daysPositive}
          </div>
          <div>
            <span style={{ color: '#ef4444' }}>●</span> {t('overview.daysNegative')}: {data.daysNegative}
          </div>
          <div>
            <span style={{ color: '#94a3b8' }}>●</span> {t('overview.daysLateral')}: {totalDays - data.daysPositive - data.daysNegative}
          </div>
        </div>
      </div>
    </div>
  );
}
