import { I18nProvider } from './contexts/I18nContext';
import { Manifesto } from './components/Manifesto';
import { MonthOverview } from './components/MonthOverview';
import { LoadingState } from './components/LoadingState';
import { useData } from './hooks/useData';

function AppContent() {
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

  if (isLoading || monthlyData.size === 0) {
    return <LoadingState progress={progress} />;
  }

  // Get recent months (latest 3)
  const months = Array.from(monthlyData.values())
    .sort((a, b) => b.month.localeCompare(a.month))
    .slice(0, 3);

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '2rem 1rem',
    }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
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

      <Manifesto />

      <section style={{ marginTop: '3rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          marginBottom: '1.5rem',
          color: '#333',
        }}>
          Recent Months
        </h2>

        {months.map((data) => (
          <MonthOverview key={data.month} data={data} />
        ))}

        {monthlyData.size > 3 && (
          <p style={{
            textAlign: 'center',
            color: '#888',
            fontSize: '0.875rem',
            marginTop: '1rem',
          }}>
            Loaded {monthlyData.size} months of historical data
          </p>
        )}
      </section>

      <footer style={{
        marginTop: '4rem',
        paddingTop: '2rem',
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center',
        color: '#888',
        fontSize: '0.875rem',
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
