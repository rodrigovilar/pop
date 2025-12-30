import { theme } from '../styles/theme';

/**
 * Hero Illustration - Mountain/Time Visual
 * Represents: Patience, geological time, stability
 */
export function HeroIllustration() {
  return (
    <div style={{
      width: '100%',
      maxWidth: '600px',
      height: '200px',
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: theme.borderRadius.xl,
    }}>
      {/* Gradient Sky Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(180deg,
          ${theme.colors.primary[100]} 0%,
          ${theme.colors.primary[50]} 50%,
          ${theme.colors.background.primary} 100%)`,
      }} />

      {/* Mountains - Layered for depth */}
      <svg
        viewBox="0 0 600 200"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {/* Back mountain - Lightest */}
        <path
          d="M 0 200 L 0 120 Q 100 80, 200 100 Q 300 120, 400 90 L 600 110 L 600 200 Z"
          fill={theme.colors.primary[200]}
          opacity="0.4"
        />

        {/* Middle mountain */}
        <path
          d="M 0 200 L 0 140 Q 150 100, 300 130 Q 450 160, 600 140 L 600 200 Z"
          fill={theme.colors.primary[400]}
          opacity="0.6"
        />

        {/* Front mountain - Darkest */}
        <path
          d="M 0 200 L 0 160 Q 100 120, 250 150 Q 400 180, 600 170 L 600 200 Z"
          fill={theme.colors.primary[600]}
          opacity="0.8"
        />

        {/* Sun/Moon - Patience symbol */}
        <circle
          cx="500"
          cy="60"
          r="30"
          fill={theme.colors.accent[300]}
          opacity="0.6"
        />
        <circle
          cx="500"
          cy="60"
          r="25"
          fill={theme.colors.accent[200]}
          opacity="0.4"
        />
      </svg>

      {/* Floating Quote */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        zIndex: 10,
      }}>
        <div style={{
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.medium,
          color: theme.colors.primary[800],
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          opacity: 0.7,
        }}>
          Time in the market
        </div>
        <div style={{
          fontSize: theme.typography.fontSize.lg,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.primary[900],
          marginTop: theme.spacing.xs,
        }}>
          beats timing the market
        </div>
      </div>
    </div>
  );
}
