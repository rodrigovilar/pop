import { Manifesto } from './Manifesto';
import { MonthOverview } from './MonthOverview';
import type { MonthlyData } from '../types';

interface OverviewProps {
  monthlyData: Map<string, MonthlyData>;
}

export function Overview({ monthlyData }: OverviewProps) {
  // Get recent months (latest 3)
  const months = Array.from(monthlyData.values())
    .sort((a, b) => b.month.localeCompare(a.month))
    .slice(0, 3);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
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
    </div>
  );
}
