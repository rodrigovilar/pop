import { useState } from 'react';
import { I18nProvider } from './contexts/I18nContext';
import { Settings } from './components/Settings';
import { HeroIllustration } from './components/HeroIllustration';
import { MainView } from './components/MainView';
import { LoadingState } from './components/LoadingState';
import { useData } from './hooks/useData';
import { theme } from './styles/theme';
import type { Currency } from './types';

function AppContent() {
  const [currency, setCurrency] = useState<Currency>('USD');

  // Calculate default start date: 4 years ago
  const now = new Date();
  const fourYearsAgo = new Date(now.getFullYear() - 4, now.getMonth(), 1);
  const defaultStartMonth = fourYearsAgo.toISOString().split('T')[0].substring(0, 7);

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
        color: '#ef4444',
      }}>
        <h2>Error</h2>
        <p>{error.message}</p>
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
      backgroundColor: '#ffffff', // Pure white background
    }}>
      {/* Header with Settings */}
      <header style={{
        borderBottom: `2px solid ${theme.colors.secondary[200]}`,
        backgroundColor: '#ffffff',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: theme.shadows.sm,
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h1 style={{
              fontSize: theme.typography.fontSize['2xl'],
              fontWeight: theme.typography.fontWeight.bold,
              margin: 0,
              background: `linear-gradient(135deg, ${theme.colors.primary[700]} 0%, ${theme.colors.primary[900]} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              PoP
            </h1>
            <p style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              margin: 0,
            }}>
              Proof of Patience
            </p>
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
                max={new Date().toISOString().split('T')[0].substring(0, 7)}
                min="2010-07"
                style={{
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  fontSize: theme.typography.fontSize.sm,
                  border: `2px solid ${theme.colors.primary[200]}`,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: theme.colors.background.tertiary,
                  color: theme.colors.text.primary,
                  fontWeight: theme.typography.fontWeight.medium,
                  cursor: 'pointer',
                  outline: 'none',
                }}
              />
            </div>

            <Settings currency={currency} onCurrencyChange={setCurrency} />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main style={{ flex: 1 }}>
        <MainView monthlyData={monthlyData} currency={currency} startMonth={startMonth} />
      </main>

      {/* Illustration moved to bottom */}
      <div style={{
        padding: `${theme.spacing['4xl']} ${theme.spacing.xl}`,
        backgroundColor: theme.colors.background.secondary,
      }}>
        <HeroIllustration />
      </div>

      {/* Footer */}
      <footer style={{
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xl,
        borderTop: `1px solid ${theme.colors.secondary[200]}`,
        textAlign: 'center',
        color: theme.colors.text.tertiary,
        fontSize: theme.typography.fontSize.sm,
        backgroundColor: theme.colors.background.secondary,
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
