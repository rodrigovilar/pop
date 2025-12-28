import { useI18n } from '../contexts/I18nContext';

export function Manifesto() {
  const { t } = useI18n();

  return (
    <div style={{
      maxWidth: '600px',
      margin: '3rem auto',
      padding: '2rem',
      textAlign: 'center',
      fontFamily: 'Georgia, serif',
      lineHeight: '1.8',
      color: '#333',
    }}>
      <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
        {t('manifesto.line1')}
      </p>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        {t('manifesto.line2')}
      </p>

      <p style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#666' }}>
        {t('manifesto.line4')}
      </p>
      <p style={{ fontSize: '1rem', marginBottom: '2rem', color: '#666' }}>
        {t('manifesto.line5')}
      </p>

      <p style={{ fontSize: '0.95rem', fontStyle: 'italic', color: '#888' }}>
        {t('manifesto.line7')}
      </p>
      <p style={{ fontSize: '0.95rem', fontStyle: 'italic', color: '#888' }}>
        {t('manifesto.line8')}
      </p>
    </div>
  );
}
