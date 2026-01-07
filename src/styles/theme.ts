/**
 * Design System - PoP (Proof of Patience)
 *
 * Theme focused on:
 * - Calmness and patience through fresh, airy design
 * - Blue/Green gradients representing flow and growth
 * - Long-term thinking with clean, open spaces
 * - Natural, organic movement (breeze effect)
 */

export const theme = {
  // Color Palette - Light Mode with Blue/Green Accents
  colors: {
    // Primary: Blue (Main brand color) - Fresh and trustworthy
    primary: {
      50: '#eff6ff',   // Very light blue
      100: '#dbeafe',  // Light blue
      200: '#bfdbfe',  // Lighter blue
      300: '#93c5fd',  // Light-medium blue
      400: '#60a5fa',  // Medium blue
      500: '#3b82f6',  // Core blue (rgb(59, 130, 246))
      600: '#2563eb',  // Darker blue
      700: '#1d4ed8',  // Deep blue
      800: '#1e40af',  // Very deep blue
      900: '#1e3a8a',  // Darkest blue
      950: '#172554',  // Ultra dark blue
    },

    // Secondary: Green (Growth, positivity) - Natural and calming
    secondary: {
      50: '#ecfdf5',   // Very light green
      100: '#d1fae5',  // Light green
      200: '#a7f3d0',  // Lighter green
      300: '#6ee7b7',  // Light-medium green
      400: '#34d399',  // Medium green
      500: '#10b981',  // Core green (rgb(16, 185, 129))
      600: '#059669',  // Darker green
      700: '#047857',  // Deep green
      800: '#065f46',  // Very deep green
      900: '#064e3b',  // Darkest green
    },

    // Accent: Bitcoin Orange (Heritage color) - Kept for BTC references
    accent: {
      50: '#fff8f0',
      100: '#ffeed9',
      200: '#ffddb3',
      300: '#ffc68a',
      400: '#ffa854',
      500: '#F7931A', // Bitcoin Core Orange
      600: '#e67e00',
      700: '#c96d00',
      800: '#a85a00',
      900: '#8a4900',
      glow: 'rgba(247, 147, 26, 0.35)',
      glowStrong: 'rgba(247, 147, 26, 0.6)',
    },

    // Backgrounds - Light, airy, clean
    background: {
      primary: '#ffffff',    // Pure white
      secondary: '#f8fafc',  // Very light gray-blue
      tertiary: '#f1f5f9',   // Light gray-blue
      elevated: '#ffffff',   // White for cards
      overlay: 'rgba(255, 255, 255, 0.95)', // Light overlay
      overlayLight: 'rgba(255, 255, 255, 0.7)', // Lighter overlay
    },

    // Text - Dark on light
    text: {
      primary: '#0f172a',    // Very dark slate
      secondary: '#475569',  // Dark gray
      tertiary: '#64748b',   // Medium gray
      quaternary: '#94a3b8', // Light gray
      inverse: '#ffffff',    // White text for dark backgrounds
    },

    // Status Colors - Vibrant and clear
    status: {
      success: '#10b981',    // Green (matches secondary)
      successDark: '#059669',// Darker green
      error: '#ef4444',      // Red
      errorDark: '#dc2626',  // Darker red
      warning: '#f59e0b',    // Amber
      warningDark: '#d97706',// Darker amber
      info: '#3b82f6',       // Blue (matches primary)
      infoDark: '#2563eb',   // Darker blue
    },

    // Border colors for subtle separation
    border: {
      subtle: 'rgba(15, 23, 42, 0.05)',
      light: 'rgba(15, 23, 42, 0.1)',
      medium: 'rgba(15, 23, 42, 0.15)',
      strong: 'rgba(15, 23, 42, 0.2)',
    },

    // Gradient combinations for breeze effect
    gradients: {
      blueGreen: 'linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(16, 185, 129) 100%)',
      blueGreenSoft: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
      blueGreenMedium: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)',
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

  // Shadows - Soft elevation for light mode
  shadows: {
    none: 'none',
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 12px -1px rgba(0, 0, 0, 0.08)',
    lg: '0 8px 24px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 16px 48px -8px rgba(0, 0, 0, 0.12)',
    '2xl': '0 24px 60px -12px rgba(0, 0, 0, 0.15)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    // Blue/Green glow effects for accent elements
    glow: '0 0 20px rgba(59, 130, 246, 0.2)',
    glowSoft: '0 0 30px rgba(59, 130, 246, 0.15)',
    glowStrong: '0 0 40px rgba(59, 130, 246, 0.3)',
    glowGreen: '0 0 20px rgba(16, 185, 129, 0.2)',
    // Colored shadows for depth
    elevatedCard: '0 8px 24px -6px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.05)',
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
