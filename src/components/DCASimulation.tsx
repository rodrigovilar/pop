import { useState } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { simulateDCA } from '../lib/dcaEngine';
import type { DCAResult } from '../lib/dcaEngine';
import type { MonthlyData, Currency } from '../types';

interface DCASimulationProps {
  monthlyData: Map<string, MonthlyData>;
  currency: Currency;
}

export function DCASimulation({ monthlyData, currency }: DCASimulationProps) {
  const { t, formatCurrency, formatNumber, formatDate } = useI18n();

  const [startDate, setStartDate] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('100');
  const [result, setResult] = useState<DCAResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get available date range
  const months = Array.from(monthlyData.values()).sort((a, b) => a.month.localeCompare(b.month));
  const minDate = months[0]?.entryDate || '2020-01-01';
  const maxDate = months[months.length - 1]?.entryDate || new Date().toISOString().split('T')[0];

  const handleSimulate = () => {
    setError(null);
    setResult(null);

    // Validation
    if (!startDate) {
      setError(t('dca.errors.selectDate') || 'Please select a start date');
      return;
    }

    const amount = parseFloat(monthlyAmount);
    if (isNaN(amount) || amount <= 0) {
      setError(t('dca.errors.invalidAmount') || 'Please enter a valid monthly amount');
      return;
    }

    // Convert monthly data to daily prices
    const dailyPrices = Array.from(monthlyData.values())
      .sort((a, b) => a.month.localeCompare(b.month))
      .map(m => ({
        date: m.entryDate,
        price: m.entryPrice,
      }));

    if (dailyPrices.length === 0) {
      setError('No data available');
      return;
    }

    try {
      const simulationResult = simulateDCA(dailyPrices, startDate, amount);
      setResult(simulationResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation failed');
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
          {t('dca.title')}
        </h2>
        <p style={{ color: '#666', fontSize: '1rem' }}>
          {t('dca.subtitle')}
        </p>
      </div>

      {/* Form */}
      <div style={{
        backgroundColor: '#f9fafb',
        padding: '2rem',
        borderRadius: '8px',
        marginBottom: '2rem',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
        }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
            }}>
              {t('dca.startDate')}
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={minDate}
              max={maxDate}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            />
            <p style={{
              marginTop: '0.25rem',
              fontSize: '0.75rem',
              color: '#6b7280',
            }}>
              {formatDate(minDate)} - {formatDate(maxDate)}
            </p>
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
            }}>
              {t('dca.monthlyAmount')} ({currency})
            </label>
            <input
              type="number"
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(e.target.value)}
              min="1"
              step="10"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            />
            <p style={{
              marginTop: '0.25rem',
              fontSize: '0.75rem',
              color: '#6b7280',
            }}>
              Monthly investment amount
            </p>
          </div>
        </div>

        <button
          onClick={handleSimulate}
          style={{
            marginTop: '1.5rem',
            padding: '0.875rem 2rem',
            backgroundColor: '#f97316',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f97316'}
        >
          {t('dca.simulate')}
        </button>

        {error && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '4px',
            color: '#991b1b',
            fontSize: '0.875rem',
          }}>
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div>
          <h3 style={{
            fontSize: '1.25rem',
            marginBottom: '1.5rem',
            color: '#374151',
          }}>
            Simulation Results
          </h3>

          {/* Summary Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}>
            <div style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                {t('dca.results.totalInvested')}
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151' }}>
                {formatCurrency(result.totalInvested, currency)}
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                {t('dca.results.totalBTC')}
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151' }}>
                {formatNumber(result.totalBTC, { minimumFractionDigits: 4, maximumFractionDigits: 8 })} BTC
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                {t('dca.results.currentValue')}
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151' }}>
                {formatCurrency(result.currentValue, currency)}
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              backgroundColor: result.currentPnL >= 0 ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${result.currentPnL >= 0 ? '#bbf7d0' : '#fecaca'}`,
              borderRadius: '8px',
            }}>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                {t('dca.results.pnl')}
              </p>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: result.currentPnL >= 0 ? '#166534' : '#991b1b',
              }}>
                {formatNumber(result.currentPnLPercent, { signDisplay: 'always', minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: result.currentPnL >= 0 ? '#166534' : '#991b1b',
                marginTop: '0.25rem',
              }}>
                {formatCurrency(result.currentPnL, currency)}
              </p>
            </div>
          </div>

          {/* Educational Insights */}
          <div style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}>
            <h4 style={{
              fontSize: '1.1rem',
              marginBottom: '1rem',
              color: '#92400e',
            }}>
              📊 {t('dca.insights.drawdownTitle')}
            </h4>
            <p style={{ color: '#78350f', lineHeight: '1.6', marginBottom: '1rem' }}>
              {t('dca.insights.drawdownText', { days: result.daysInDrawdown })}
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#92400e', marginBottom: '0.25rem' }}>
                  {t('dca.results.daysInDrawdown')}
                </p>
                <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#78350f' }}>
                  {result.daysInDrawdown}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#92400e', marginBottom: '0.25rem' }}>
                  {t('dca.results.longestStreak')}
                </p>
                <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#78350f' }}>
                  {result.longestNegativeStreak}
                </p>
              </div>
            </div>
          </div>

          {/* Discipline Message */}
          <div style={{
            backgroundColor: '#f3f4f6',
            borderLeft: '4px solid #f97316',
            padding: '1.5rem',
            borderRadius: '4px',
          }}>
            <h4 style={{
              fontSize: '1.1rem',
              marginBottom: '0.5rem',
              color: '#374151',
            }}>
              💪 {t('dca.insights.disciplineTitle')}
            </h4>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
              {t('dca.insights.disciplineText', { days: result.longestNegativeStreak })}
            </p>
            <p style={{
              marginTop: '1rem',
              fontSize: '0.875rem',
              fontStyle: 'italic',
              color: '#9ca3af',
            }}>
              There are no shortcuts. Only discipline, time, and conviction.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
