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
  onSectionChange: (section: number) => void;
}

export function ScrollNarrative({ monthlyData, currency, startMonth, onSectionChange }: ScrollNarrativeProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const shortTermRef = useRef<HTMLDivElement>(null);
  const longTermRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for accurate section detection
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // Trigger when section is in middle-upper part of viewport
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('data-section-id');
          if (sectionId) {
            const newSection = parseInt(sectionId);
            if (newSection !== currentSection) {
              setCurrentSection(newSection);
              onSectionChange(newSection);
            }
          }
        }
      });
    }, options);

    // Observe all sections
    if (heroRef.current) observer.observe(heroRef.current);
    if (shortTermRef.current) observer.observe(shortTermRef.current);
    if (longTermRef.current) observer.observe(longTermRef.current);
    if (detailsRef.current) observer.observe(detailsRef.current);

    return () => observer.disconnect();
  }, [currentSection, onSectionChange]);

  // Track scroll progress for other purposes
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(Math.max(scrollTop / docHeight, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

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

      {/* Section 0: Hero - Proof of Patience Concept */}
      <div ref={heroRef} data-section-id="0">
        <HeroSection />
      </div>

      {/* Section 1: Short Term Vision - Month Grid */}
      <div ref={shortTermRef} data-section-id="1">
        <ShortTermSection
          monthlyData={monthlyData}
          currency={currency}
          startMonth={startMonth}
        />
      </div>

      {/* Section 2: Long Term Vision - DCA Simulator */}
      <div ref={longTermRef} data-section-id="2">
        <LongTermSection
          monthlyData={monthlyData}
          currency={currency}
          startMonth={startMonth}
        />
      </div>

      {/* Section 3: Final Details - Monthly Breakdown Table */}
      <div ref={detailsRef} data-section-id="3">
        <DetailsSection
          monthlyData={monthlyData}
          currency={currency}
          startMonth={startMonth}
        />
      </div>
    </div>
  );
}
