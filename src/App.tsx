import { useState } from 'react';
import { I18nProvider } from './contexts/I18nContext';
import { Navigation } from './components/Navigation';
import { Settings } from './components/Settings';
import { HeroIllustration } from './components/HeroIllustration';
import { Overview } from './components/Overview';
import { DCASimulation } from './components/DCASimulation';
import { About } from './components/About';
import { LoadingState } from './components/LoadingState';
import { useData } from './hooks/useData';
import { theme } from './styles/theme';
import type { Currency } from './types';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('overview');
  const [currency, setCurrency] = useState<Currency>('USD');
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

  const renderPage = () => {
    if (isLoading || monthlyData.size === 0) {
      return <LoadingState progress={progress} />;
    }

    switch (currentPage) {
      case 'overview':
        return <Overview monthlyData={monthlyData} />;
      case 'dca':
        return <DCASimulation monthlyData={monthlyData} currency={currency} />;
      case 'about':
        return <About />;
      default:
        return <Overview monthlyData={monthlyData} />;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.colors.background.primary,
    }}>
      <header style={{
        textAlign: 'center',
        padding: `${theme.spacing['2xl']} ${theme.spacing.md} ${theme.spacing.xl}`,
        background: `linear-gradient(180deg, ${theme.colors.background.tertiary} 0%, ${theme.colors.background.primary} 100%)`,
      }}>
        <h1 style={{
          fontSize: theme.typography.fontSize['5xl'],
          fontWeight: theme.typography.fontWeight.bold,
          margin: `0 0 ${theme.spacing.sm} 0`,
          background: `linear-gradient(135deg, ${theme.colors.primary[700]} 0%, ${theme.colors.primary[900]} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em',
        }}>
          PoP
        </h1>
        <p style={{
          fontSize: theme.typography.fontSize.xl,
          color: theme.colors.text.secondary,
          margin: `0 0 ${theme.spacing.xl} 0`,
          fontWeight: theme.typography.fontWeight.medium,
        }}>
          Proof of Patience
        </p>

        <HeroIllustration />
      </header>

      <Settings currency={currency} onCurrencyChange={setCurrency} />
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />

      <main style={{ flex: 1 }}>
        {renderPage()}
      </main>

      <footer style={{
        marginTop: theme.spacing['4xl'],
        paddingTop: theme.spacing['2xl'],
        borderTop: `1px solid ${theme.colors.secondary[200]}`,
        textAlign: 'center',
        color: theme.colors.text.tertiary,
        fontSize: theme.typography.fontSize.sm,
        padding: `${theme.spacing['2xl']} ${theme.spacing.md}`,
        backgroundColor: theme.colors.background.secondary,
      }}>
        <p style={{
          margin: `0 0 ${theme.spacing.sm} 0`,
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
