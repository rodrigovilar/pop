import { useMemo } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import { theme } from '../../styles/theme';
import { MonthGrid } from '../MonthGrid';
import type { MonthlyData, Currency } from '../../types';

interface ShortTermSectionProps {
  monthlyData: Map<string, MonthlyData>;
  currency: Currency;
  startMonth: string;
}

export function ShortTermSection({ monthlyData, startMonth }: ShortTermSectionProps) {
  const { t } = useI18n();

  // Get months from startMonth to now
  const displayMonths = useMemo(() => {
    return Array.from(monthlyData.values())
      .filter(m => m.month >= startMonth)
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [monthlyData, startMonth]);

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
      {/* Section Title */}
      <div style={{
        maxWidth: '900px',
        marginBottom: theme.spacing['3xl'],
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          fontFamily: theme.typography.fontFamily.display,
          fontWeight: theme.typography.fontWeight.extrabold,
          color: theme.colors.text.primary,
          marginBottom: theme.spacing.xl,
          lineHeight: theme.typography.lineHeight.tight,
        }}>
          {t('shortTerm.title') || 'The Short-Term Trap'}
        </h2>

        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          color: theme.colors.text.secondary,
          lineHeight: theme.typography.lineHeight.relaxed,
          marginBottom: theme.spacing.lg,
        }}>
          {t('shortTerm.intro') || 'Looking at daily or monthly price movements creates unnecessary anxiety and leads to poor decisions.'}
        </p>

        <div style={{
          padding: theme.spacing.lg,
          backgroundColor: 'rgba(239, 68, 68, 0.05)',
          border: `2px solid ${theme.colors.status.error}20`,
          borderRadius: theme.borderRadius.lg,
          marginBottom: theme.spacing.xl,
        }}>
          <p style={{
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.text.primary,
            lineHeight: theme.typography.lineHeight.relaxed,
            margin: 0,
          }}>
            {t('shortTerm.warning') || 'Each card below shows a month\'s performance. The colors indicate whether there were more positive (green), negative (red), or lateral (white) days. This short-term view doesn\'t reflect Bitcoin\'s fundamentals and causes panic selling during drops or premature profit-taking during rises.'}
          </p>
        </div>
      </div>

      {/* Month Grid - Full Width */}
      <div style={{
        width: '100%',
        maxWidth: '1600px',
      }}>
        <MonthGrid monthlyData={displayMonths} />
      </div>

      {/* Bottom Message */}
      <div style={{
        maxWidth: '800px',
        marginTop: theme.spacing['3xl'],
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: theme.typography.fontSize.lg,
          color: theme.colors.text.secondary,
          fontStyle: 'italic',
          lineHeight: theme.typography.lineHeight.relaxed,
        }}>
          {t('shortTerm.conclusion') || 'Day-to-day volatility is noise. What matters is long-term exposure.'}
        </p>
      </div>
    </section>
  );
}
