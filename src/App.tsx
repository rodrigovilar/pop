import { useState } from 'react';
import { I18nProvider } from './contexts/I18nContext';
import { Settings } from './components/Settings';
import { HeroIllustration } from './components/HeroIllustration';
import { MainView } from './components/MainView';
import { DCADetails } from './components/DCADetails';
import { LoadingState } from './components/LoadingState';
import { useData } from './hooks/useData';
import { theme } from './styles/theme';
import type { Currency } from './types';

function AppContent() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [currentView, setCurrentView] = useState<'main' | 'dca-details'>('main');
  const [dcaDetailsAmount, setDcaDetailsAmount] = useState(100);

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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.colors.background.primary,
      color: theme.colors.text.primary,
    }}>
      {/* Header with Settings */}
      <header style={{
        borderBottom: `1px solid ${theme.colors.secondary[800]}`,
        backgroundColor: theme.colors.background.overlay,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: theme.shadows.md,
      }}>
        <div style={{
          maxWidth: '1400px',
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
              background: `linear-gradient(135deg, ${theme.colors.accent[400]} 0%, ${theme.colors.accent[500]} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 10px rgba(247, 147, 26, 0.3))',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
              <label
                htmlFor="start-month"
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                  fontWeight: theme.typography.fontWeight.medium,
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
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  fontSize: theme.typography.fontSize.sm,
                  border: `1px solid ${theme.colors.secondary[700]}`,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: theme.colors.background.tertiary,
                  color: theme.colors.text.primary,
                  fontWeight: theme.typography.fontWeight.medium,
                  cursor: 'pointer',
                  outline: 'none',
                  transition: theme.transitions.default,
                  fontFamily: theme.typography.fontFamily.mono,
                }}
              />
            </div>

            <Settings currency={currency} onCurrencyChange={setCurrency} />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main style={{ flex: 1, position: 'relative' }}>
        {currentView === 'main' ? (
          <MainView
            monthlyData={monthlyData}
            currency={currency}
            startMonth={startMonth}
            onNavigateToDetails={(amount) => {
              setDcaDetailsAmount(amount);
              setCurrentView('dca-details');
            }}
          />
        ) : (
          <DCADetails
            monthlyData={monthlyData}
            currency={currency}
            startMonth={startMonth}
            monthlyAmount={dcaDetailsAmount}
            onBack={() => setCurrentView('main')}
          />
        )}
      </main>

      {/* Illustration moved to bottom */}
      <div style={{
        padding: `${theme.spacing['4xl']} ${theme.spacing.xl}`,
        backgroundColor: theme.colors.background.secondary,
        borderTop: `1px solid ${theme.colors.secondary[800]}`,
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div style={{ opacity: 0.8, filter: 'grayscale(20%)' }}>
          <HeroIllustration />
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xl,
        borderTop: `1px solid ${theme.colors.secondary[800]}`,
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
