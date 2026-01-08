import { useState, useEffect, useRef } from 'react';
import { HeroSection } from './sections/HeroSection';
import { ShortTermSection } from './sections/ShortTermSection';
import { LongTermSection } from './sections/LongTermSection';
import { DetailsSection } from './sections/DetailsSection';
import type { MonthlyData, Currency } from '../types';

interface ScrollNarrativeProps {
  monthlyData: Map<string, MonthlyData>;
  currency: Currency;
  startMonth: string;
}

export function ScrollNarrative({ monthlyData, currency, startMonth }: ScrollNarrativeProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(Math.max(scrollTop / docHeight, 0), 1);

      setScrollProgress(progress);

      // Determine current section (0-3)
      // Section 0: 0-25%, Section 1: 25-50%, Section 2: 50-75%, Section 3: 75-100%
      if (progress < 0.25) setCurrentSection(0);
      else if (progress < 0.5) setCurrentSection(1);
      else if (progress < 0.75) setCurrentSection(2);
      else setCurrentSection(3);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {/* Pass scroll data to background via data attribute */}
      <div
        data-scroll-progress={scrollProgress}
        data-current-section={currentSection}
        style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0, pointerEvents: 'none' }}
      />

      {/* Section 1: Hero - Proof of Patience Concept */}
      <HeroSection />

      {/* Section 2: Short Term Vision - Month Grid */}
      <ShortTermSection
        monthlyData={monthlyData}
        currency={currency}
        startMonth={startMonth}
      />

      {/* Section 3: Long Term Vision - DCA Simulator */}
      <LongTermSection
        monthlyData={monthlyData}
        currency={currency}
        startMonth={startMonth}
      />

      {/* Section 4: Final Details - Monthly Breakdown Table */}
      <DetailsSection
        monthlyData={monthlyData}
        currency={currency}
        startMonth={startMonth}
      />
    </div>
  );
}
