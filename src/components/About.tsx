import { useI18n } from '../contexts/I18nContext';

export function About() {
  const { t } = useI18n();

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>
        {t('about.title')}
      </h2>

      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{
          fontSize: '1.25rem',
          marginBottom: '1rem',
          color: '#f97316',
        }}>
          {t('about.purpose')}
        </h3>
        <p style={{
          lineHeight: '1.8',
          color: '#374151',
          fontSize: '1rem',
        }}>
          {t('about.purposeText')}
        </p>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{
          fontSize: '1.25rem',
          marginBottom: '1rem',
          color: '#f97316',
        }}>
          {t('about.principles')}
        </h3>
        <ul style={{
          listStyle: 'none',
          padding: 0,
        }}>
          {['principle1', 'principle2', 'principle3', 'principle4'].map((key) => (
            <li key={key} style={{
              padding: '0.75rem 0',
              borderBottom: '1px solid #e5e7eb',
              color: '#374151',
            }}>
              <span style={{ color: '#f97316', marginRight: '0.5rem' }}>✓</span>
              {t(`about.${key}`)}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{
          fontSize: '1.25rem',
          marginBottom: '1rem',
          color: '#f97316',
        }}>
          {t('about.philosophy')}
        </h3>
        <p style={{
          lineHeight: '1.8',
          color: '#374151',
          fontSize: '1rem',
        }}>
          {t('about.philosophyText')}
        </p>
      </section>

      <section style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <p style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          marginBottom: '0.5rem',
        }}>
          {t('about.dataSource')}
        </p>
        <a
          href="https://www.coingecko.com?utm_source=pop-proof-of-patience&utm_medium=referral"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#f97316',
            textDecoration: 'none',
            fontWeight: '500',
          }}
        >
          CoinGecko
        </a>
      </section>

      <div style={{
        backgroundColor: '#f9fafb',
        padding: '2rem',
        borderRadius: '8px',
        borderLeft: '4px solid #f97316',
      }}>
        <p style={{
          fontSize: '1.1rem',
          fontStyle: 'italic',
          color: '#6b7280',
          lineHeight: '1.8',
          margin: 0,
          textAlign: 'center',
        }}>
          "Bitcoin teaches behavior, not profit."
        </p>
      </div>
    </div>
  );
}
