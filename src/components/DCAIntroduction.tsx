import { useTheme } from '../hooks/useTheme';

export const DCAIntroduction = () => {
  const theme = useTheme();

  return (
    <div style={{
      width: '100%',
      maxWidth: '900px',
      margin: '0 auto',
      padding: '60px 20px'
    }}>
      <h2 style={{
        fontSize: '36px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '24px',
        color: theme.colors.text
      }}>
        What is DCA?
      </h2>

      <div style={{
        fontSize: '18px',
        color: theme.colors.textSecondary,
        lineHeight: '1.8',
        marginBottom: '40px',
        textAlign: 'center',
        maxWidth: '700px',
        margin: '0 auto 40px'
      }}>
        <strong style={{ color: theme.colors.text }}>Dollar-Cost Averaging (DCA)</strong> is a strategy where you invest a fixed amount at regular intervals, regardless of the price.
      </div>

      <div style={{
        display: 'grid',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {/* Key Principle 1 */}
        <div style={{
          padding: '24px',
          background: theme.colors.success + '10',
          borderRadius: '16px',
          border: `2px solid ${theme.colors.success}30`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '12px'
          }}>
            <span style={{ fontSize: '32px' }}>📅</span>
            <h3 style={{
              fontSize: '22px',
              fontWeight: 'bold',
              color: theme.colors.success,
              margin: 0
            }}>
              Consistent Schedule
            </h3>
          </div>
          <p style={{
            fontSize: '16px',
            color: theme.colors.text,
            lineHeight: '1.6',
            margin: 0
          }}>
            Buy the same amount every month (or week), no matter what the price is doing.
          </p>
        </div>

        {/* Key Principle 2 */}
        <div style={{
          padding: '24px',
          background: theme.colors.accent + '10',
          borderRadius: '16px',
          border: `2px solid ${theme.colors.accent}30`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '12px'
          }}>
            <span style={{ fontSize: '32px' }}>🤖</span>
            <h3 style={{
              fontSize: '22px',
              fontWeight: 'bold',
              color: theme.colors.accent,
              margin: 0
            }}>
              Remove Emotion
            </h3>
          </div>
          <p style={{
            fontSize: '16px',
            color: theme.colors.text,
            lineHeight: '1.6',
            margin: 0
          }}>
            Automate your purchases so you don't have to make emotional decisions based on fear or greed.
          </p>
        </div>

        {/* Key Principle 3 */}
        <div style={{
          padding: '24px',
          background: theme.colors.text + '08',
          borderRadius: '16px',
          border: `2px solid ${theme.colors.text}20`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '12px'
          }}>
            <span style={{ fontSize: '32px' }}>⏱️</span>
            <h3 style={{
              fontSize: '22px',
              fontWeight: 'bold',
              color: theme.colors.text,
              margin: 0
            }}>
              Time in Market &gt; Timing the Market
            </h3>
          </div>
          <p style={{
            fontSize: '16px',
            color: theme.colors.text,
            lineHeight: '1.6',
            margin: 0
          }}>
            It doesn't matter when you start or what the current price is. What matters is staying invested over time.
          </p>
        </div>
      </div>

      {/* The Shift */}
      <div style={{
        padding: '32px',
        background: `linear-gradient(135deg, ${theme.colors.accent}20 0%, ${theme.colors.success}15 100%)`,
        borderRadius: '20px',
        border: `2px solid ${theme.colors.accent}50`,
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: theme.colors.text,
          marginBottom: '16px'
        }}>
          The Mindset Shift
        </div>
        <div style={{
          fontSize: '16px',
          color: theme.colors.textSecondary,
          lineHeight: '1.8',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Instead of asking <em>"Is now a good time to buy?"</em>,<br />
          DCA makes you ask <em>"How long will I stay invested?"</em>
        </div>
      </div>
    </div>
  );
};
