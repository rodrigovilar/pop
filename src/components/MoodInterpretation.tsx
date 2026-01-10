import { useTheme } from '../hooks/useTheme';

interface MoodInterpretationProps {
  daysPositive: number;
  daysNegative: number;
  daysTotal: number;
  monthChange: number;
  regime: 'BULL' | 'BEAR' | 'LATERAL' | 'N/A';
}

export const MoodInterpretation = ({
  daysPositive,
  daysNegative,
  daysTotal,
  monthChange
}: MoodInterpretationProps) => {
  const theme = useTheme();

  const daysLateral = daysTotal - daysPositive - daysNegative;

  // Determine primary emotion based on the data
  const getPrimaryEmotion = () => {
    if (monthChange < -15 || daysNegative > daysTotal * 0.5) {
      return 'panic';
    } else if (daysNegative > daysPositive) {
      return 'despair';
    } else if (daysLateral > daysTotal * 0.4) {
      return 'boredom';
    } else if (monthChange > 0 && daysPositive > daysNegative) {
      return 'caution';
    } else {
      return 'frustration';
    }
  };

  const emotion = getPrimaryEmotion();

  const emotions = {
    panic: {
      emoji: '😱',
      title: 'PANIC',
      message: `I lost ${Math.abs(monthChange).toFixed(1)}% of my money!`,
      color: theme.colors.error
    },
    despair: {
      emoji: '😨',
      title: 'DESPAIR',
      message: 'Should I sell to avoid more losses?',
      color: theme.colors.error
    },
    frustration: {
      emoji: '😫',
      title: 'FRUSTRATION',
      message: 'Not worth it, more red than green days',
      color: theme.colors.warning || '#FFA500'
    },
    boredom: {
      emoji: '😴',
      title: 'BOREDOM',
      message: 'Nothing is happening, why am I even holding?',
      color: theme.colors.textSecondary
    },
    caution: {
      emoji: '😬',
      title: 'CAUTION',
      message: 'Should I take profit before it crashes again?',
      color: theme.colors.success
    }
  };

  const currentEmotion = emotions[emotion];

  return (
    <div style={{
      width: '100%',
      maxWidth: '600px',
      margin: '30px auto',
      padding: '30px',
      background: currentEmotion.color + '10',
      border: `2px solid ${currentEmotion.color}40`,
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: '20px',
        textAlign: 'center',
        borderBottom: `1px solid ${theme.colors.text}20`,
        paddingBottom: '12px'
      }}>
        😨 What you would feel:
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div style={{
          padding: '12px',
          background: theme.colors.error + '15',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.colors.error }}>
            {daysNegative}
          </div>
          <div style={{ fontSize: '11px', color: theme.colors.textSecondary, marginTop: '4px' }}>
            Negative Days
          </div>
        </div>

        <div style={{
          padding: '12px',
          background: theme.colors.success + '15',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.colors.success }}>
            {daysPositive}
          </div>
          <div style={{ fontSize: '11px', color: theme.colors.textSecondary, marginTop: '4px' }}>
            Positive Days
          </div>
        </div>

        <div style={{
          padding: '12px',
          background: theme.colors.text + '10',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.colors.text }}>
            {daysLateral}
          </div>
          <div style={{ fontSize: '11px', color: theme.colors.textSecondary, marginTop: '4px' }}>
            Lateral Days
          </div>
        </div>
      </div>

      {/* Main emotion */}
      <div style={{
        padding: '20px',
        background: theme.colors.background,
        borderRadius: '12px',
        marginBottom: '16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '12px'
        }}>
          <div style={{ fontSize: '48px' }}>
            {currentEmotion.emoji}
          </div>
          <div>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: currentEmotion.color
            }}>
              {currentEmotion.title}
            </div>
            <div style={{
              fontSize: '14px',
              color: theme.colors.text,
              marginTop: '4px',
              fontStyle: 'italic'
            }}>
              "{currentEmotion.message}"
            </div>
          </div>
        </div>
      </div>

      {/* Additional emotions */}
      <div style={{
        fontSize: '13px',
        color: theme.colors.textSecondary,
        lineHeight: '1.6',
        marginBottom: '16px'
      }}>
        {daysNegative > daysPositive && (
          <div style={{ marginBottom: '8px' }}>
            • {daysNegative} negative days → <strong style={{ color: theme.colors.error }}>DESPAIR</strong><br />
            <span style={{ fontSize: '12px', paddingLeft: '12px' }}>"Should I sell to avoid more losses?"</span>
          </div>
        )}

        {daysPositive <= daysNegative && (
          <div style={{ marginBottom: '8px' }}>
            • Only {daysPositive} positive days → <strong style={{ color: theme.colors.warning || '#FFA500' }}>FRUSTRATION</strong><br />
            <span style={{ fontSize: '12px', paddingLeft: '12px' }}>"Not worth it, more days negative"</span>
          </div>
        )}

        {monthChange < 0 && (
          <div style={{ marginBottom: '8px' }}>
            • Price dropped {Math.abs(monthChange).toFixed(1)}% → <strong style={{ color: theme.colors.error }}>PANIC</strong><br />
            <span style={{ fontSize: '12px', paddingLeft: '12px' }}>"I lost {Math.abs(monthChange).toFixed(1)}% of my money!"</span>
          </div>
        )}
      </div>

      {/* Warning message */}
      <div style={{
        padding: '16px',
        background: theme.colors.error + '15',
        borderLeft: `4px solid ${theme.colors.error}`,
        borderRadius: '4px',
        fontSize: '13px',
        color: theme.colors.text,
        fontWeight: '500'
      }}>
        ⚠️ This short-term view leads to emotional, bad decisions.
      </div>
    </div>
  );
};
