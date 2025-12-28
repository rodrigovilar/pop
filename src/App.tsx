import { useState } from 'react';
import { I18nProvider } from './contexts/I18nContext';
import { Navigation } from './components/Navigation';
import { Overview } from './components/Overview';
import { DCASimulation } from './components/DCASimulation';
import { About } from './components/About';
import { LoadingState } from './components/LoadingState';
import { useData } from './hooks/useData';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('overview');
  const { monthlyData, isLoading, progress, error } = useData({
    currency: 'USD',
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
        return <DCASimulation monthlyData={monthlyData} currency="USD" />;
      case 'about':
        return <About />;
      default:
        return <Overview monthlyData={monthlyData} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ textAlign: 'center', padding: '2rem 1rem 1rem' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          margin: '0 0 0.5rem 0',
          background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          PoP
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          margin: 0,
        }}>
          Proof of Patience
        </p>
      </header>

      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />

      <main style={{ flex: 1 }}>
        {renderPage()}
      </main>

      <footer style={{
        marginTop: '4rem',
        paddingTop: '2rem',
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center',
        color: '#888',
        fontSize: '0.875rem',
        padding: '2rem 1rem',
      }}>
        <p>
          PoP is an educational tool. Not financial advice.
        </p>
        <p>
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
