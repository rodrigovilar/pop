import { useI18n } from '../../contexts/I18nContext';
import { theme } from '../../styles/theme';

export function HeroSection() {
  const { t } = useI18n();

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: `${theme.spacing['4xl']} ${theme.spacing.xl}`,
      position: 'relative',
    }}>
      {/* Main Title */}
      <h1 style={{
        fontSize: 'clamp(2.5rem, 8vw, 5rem)',
        fontFamily: theme.typography.fontFamily.display,
        fontWeight: theme.typography.fontWeight.extrabold,
        background: theme.colors.gradients.blueGreen,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: theme.spacing.xl,
        textAlign: 'center',
        lineHeight: theme.typography.lineHeight.tight,
        letterSpacing: '-0.02em',
      }}>
        Proof of Patience
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
        color: theme.colors.text.secondary,
        textAlign: 'center',
        maxWidth: '800px',
        marginBottom: theme.spacing['3xl'],
        lineHeight: theme.typography.lineHeight.relaxed,
        fontWeight: theme.typography.fontWeight.medium,
      }}>
        {t('hero.subtitle') || 'Bitcoin rewards patience, not timing'}
      </p>

      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: theme.spacing.xl,
        maxWidth: '1200px',
        width: '100%',
        marginBottom: theme.spacing['3xl'],
      }}>
        {/* Problem Card 1 */}
        <div style={{
          padding: theme.spacing.xl,
          backgroundColor: theme.colors.background.elevated,
          borderRadius: theme.borderRadius.xl,
          border: `1px solid ${theme.colors.border.light}`,
          boxShadow: theme.shadows.elevatedCard,
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: theme.spacing.md,
          }}>
            📉
          </div>
          <h3 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.sm,
            fontFamily: theme.typography.fontFamily.display,
          }}>
            {t('hero.problem1.title') || 'Panic Selling'}
          </h3>
          <p style={{
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.text.secondary,
            lineHeight: theme.typography.lineHeight.relaxed,
          }}>
            {t('hero.problem1.text') || 'Many investors sell during price drops, locking in losses instead of waiting for recovery.'}
          </p>
        </div>

        {/* Problem Card 2 */}
        <div style={{
          padding: theme.spacing.xl,
          backgroundColor: theme.colors.background.elevated,
          borderRadius: theme.borderRadius.xl,
          border: `1px solid ${theme.colors.border.light}`,
          boxShadow: theme.shadows.elevatedCard,
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: theme.spacing.md,
          }}>
            💸
          </div>
          <h3 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.sm,
            fontFamily: theme.typography.fontFamily.display,
          }}>
            {t('hero.problem2.title') || 'Taking Small Profits'}
          </h3>
          <p style={{
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.text.secondary,
            lineHeight: theme.typography.lineHeight.relaxed,
          }}>
            {t('hero.problem2.text') || 'Exiting too early after modest gains prevents participation in long-term exponential growth.'}
          </p>
        </div>

        {/* Problem Card 3 */}
        <div style={{
          padding: theme.spacing.xl,
          backgroundColor: theme.colors.background.elevated,
          borderRadius: theme.borderRadius.xl,
          border: `1px solid ${theme.colors.border.light}`,
          boxShadow: theme.shadows.elevatedCard,
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: theme.spacing.md,
          }}>
            🎯
          </div>
          <h3 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.sm,
            fontFamily: theme.typography.fontFamily.display,
          }}>
            {t('hero.problem3.title') || 'Timing the Market'}
          </h3>
          <p style={{
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.text.secondary,
            lineHeight: theme.typography.lineHeight.relaxed,
          }}>
            {t('hero.problem3.text') || 'Trying to predict perfect entry and exit points often leads to missed opportunities.'}
          </p>
        </div>
      </div>

      {/* Key Message */}
      <div style={{
        maxWidth: '900px',
        padding: theme.spacing.xl,
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        border: `2px solid ${theme.colors.primary[200]}`,
        borderRadius: theme.borderRadius.xl,
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: theme.typography.fontSize.xl,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.primary[700],
          lineHeight: theme.typography.lineHeight.relaxed,
          margin: 0,
        }}>
          {t('hero.keyMessage') || 'Bitcoin is not about finding the perfect moment. It\'s about having the patience to stay invested through volatility.'}
        </p>
      </div>

      {/* Scroll Indicator */}
      <div style={{
        position: 'absolute',
        bottom: theme.spacing['2xl'],
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.tertiary,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: theme.spacing.sm,
        animation: 'float 2s ease-in-out infinite',
      }}>
        <span>{t('hero.scrollDown') || 'Scroll to explore'}</span>
        <span style={{ fontSize: '1.5rem' }}>↓</span>
      </div>
    </section>
  );
}
