import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../hooks/useI18n';
import { useDCA } from '../hooks/useDCA';
import { HeroIntroduction } from './HeroIntroduction';
import { MonthCard } from './MonthCard';
import { MoodInterpretation } from './MoodInterpretation';
import { MonthVisualization } from './MonthVisualization';
import { FalseRevelation } from './FalseRevelation';
import { DCAIntroduction } from './DCAIntroduction';
import { DCAConfigurator } from './DCAConfigurator';
import { DCAResults } from './DCAResults';
import { DCAComparison } from './DCAComparison';
import type { MonthlyData } from '../types';

interface NarrativeFlowProps {
  months: MonthlyData[];
  currency: string;
  startMonth: string;
}

export const NarrativeFlow = ({ months, currency, startMonth }: NarrativeFlowProps) => {
  const theme = useTheme();
  const { t } = useI18n();

  // Use the provided startMonth as reference month
  const referenceMonth = startMonth;

  // Get the reference month data
  const referenceMonthData = months.find(m => m.month === referenceMonth) || months[0];

  // Filter months from reference month onwards
  const filteredMonths = months.filter(m => m.month >= referenceMonth);

  // DCA configuration
  const defaultMonthlyAmount = currency === 'USD' ? 100 : currency === 'EUR' ? 100 : currency === 'BRL' ? 250 : 100;
  const [monthlyAmount, setMonthlyAmount] = useState(defaultMonthlyAmount);

  // Run DCA simulation
  const { result: dcaResult, monthlyBreakdown, averageMonthlyGain } = useDCA({
    months: filteredMonths,
    startMonth: referenceMonth,
    monthlyAmount,
  });

  // Calculate lump sum comparison data
  const lumpSumAmount = monthlyAmount * filteredMonths.length;
  const lumpSumStartPrice = referenceMonthData.entryPrice;
  const lumpSumEndPrice = filteredMonths[filteredMonths.length - 1]?.entryPrice || lumpSumStartPrice;
  const lumpSumBTC = lumpSumAmount / lumpSumStartPrice;
  const lumpSumCurrentValue = lumpSumBTC * lumpSumEndPrice;
  const lumpSumProfit = lumpSumCurrentValue - lumpSumAmount;
  const lumpSumProfitPercent = (lumpSumProfit / lumpSumAmount) * 100;

  // Count months in drawdown for lump sum
  const lumpSumMonthsInDrawdown = filteredMonths.filter(m => {
    const currentValue = lumpSumBTC * m.entryPrice;
    return currentValue < lumpSumAmount;
  }).length;

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1.0] as const
      }
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: theme.colors.background,
      color: theme.colors.text
    }}>
      {/* Section 0: Hero Introduction */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <HeroIntroduction />
      </motion.section>

      {/* Section 1: The Invitation */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        style={{
          minHeight: '50vh',
          padding: '60px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          marginBottom: '24px',
          color: theme.colors.text
        }}>
          {t('narrative.invitation.title')}
        </h1>

        <div style={{
          maxWidth: '600px',
          padding: '30px',
          background: theme.colors.surface,
          borderRadius: '16px',
          border: `1px solid ${theme.colors.text}20`
        }}>
          <div style={{ fontSize: '18px', marginBottom: '20px' }}>
            📅 <strong>{formatMonthYear(referenceMonth)}</strong>
          </div>
          <div style={{ fontSize: '18px', marginBottom: '20px' }}>
            💵 {currency}
          </div>
          <div style={{
            fontSize: '16px',
            color: theme.colors.textSecondary,
            marginBottom: '20px'
          }}>
            {t('narrative.invitation.subtitle')}
          </div>
          <div style={{
            fontSize: '14px',
            color: theme.colors.textSecondary,
            fontStyle: 'italic'
          }}>
            {t('narrative.invitation.referToHeader')}
          </div>
        </div>
      </motion.section>

      {/* Section 2: Short-Term View (Single Month) */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        style={{
          padding: '60px 20px',
          background: theme.colors.surface
        }}
      >
        <h2 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '16px',
          color: theme.colors.text
        }}>
          {t('narrative.shortTerm.title')}
        </h2>

        <p style={{
          textAlign: 'center',
          fontSize: '16px',
          color: theme.colors.textSecondary,
          marginBottom: '40px',
          maxWidth: '700px',
          margin: '0 auto 40px'
        }}>
          {t('narrative.shortTerm.scenario', {
            amount: getInitialInvestmentAmount(currency),
            month: formatMonthYear(referenceMonth)
          })}<br />
          {t('narrative.shortTerm.scenarioSubtitle')}
        </p>

        {/* Side by Side: Month Card + Mood Interpretation */}
        {referenceMonthData && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '32px',
            maxWidth: '1200px',
            margin: '0 auto 40px',
            padding: '0 20px'
          }}>
            <MonthCard month={referenceMonthData} />
            <MoodInterpretation
              daysPositive={referenceMonthData.daysPositive}
              daysNegative={referenceMonthData.daysNegative}
              daysTotal={referenceMonthData.daysTotal}
              monthChange={referenceMonthData.pctChangeVsPrevMonthStart || 0}
              regime={referenceMonthData.regime}
            />
          </div>
        )}

        <div style={{
          maxWidth: '700px',
          margin: '40px auto 0',
          padding: '24px',
          background: theme.colors.background,
          borderRadius: '12px',
          textAlign: 'center',
          fontSize: '16px',
          color: theme.colors.textSecondary,
          lineHeight: '1.8'
        }}>
          <p style={{ marginBottom: '12px' }}>
            {t('narrative.shortTerm.message1')}
          </p>
          <p style={{ marginBottom: '12px' }}>
            {t('narrative.shortTerm.message2')}
          </p>
          <p style={{ fontWeight: 'bold', fontSize: '18px', color: theme.colors.text }}>
            {t('narrative.shortTerm.question')}
          </p>
        </div>
      </motion.section>

      {/* Section 3: Zoom Out (Still Suffering) */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        style={{
          padding: '60px 20px'
        }}
      >
        <h2 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '16px',
          color: theme.colors.text
        }}>
          {t('narrative.zoomOut.title')}
        </h2>

        <p style={{
          textAlign: 'center',
          fontSize: '16px',
          color: theme.colors.textSecondary,
          marginBottom: '40px',
          maxWidth: '700px',
          margin: '0 auto 40px'
        }}>
          {t('narrative.zoomOut.transition', {
            month: formatMonthYear(referenceMonth)
          })}
        </p>

        <div style={{
          maxWidth: '700px',
          margin: '0 auto 30px',
          padding: '20px',
          background: theme.colors.warning ? (theme.colors.warning + '15') : '#FFA50020',
          borderRadius: '12px',
          textAlign: 'center',
          fontSize: '16px',
          fontWeight: '500',
          color: theme.colors.text
        }}>
          {t('narrative.zoomOut.warning')}<br />
          <strong>{t('narrative.zoomOut.warningStrong')}</strong>
        </div>

        <MonthVisualization
          months={filteredMonths}
          referenceMonth={referenceMonth}
          showToggle={true}
        />
      </motion.section>

      {/* Section 4: The False Revelation */}
      <section style={{
        padding: '60px 20px',
        background: theme.colors.surface
      }}>
        <FalseRevelation
          onContinue={() => {
            // Scroll to DCA introduction
            const dcaSection = document.getElementById('dca-introduction');
            if (dcaSection) {
              dcaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
        />
      </section>

      {/* Section 5: DCA Introduction */}
      <section id="dca-introduction" style={{
        padding: '60px 20px'
      }}>
        <DCAIntroduction />
      </section>

      {/* Section 6: DCA Configurator */}
      <section style={{
        padding: '60px 20px',
        background: theme.colors.surface
      }}>
        <DCAConfigurator
          currency={currency}
          defaultAmount={monthlyAmount}
          onAmountChange={setMonthlyAmount}
        />
      </section>

      {/* Section 7: DCA Results */}
      {dcaResult && (
        <section style={{
          padding: '60px 20px'
        }}>
          <DCAResults
            result={dcaResult}
            monthlyBreakdown={monthlyBreakdown}
            averageMonthlyGain={averageMonthlyGain}
            currency={currency}
          />
        </section>
      )}

      {/* Section 8: DCA Comparison */}
      {dcaResult && (
        <section style={{
          padding: '60px 20px',
          background: theme.colors.surface
        }}>
          <DCAComparison
            lumpSumAmount={lumpSumAmount}
            dcaMonthlyAmount={monthlyAmount}
            dcaMonths={filteredMonths.length}
            dcaTotalProfit={dcaResult.currentPnL}
            dcaProfitPercent={dcaResult.currentPnLPercent}
            lumpSumProfit={lumpSumProfit}
            lumpSumProfitPercent={lumpSumProfitPercent}
            dcaDaysInDrawdown={dcaResult.daysInDrawdown}
            lumpSumMonthsInDrawdown={lumpSumMonthsInDrawdown}
            currency={currency}
          />
        </section>
      )}
    </div>
  );
};

// Helper function to format month-year
function formatMonthYear(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
}

// Helper function to get initial investment amount for short-term example
function getInitialInvestmentAmount(currency: string): string {
  const amounts: Record<string, string> = {
    'USD': '$1,000',
    'EUR': '€1,000',
    'BRL': 'R$5,000',
    'GBP': '£1,000',
    'JPY': '¥150,000',
    'CHF': 'CHF 1,000',
    'CAD': 'CA$1,500',
    'AUD': 'AU$1,500',
  };
  return amounts[currency] || `${currency} 1,000`;
}
