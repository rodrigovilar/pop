import { useI18n } from '../contexts/I18nContext';
import type { LoadingProgress } from '../lib/dataLoader';

interface LoadingStateProps {
  progress: LoadingProgress | null;
}

export function LoadingState({ progress }: LoadingStateProps) {
  const { t } = useI18n();

  const getPhaseText = (phase: string) => {
    switch (phase) {
      case 'manifest': return 'Loading manifest...';
      case 'current': return 'Loading current month...';
      case 'previous': return 'Loading previous month...';
      case 'recent': return 'Loading recent months...';
      case 'remaining': return 'Loading historical data...';
      default: return 'Loading...';
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      padding: '2rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
      }}>
        <p style={{
          textAlign: 'center',
          marginBottom: '1rem',
          fontSize: '1.1rem',
          color: '#666',
        }}>
          {t('common.loading')}
        </p>

        {progress && (
          <>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '0.5rem',
            }}>
              <div style={{
                width: `${progress.percentage}%`,
                height: '100%',
                backgroundColor: '#f97316',
                transition: 'width 0.3s ease',
              }} />
            </div>

            <p style={{
              textAlign: 'center',
              fontSize: '0.875rem',
              color: '#888',
              margin: 0,
            }}>
              {getPhaseText(progress.phase)}
              {' '}
              ({progress.loaded}/{progress.total})
            </p>
          </>
        )}
      </div>
    </div>
  );
}
