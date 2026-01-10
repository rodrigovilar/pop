import { useMemo } from 'react';
import { simulateDCA, type DCAResult, type DailyPrice } from '../lib/dcaEngine';
import type { MonthlyData } from '../types';

interface UseDCAParams {
  months: MonthlyData[];
  startMonth: string;
  monthlyAmount: number;
}

interface UseDCAReturn {
  result: DCAResult | null;
  monthlyBreakdown: MonthlyBreakdown[];
  averageMonthlyGain: number;
}

export interface MonthlyBreakdown {
  month: string;
  invested: number;
  btcPurchased: number;
  cumulativeBTC: number;
  cumulativeInvested: number;
  currentValue: number;
  gain: number;
  gainPercent: number;
}

/**
 * Hook to simulate DCA strategy with monthly data
 */
export function useDCA({ months, startMonth, monthlyAmount }: UseDCAParams): UseDCAReturn {
  const result = useMemo(() => {
    if (!months || months.length === 0 || monthlyAmount <= 0) {
      return null;
    }

    try {
      // Convert monthly data to daily prices (using entry price as proxy)
      const dailyPrices: DailyPrice[] = months.map(m => ({
        date: m.entryDate,
        price: m.entryPrice,
      }));

      // Find start date
      const startMonthData = months.find(m => m.month === startMonth);
      if (!startMonthData) {
        return null;
      }

      const startDate = startMonthData.entryDate;

      // Run simulation
      return simulateDCA(dailyPrices, startDate, monthlyAmount);
    } catch (error) {
      console.error('DCA simulation error:', error);
      return null;
    }
  }, [months, startMonth, monthlyAmount]);

  const monthlyBreakdown = useMemo(() => {
    if (!months || months.length === 0 || monthlyAmount <= 0 || !result) {
      return [];
    }

    const breakdown: MonthlyBreakdown[] = [];
    const filteredMonths = months
      .filter(m => m.month >= startMonth)
      .sort((a, b) => a.month.localeCompare(b.month));

    let cumulativeBTC = 0;
    let cumulativeInvested = 0;
    const currentPrice = months[months.length - 1]?.entryPrice || 0;

    filteredMonths.forEach((month, index) => {
      const btcPurchased = monthlyAmount / month.entryPrice;
      cumulativeBTC += btcPurchased;
      cumulativeInvested += monthlyAmount;

      const currentValue = cumulativeBTC * currentPrice;
      const gain = currentValue - cumulativeInvested;

      // Calculate compound monthly gain rate (CAGR) for this specific investment
      const monthsElapsed = filteredMonths.length - index;
      const investmentCurrentValue = btcPurchased * currentPrice;
      const monthlyGainRate = monthsElapsed > 0
        ? (Math.pow(investmentCurrentValue / monthlyAmount, 1 / monthsElapsed) - 1) * 100
        : 0;

      breakdown.push({
        month: month.month,
        invested: monthlyAmount,
        btcPurchased,
        cumulativeBTC,
        cumulativeInvested,
        currentValue,
        gain,
        gainPercent: monthlyGainRate, // This is now the CAGR for this investment
      });
    });

    return breakdown;
  }, [months, startMonth, monthlyAmount, result]);

  const averageMonthlyGain = useMemo(() => {
    if (monthlyBreakdown.length === 0) {
      return 0;
    }

    // Calculate weighted average monthly gain (weighted by time elapsed)
    let weightedSum = 0;
    let totalWeight = 0;

    monthlyBreakdown.forEach((entry, index) => {
      // Weight = months elapsed since this investment (how long it's been in the market)
      const monthsElapsed = monthlyBreakdown.length - index;
      const weight = monthsElapsed;
      weightedSum += entry.gainPercent * weight;
      totalWeight += weight;
    });

    // Return weighted average
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }, [monthlyBreakdown]);

  return {
    result,
    monthlyBreakdown,
    averageMonthlyGain,
  };
}
