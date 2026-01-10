import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../hooks/useI18n';

export const HeroIntroduction = () => {
  const theme = useTheme();
  const { t } = useI18n();

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0px 0px',
      textAlign: 'center'
    }}>
      {/* Main Title */}
      <h1 style={{
        fontSize: '56px',
        fontWeight: 'bold',
        marginTop: '12px',
        marginBottom: '0px',
        color: theme.colors.text,
        maxWidth: '900px',
        lineHeight: '1.2'
      }}>
        {t('footer.projectTitle')}
      </h1>

      <p style={{
        fontSize: '24px',
        color: theme.colors.textSecondary,
        marginBottom: '40px',
        maxWidth: '700px',
        lineHeight: '1.6'
      }}>
        {t('hero.subtitle')}
      </p>

      {/* Problems Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '32px',
        maxWidth: '1100px',
        marginBottom: '60px'
      }}>
        {/* Problem 1: Panic Selling */}
        <div style={{
          padding: '16px',
          background: theme.colors.surface,
          borderRadius: '16px',
          border: `2px solid ${theme.colors.error}40`,
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px'
          }}>
            😱
          </div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: theme.colors.error,
            marginBottom: '12px'
          }}>
            {t('hero.problem1.title')}
          </h3>
          <p style={{
            fontSize: '16px',
            color: theme.colors.textSecondary,
            lineHeight: '1.6'
          }}>
            {t('hero.problem1.text')}
          </p>
        </div>

        {/* Problem 2: Taking Small Profits */}
        <div style={{
          padding: '16px',
          background: theme.colors.surface,
          borderRadius: '16px',
          border: `2px solid ${theme.colors.warning}40`,
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px'
          }}>
            💸
          </div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: theme.colors.warning,
            marginBottom: '12px'
          }}>
            {t('hero.problem2.title')}
          </h3>
          <p style={{
            fontSize: '16px',
            color: theme.colors.textSecondary,
            lineHeight: '1.6'
          }}>
            {t('hero.problem2.text')}
          </p>
        </div>

        {/* Problem 3: Timing the Market */}
        <div style={{
          padding: '16px',
          background: theme.colors.surface,
          borderRadius: '16px',
          border: `2px solid ${theme.colors.accent}40`,
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px'
          }}>
            ⏰
          </div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: theme.colors.accent,
            marginBottom: '12px'
          }}>
            {t('hero.problem3.title')}
          </h3>
          <p style={{
            fontSize: '16px',
            color: theme.colors.textSecondary,
            lineHeight: '1.6'
          }}>
            {t('hero.problem3.text')}
          </p>
        </div>
      </div>

      {/* Key Message */}
      <div style={{
        maxWidth: '60%',
        padding: '20px',
        background: `linear-gradient(135deg, ${theme.colors.accent}20 0%, ${theme.colors.success}15 100%)`,
        borderRadius: '20px',
        border: `2px solid ${theme.colors.accent}50`,
        marginBottom: '20px'
      }}>
        <p style={{
          fontSize: '20px',
          color: theme.colors.text,
          lineHeight: '1.8',
          fontWeight: '500',
          whiteSpace: 'pre-line'
        }}>
          {t('hero.keyMessage')}
        </p>
      </div>

      {/* Scroll indicator */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        opacity: 0.6,
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }}>
        <div style={{
          fontSize: '14px',
          color: theme.colors.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          {t('hero.scrollDown')}
        </div>
        <div style={{
          fontSize: '24px'
        }}>
          ↓
        </div>
      </div>
    </div>
  );
};
