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
  // Color Palette - Bitcoin Dark Mode
  colors: {
    // Primary: Deep Slate/Blue (Backgrounds, Depth)
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
      900: '#0f172a', // Main Background
      950: '#020617', // Darker Depth
    },

    // Secondary: Cool Gray (Neutral elements)
    secondary: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },

    // Accent: Bitcoin Orange (Vibrant, Energetic)
    accent: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c', // Light Orange
      500: '#F7931A', // Bitcoin Core Orange
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
      glow: 'rgba(247, 147, 26, 0.5)', // For glow effects
    },

    // Backgrounds
    background: {
      primary: '#0f172a',    // Deep Blue/Black
      secondary: '#1e293b',  // Card/Panel
      tertiary: '#334155',   // Inputs/Hover
      overlay: 'rgba(15, 23, 42, 0.8)', // Glassmorphism
    },

    // Text
    text: {
      primary: '#f8fafc',    // Almost White
      secondary: '#cbd5e1',  // Light Gray
      tertiary: '#94a3b8',   // Muted
      inverse: '#0f172a',    // Dark text for orange buttons
    },

    // Status Colors
    status: {
      success: '#10b981', // Emerald
      error: '#ef4444',   // Red
      warning: '#f59e0b', // Amber
      info: '#3b82f6',    // Blue
    },
  },

  // Spacing
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
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

  // Shadows (Glow effects included)
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    glow: '0 0 20px rgba(247, 147, 26, 0.2)', // Orange aura
  },

  // Transitions
  transitions: {
    default: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    base: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', // Alias for compatibility
    slow: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export type Theme = typeof theme;
