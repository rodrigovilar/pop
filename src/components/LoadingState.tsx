import { useI18n } from '../contexts/I18nContext';
import { theme } from '../styles/theme';
import type { LoadingProgress } from '../lib/dataLoader';

interface LoadingStateProps {
  progress: LoadingProgress | null;
}

export function LoadingState({ progress }: LoadingStateProps) {
  const { t } = useI18n();

  const getPhaseText = (phase: string) => {
    switch (phase) {
      case 'manifest': return t('common.loadingPhases.manifest');
      case 'current': return t('common.loadingPhases.current');
      case 'previous': return t('common.loadingPhases.previous');
      case 'recent': return t('common.loadingPhases.recent');
      case 'remaining': return t('common.loadingPhases.remaining');
      default: return t('common.loading');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      padding: theme.spacing['2xl'],
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
      }}>
        <p style={{
          textAlign: 'center',
          marginBottom: theme.spacing.lg,
          fontSize: theme.typography.fontSize.lg,
          color: theme.colors.text.secondary,
          fontWeight: theme.typography.fontWeight.medium,
        }}>
          {t('common.loading')}
        </p>

        {progress && (
          <>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: theme.colors.background.tertiary,
              borderRadius: theme.borderRadius.md,
              overflow: 'hidden',
              marginBottom: theme.spacing.sm,
              border: `1px solid ${theme.colors.border.light}`,
            }}>
              <div style={{
                width: `${progress.percentage}%`,
                height: '100%',
                background: theme.colors.gradients.blueGreen,
                transition: 'width 0.3s ease',
              }} />
            </div>

            <p style={{
              textAlign: 'center',
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.tertiary,
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
