import { useTheme } from '../hooks/useTheme';

interface FalseRevelationProps {
  onContinue?: () => void;
}

export const FalseRevelation = ({ onContinue }: FalseRevelationProps) => {
  const theme = useTheme();

  return (
    <div style={{
      width: '100%',
      maxWidth: '800px',
      margin: '60px auto',
      padding: '40px',
      background: `linear-gradient(135deg, ${theme.colors.background}00 0%, ${theme.colors.text}05 100%)`,
      borderRadius: '20px'
    }}>
      {/* First section - What we learned */}
      <div style={{
        padding: '30px',
        background: theme.colors.surface,
        borderRadius: '16px',
        marginBottom: '30px',
        border: `1px solid ${theme.colors.text}20`
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: theme.colors.text,
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          🎯 What we learned so far:
        </div>

        <div style={{
          display: 'grid',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '16px',
            background: theme.colors.success + '10',
            borderRadius: '12px',
            border: `1px solid ${theme.colors.success}30`
          }}>
            <span style={{ fontSize: '20px' }}>✅</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', color: theme.colors.success, marginBottom: '4px' }}>
                YES, long-term you made money (+116%)
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '16px',
            background: theme.colors.success + '10',
            borderRadius: '12px',
            border: `1px solid ${theme.colors.success}30`
          }}>
            <span style={{ fontSize: '20px' }}>✅</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', color: theme.colors.success, marginBottom: '4px' }}>
                YES, patience eventually paid off
              </div>
            </div>
          </div>
        </div>

        <div style={{
          fontSize: '20px',
          fontWeight: 'bold',
          textAlign: 'center',
          margin: '24px 0',
          color: theme.colors.text,
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          BUT...
        </div>

        <div style={{
          display: 'grid',
          gap: '12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '16px',
            background: theme.colors.error + '10',
            borderRadius: '12px',
            border: `1px solid ${theme.colors.error}30`
          }}>
            <span style={{ fontSize: '20px' }}>❌</span>
            <div style={{ flex: 1, color: theme.colors.text }}>
              <strong>You still CHECKED every month</strong>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '16px',
            background: theme.colors.error + '10',
            borderRadius: '12px',
            border: `1px solid ${theme.colors.error}30`
          }}>
            <span style={{ fontSize: '20px' }}>❌</span>
            <div style={{ flex: 1, color: theme.colors.text }}>
              <strong>You SUFFERED for 16 months straight</strong>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '16px',
            background: theme.colors.error + '10',
            borderRadius: '12px',
            border: `1px solid ${theme.colors.error}30`
          }}>
            <span style={{ fontSize: '20px' }}>❌</span>
            <div style={{ flex: 1, color: theme.colors.text }}>
              <strong>You felt PANIC in June 2022 (-37.9%)</strong>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '16px',
            background: theme.colors.error + '10',
            borderRadius: '12px',
            border: `1px solid ${theme.colors.error}30`
          }}>
            <span style={{ fontSize: '20px' }}>❌</span>
            <div style={{ flex: 1, color: theme.colors.text }}>
              <strong>You felt DESPAIR in November 2022 (-66%)</strong>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '24px',
          padding: '20px',
          background: theme.colors.background,
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '16px',
            color: theme.colors.text,
            lineHeight: '1.6'
          }}>
            <div style={{ marginBottom: '8px' }}>
              The problem isn't <strong style={{ color: theme.colors.error }}>TIMING</strong>.
            </div>
            <div>
              The problem is <strong style={{ color: theme.colors.error }}>CHECKING</strong>.
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '16px',
          padding: '16px',
          background: theme.colors.text + '10',
          borderRadius: '8px',
          fontSize: '14px',
          color: theme.colors.textSecondary,
          fontStyle: 'italic',
          textAlign: 'center'
        }}>
          You bought everything at once (lump sum) and then tortured yourself month by month.
        </div>
      </div>

      {/* Second section - The Shift */}
      <div style={{
        padding: '30px',
        background: `linear-gradient(135deg, ${theme.colors.accent}15 0%, ${theme.colors.success}10 100%)`,
        borderRadius: '16px',
        border: `2px solid ${theme.colors.accent}40`,
        boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          fontSize: '18px',
          color: theme.colors.text,
          marginBottom: '20px',
          textAlign: 'center',
          fontWeight: '500'
        }}>
          What if the solution isn't:
        </div>

        <div style={{
          display: 'grid',
          gap: '10px',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            background: theme.colors.background,
            borderRadius: '8px',
            color: theme.colors.textSecondary
          }}>
            <span style={{ fontSize: '18px' }}>❌</span>
            <span style={{ textDecoration: 'line-through' }}>"Find the perfect entry"</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            background: theme.colors.background,
            borderRadius: '8px',
            color: theme.colors.textSecondary
          }}>
            <span style={{ fontSize: '18px' }}>❌</span>
            <span style={{ textDecoration: 'line-through' }}>"Zoom out and check monthly"</span>
          </div>
        </div>

        <div style={{
          fontSize: '18px',
          color: theme.colors.text,
          marginBottom: '16px',
          textAlign: 'center',
          fontWeight: '500'
        }}>
          What if the solution is:
        </div>

        <div style={{
          display: 'grid',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px',
            background: theme.colors.success + '15',
            borderRadius: '12px',
            border: `2px solid ${theme.colors.success}40`,
            fontWeight: '500',
            color: theme.colors.text
          }}>
            <span style={{ fontSize: '20px' }}>✅</span>
            <span>STOP trying to time anything</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px',
            background: theme.colors.success + '15',
            borderRadius: '12px',
            border: `2px solid ${theme.colors.success}40`,
            fontWeight: '500',
            color: theme.colors.text
          }}>
            <span style={{ fontSize: '20px' }}>✅</span>
            <span>AUTOMATE your investment</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px',
            background: theme.colors.success + '15',
            borderRadius: '12px',
            border: `2px solid ${theme.colors.success}40`,
            fontWeight: '500',
            color: theme.colors.text
          }}>
            <span style={{ fontSize: '20px' }}>✅</span>
            <span>BUY a little every month, no matter what</span>
          </div>
        </div>

        <div style={{
          padding: '24px',
          background: theme.colors.background,
          borderRadius: '12px',
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          <div style={{
            fontSize: '22px',
            fontWeight: 'bold',
            color: theme.colors.accent,
            marginBottom: '12px'
          }}>
            This changes EVERYTHING.
          </div>
          <div style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: theme.colors.text
          }}>
            This is called DCA.
          </div>
        </div>

        {onContinue && (
          <button
            onClick={onContinue}
            style={{
              width: '100%',
              padding: '18px 32px',
              fontSize: '18px',
              fontWeight: 'bold',
              background: `linear-gradient(135deg, ${theme.colors.accent} 0%, ${theme.colors.success} 100%)`,
              color: theme.colors.background,
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: `0 4px 20px ${theme.colors.accent}40`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 6px 30px ${theme.colors.accent}60`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 4px 20px ${theme.colors.accent}40`;
            }}
          >
            Discover DCA Strategy →
          </button>
        )}
      </div>
    </div>
  );
};
