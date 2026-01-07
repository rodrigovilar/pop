/**
 * Design System - PoP (Proof of Patience)
 *
 * Theme focused on:
 * - Calmness and patience
 * - Anti-anxiety visual language
 * - Long-term thinking
 * - Natural, organic growth
 */

export const theme = {
  // Color Palette - Bitcoin Dark Mode (Enhanced)
  colors: {
    // Primary: Deep Slate/Blue (Backgrounds, Depth) - Refined for cleaner look
    primary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b', // Card Background
      900: '#0a0f1e', // Main Background (Deeper, richer)
      950: '#050a14', // Darker Depth
    },

    // Secondary: Cool Gray (Neutral elements) - Warmer tones
    secondary: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
    },

    // Accent: Bitcoin Orange (Vibrant, Energetic) - Enhanced vibrancy
    accent: {
      50: '#fff8f0',
      100: '#ffeed9',
      200: '#ffddb3',
      300: '#ffc68a',
      400: '#ffa854', // Brighter light orange
      500: '#F7931A', // Bitcoin Core Orange
      600: '#e67e00',
      700: '#c96d00',
      800: '#a85a00',
      900: '#8a4900',
      glow: 'rgba(247, 147, 26, 0.35)', // Softer glow
      glowStrong: 'rgba(247, 147, 26, 0.6)', // Stronger glow
    },

    // Backgrounds - More refined hierarchy
    background: {
      primary: '#0a0f1e',    // Deep Blue/Black (richer)
      secondary: '#1a1f2e',  // Card/Panel (slightly lighter)
      tertiary: '#252a3a',   // Inputs/Hover (more contrast)
      elevated: '#2a2f3f',   // Elevated elements
      overlay: 'rgba(10, 15, 30, 0.9)', // Glassmorphism (darker)
      overlayLight: 'rgba(10, 15, 30, 0.6)', // Lighter overlay
    },

    // Text - Improved hierarchy
    text: {
      primary: '#ffffff',    // Pure White (stronger contrast)
      secondary: '#cbd5e1',  // Light Gray
      tertiary: '#94a3b8',   // Muted
      quaternary: '#64748b', // Extra muted
      inverse: '#0a0f1e',    // Dark text for light backgrounds
    },

    // Status Colors - More refined
    status: {
      success: '#22c55e',    // Brighter Emerald
      successDark: '#16a34a',// Darker green
      error: '#ef4444',      // Red
      errorDark: '#dc2626',  // Darker red
      warning: '#f59e0b',    // Amber
      warningDark: '#d97706',// Darker amber
      info: '#3b82f6',       // Blue
      infoDark: '#2563eb',   // Darker blue
    },

    // Border colors for cleaner separation
    border: {
      subtle: 'rgba(255, 255, 255, 0.03)',
      light: 'rgba(255, 255, 255, 0.08)',
      medium: 'rgba(255, 255, 255, 0.12)',
      strong: 'rgba(255, 255, 255, 0.16)',
    },
  },

  // Spacing - Enhanced scale
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '0.75rem',   // 12px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '2.5rem', // 40px
    '3xl': '3rem',   // 48px
    '4xl': '4rem',   // 64px
    '5xl': '5rem',   // 80px
    '6xl': '6rem',   // 96px
  },

  // Typography
  typography: {
    fontFamily: {
      sans: '"Inter", sans-serif',
      display: '"Outfit", sans-serif', // For Headings
      mono: '"JetBrains Mono", monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '2rem',
      '4xl': '2.5rem',
      '5xl': '3.5rem',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },

  // Border Radius
  borderRadius: {
    sm: '0.375rem',
    md: '0.75rem',     // Slightly softer
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },

  // Shadows - Enhanced with elevation levels
  shadows: {
    none: 'none',
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.1)',
    sm: '0 2px 4px 0 rgba(0, 0, 0, 0.15)',
    md: '0 4px 12px -1px rgba(0, 0, 0, 0.25)',
    lg: '0 8px 24px -3px rgba(0, 0, 0, 0.35)',
    xl: '0 16px 48px -8px rgba(0, 0, 0, 0.45)',
    '2xl': '0 24px 60px -12px rgba(0, 0, 0, 0.55)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)',
    // Glow effects
    glow: '0 0 20px rgba(247, 147, 26, 0.25)', // Orange aura
    glowSoft: '0 0 30px rgba(247, 147, 26, 0.15)', // Softer glow
    glowStrong: '0 0 40px rgba(247, 147, 26, 0.4)', // Stronger glow
    // Colored shadows for depth
    elevatedCard: '0 8px 24px -6px rgba(0, 0, 0, 0.4), 0 0 1px rgba(255, 255, 255, 0.05)',
  },

  // Transitions - More variety and control
  transitions: {
    default: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    base: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    slower: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },

  // Animation keyframes (for use in styled components)
  animations: {
    fadeIn: 'fadeIn 0.3s ease-in',
    fadeOut: 'fadeOut 0.3s ease-out',
    slideUp: 'slideUp 0.3s ease-out',
    slideDown: 'slideDown 0.3s ease-out',
    scaleIn: 'scaleIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },

  // Breakpoints for responsive design
  breakpoints: {
    xs: '480px',   // Mobile phones
    sm: '640px',   // Small tablets
    md: '768px',   // Tablets
    lg: '1024px',  // Laptops
    xl: '1280px',  // Desktops
    '2xl': '1536px', // Large desktops
  },

  // Media queries helpers
  media: {
    xs: '@media (max-width: 479px)',
    sm: '@media (max-width: 639px)',
    md: '@media (max-width: 767px)',
    lg: '@media (max-width: 1023px)',
    xl: '@media (max-width: 1279px)',
    '2xl': '@media (max-width: 1535px)',
  },
} as const;

export type Theme = typeof theme;
