import { useState } from 'react';
import { I18nProvider } from './contexts/I18nContext';
import { Settings } from './components/Settings';
import { LoadingState } from './components/LoadingState';
import { BreezeBackground } from './components/BreezeBackground';
import { ScrollNarrative } from './components/ScrollNarrative';
import { useData } from './hooks/useData';
import { theme } from './styles/theme';
import type { Currency } from './types';

function AppContent() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [currentSection, setCurrentSection] = useState(0);

  // Calculate default start date: 48 months ago (excluding current month)
  const now = new Date();
  const lastCompleteMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastCompleteMonthStr = lastCompleteMonth.toISOString().split('T')[0].substring(0, 7);
  const startDate = new Date(lastCompleteMonth.getFullYear(), lastCompleteMonth.getMonth() - 47, 1);
  const defaultStartMonth = startDate.toISOString().split('T')[0].substring(0, 7);

  const [startMonth, setStartMonth] = useState(defaultStartMonth);

  const { monthlyData, isLoading, progress, error } = useData({
    currency,
    autoLoad: true,
  });

  if (error) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: theme.colors.status.error,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}>
        <h2 style={{ fontFamily: theme.typography.fontFamily.display }}>Error Loading Data</h2>
        <p style={{ color: theme.colors.text.secondary }}>{error.message}</p>
      </div>
    );
  }

  if (isLoading || monthlyData.size === 0) {
    return <LoadingState progress={progress} />;
  }

  return (
    <>
      {/* Animated Background with dynamic colors */}
      <BreezeBackground currentSection={currentSection} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        color: theme.colors.text.primary,
      }}>
        {/* Fixed Header with Settings */}
        <header style={{
          borderBottom: `1px solid ${theme.colors.border.light}`,
          backgroundColor: theme.colors.background.overlay,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          boxShadow: theme.shadows.sm,
        }}>
          <div style={{
            maxWidth: '1600px',
            margin: '0 auto',
            padding: `${theme.spacing.md} ${theme.spacing.xl}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <h1 style={{
                fontSize: theme.typography.fontSize['2xl'],
                fontFamily: theme.typography.fontFamily.display,
                fontWeight: theme.typography.fontWeight.extrabold,
                margin: 0,
                letterSpacing: '-0.02em',
                background: theme.colors.gradients.blueGreen,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 2px 8px rgba(59, 130, 246, 0.3))',
              }}>
                Proof of Patience
              </h1>
            </div>

            {/* Date Selector + Settings */}
            <div style={{
              display: 'flex',
              gap: theme.spacing.lg,
              alignItems: 'center',
            }}>
              {/* Month/Year Selector */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.xs,
                padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                backgroundColor: theme.colors.background.elevated,
                borderRadius: theme.borderRadius.lg,
                border: `1px solid ${theme.colors.border.light}`,
                boxShadow: theme.shadows.sm,
              }}>
                <label
                  htmlFor="start-month"
                  style={{
                    fontSize: theme.typography.fontSize.lg,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  📅
                </label>
                <input
                  id="start-month"
                  type="month"
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  max={lastCompleteMonthStr}
                  min="2010-07"
                  style={{
                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                    fontSize: theme.typography.fontSize.sm,
                    border: 'none',
                    borderRadius: theme.borderRadius.md,
                    backgroundColor: 'transparent',
                    color: theme.colors.text.primary,
                    fontWeight: theme.typography.fontWeight.semibold,
                    cursor: 'pointer',
                    outline: 'none',
                    transition: theme.transitions.fast,
                    fontFamily: theme.typography.fontFamily.mono,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.background.tertiary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                />
              </div>

              <Settings currency={currency} onCurrencyChange={setCurrency} />
            </div>
          </div>
        </header>

        {/* Add padding to account for fixed header */}
        <div style={{ paddingTop: '80px' }}>
          {/* Scroll Narrative */}
          <ScrollNarrative
            monthlyData={monthlyData}
            currency={currency}
            startMonth={startMonth}
            onSectionChange={setCurrentSection}
          />
        </div>

        {/* Footer */}
        <footer style={{
          paddingTop: theme.spacing.xl,
          paddingBottom: theme.spacing.xl,
          borderTop: `1px solid ${theme.colors.border.light}`,
          textAlign: 'center',
          color: theme.colors.text.tertiary,
          fontSize: theme.typography.fontSize.sm,
          backgroundColor: theme.colors.background.primary,
        }}>
          <p style={{
            margin: `0 0 ${theme.spacing.xs} 0`,
            color: theme.colors.text.secondary,
            fontWeight: theme.typography.fontWeight.medium,
          }}>
            PoP is an educational tool. Not financial advice.
          </p>
          <p style={{
            margin: 0,
            fontStyle: 'italic',
            color: theme.colors.text.tertiary,
            fontFamily: theme.typography.fontFamily.sans,
          }}>
            Bitcoin teaches behavior, not profit.
          </p>
        </footer>
      </div>
    </>
  );
}

function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

export default App;
