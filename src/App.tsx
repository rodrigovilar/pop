import { useState } from 'react';
import { I18nProvider, useI18n } from './contexts/I18nContext';
import { Settings } from './components/Settings';
import { LoadingState } from './components/LoadingState';
import { BreezeBackground } from './components/BreezeBackground';
import { ScrollNarrative } from './components/ScrollNarrative';
import { useData } from './hooks/useData';
import { theme } from './styles/theme';
import type { Currency } from './types';

function AppContent() {
  const { t } = useI18n();
  const [currency, setCurrency] = useState<Currency>('USD');
  const [currentSection, setCurrentSection] = useState(0);

  // Calculate default start date: 48 months ago (excluding current month)
  const now = new Date();
  const lastCompleteMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastCompleteMonthStr = lastCompleteMonth.toISOString().split('T')[0].substring(0, 7);
  const startDate = new Date(lastCompleteMonth.getFullYear(), lastCompleteMonth.getMonth() - 47, 1);
  const defaultStartMonth = startDate.toISOString().split('T')[0].substring(0, 7);

  const [startMonth, setStartMonth] = useState(defaultStartMonth);

  const { monthlyData, isLoading, progress, error } = useData({
    currency,
    autoLoad: true,
  });

  if (error) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: theme.colors.status.error,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}>
        <h2 style={{ fontFamily: theme.typography.fontFamily.display }}>{t('footer.errorLoading')}</h2>
        <p style={{ color: theme.colors.text.secondary }}>{error.message}</p>
      </div>
    );
  }

  if (isLoading || monthlyData.size === 0) {
    return <LoadingState progress={progress} />;
  }

  return (
    <>
      {/* Animated Background with dynamic colors */}
      <BreezeBackground currentSection={currentSection} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        color: theme.colors.text.primary,
      }}>
        {/* Fixed Header with Settings */}
        <header style={{
          borderBottom: `1px solid ${theme.colors.border.light}`,
          backgroundColor: theme.colors.background.overlay,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          boxShadow: theme.shadows.sm,
        }}>
          <div style={{
            maxWidth: '1600px',
            margin: '0 auto',
            padding: `${theme.spacing.md} ${theme.spacing.xl}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <h1 style={{
                fontSize: theme.typography.fontSize['2xl'],
                fontFamily: theme.typography.fontFamily.display,
                fontWeight: theme.typography.fontWeight.extrabold,
                margin: 0,
                letterSpacing: '-0.02em',
                background: theme.colors.gradients.blueGreen,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 2px 8px rgba(59, 130, 246, 0.3))',
              }}>
                {t('footer.projectTitle')}
              </h1>
            </div>

            {/* Date Selector + Settings */}
            <div style={{
              display: 'flex',
              gap: theme.spacing.lg,
              alignItems: 'center',
            }}>
              {/* Month/Year Selector */}
              <div
                onClick={() => {
                  const input = document.getElementById('start-month') as HTMLInputElement;
                  if (input) {
                    input.showPicker?.();
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.xs,
                  padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                  backgroundColor: theme.colors.background.elevated,
                  borderRadius: theme.borderRadius.lg,
                  border: `1px solid ${theme.colors.border.light}`,
                  boxShadow: theme.shadows.sm,
                  cursor: 'pointer',
                }}
              >
                <label
                  htmlFor="start-month"
                  style={{
                    fontSize: theme.typography.fontSize.lg,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  📅
                </label>
                <input
                  id="start-month"
                  type="month"
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  max={lastCompleteMonthStr}
                  min="2010-07"
                  style={{
                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                    fontSize: theme.typography.fontSize.sm,
                    border: 'none',
                    borderRadius: theme.borderRadius.md,
                    backgroundColor: 'transparent',
                    color: theme.colors.text.primary,
                    fontWeight: theme.typography.fontWeight.semibold,
                    cursor: 'pointer',
                    outline: 'none',
                    transition: theme.transitions.fast,
                    fontFamily: theme.typography.fontFamily.mono,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.background.tertiary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                />
              </div>

              <Settings currency={currency} onCurrencyChange={setCurrency} />
            </div>
          </div>
        </header>

        {/* Add padding to account for fixed header */}
        <div style={{ paddingTop: '80px' }}>
          {/* Scroll Narrative */}
          <ScrollNarrative
            monthlyData={monthlyData}
            currency={currency}
            startMonth={startMonth}
            onSectionChange={setCurrentSection}
          />
        </div>

        {/* Footer */}
        <footer style={{
          paddingTop: theme.spacing['4xl'],
          paddingBottom: theme.spacing['3xl'],
          borderTop: `2px solid ${theme.colors.border.medium}`,
          backgroundColor: theme.colors.background.secondary,
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: `0 ${theme.spacing.xl}`,
          }}>
            {/* Main Footer Content */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: theme.spacing['2xl'],
              marginBottom: theme.spacing['2xl'],
            }}>
              {/* About Project */}
              <div>
                <h3 style={{
                  fontSize: theme.typography.fontSize.xl,
                  fontWeight: theme.typography.fontWeight.bold,
                  fontFamily: theme.typography.fontFamily.display,
                  marginBottom: theme.spacing.md,
                  background: theme.colors.gradients.blueGreen,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {t('footer.projectTitle')}
                </h3>
                <p style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                  lineHeight: theme.typography.lineHeight.relaxed,
                  marginBottom: theme.spacing.md,
                }}>
                  {t('footer.projectDescription')}
                </p>
                <a
                  href="https://github.com/rodrigovilar/pop"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: theme.spacing.xs,
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.primary[600],
                    textDecoration: 'none',
                    fontWeight: theme.typography.fontWeight.semibold,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  {t('footer.starOnGitHub')}
                </a>
              </div>

              {/* About Author */}
              <div>
                <h3 style={{
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                  marginBottom: theme.spacing.md,
                  fontFamily: theme.typography.fontFamily.display,
                }}>
                  {t('footer.createdBy')}
                </h3>
                <p style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                  lineHeight: theme.typography.lineHeight.relaxed,
                  marginBottom: theme.spacing.md,
                }}>
                  {t('footer.creatorDescription')}
                </p>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: theme.spacing.xs,
                }}>
                  <a
                    href="https://www.linkedin.com/in/rodrigo-vilar/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.text.secondary,
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = theme.colors.primary[600];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = theme.colors.text.secondary;
                    }}
                  >
                    {t('footer.linkedin')}
                  </a>
                  <a
                    href="https://twitter.com/vilar"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.text.secondary,
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = theme.colors.primary[600];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = theme.colors.text.secondary;
                    }}
                  >
                    {t('footer.twitter')}
                  </a>
                </div>
              </div>

              {/* Donations */}
              <div>
                <h3 style={{
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                  marginBottom: theme.spacing.md,
                  fontFamily: theme.typography.fontFamily.display,
                }}>
                  {t('footer.supportProject')}
                </h3>
                <p style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                  lineHeight: theme.typography.lineHeight.relaxed,
                  marginBottom: theme.spacing.md,
                }}>
                  {t('footer.donationMessage')}
                </p>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: theme.spacing.sm,
                }}>
                  {/* Lightning */}
                  <div style={{
                    padding: theme.spacing.sm,
                    backgroundColor: theme.colors.background.elevated,
                    borderRadius: theme.borderRadius.md,
                    border: `1px solid ${theme.colors.border.light}`,
                  }}>
                    <div style={{
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.text.tertiary,
                      marginBottom: theme.spacing.xs,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      {t('footer.lightningNetwork')}
                    </div>
                    <code style={{
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.primary[600],
                      fontFamily: theme.typography.fontFamily.mono,
                      wordBreak: 'break-all',
                    }}>
                      rodrigo@coinos.io
                    </code>
                  </div>

                  {/* On-chain */}
                  <div style={{
                    padding: theme.spacing.sm,
                    backgroundColor: theme.colors.background.elevated,
                    borderRadius: theme.borderRadius.md,
                    border: `1px solid ${theme.colors.border.light}`,
                  }}>
                    <div style={{
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.text.tertiary,
                      marginBottom: theme.spacing.xs,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      {t('footer.bitcoinOnChain')}
                    </div>
                    <code style={{
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.primary[600],
                      fontFamily: theme.typography.fontFamily.mono,
                      wordBreak: 'break-all',
                    }}>
                      bc1qvsj78deg5xfyu3rx0zm54dfs3wpqf545hy4syh
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div style={{
              borderTop: `1px solid ${theme.colors.border.light}`,
              paddingTop: theme.spacing.lg,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: theme.spacing.sm,
            }}>
              <p style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.secondary,
                fontWeight: theme.typography.fontWeight.medium,
                margin: 0,
              }}>
                {t('footer.disclaimer')}
              </p>
              <p style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.tertiary,
                fontStyle: 'italic',
                margin: 0,
              }}>
                {t('footer.tagline')}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

export default App;
