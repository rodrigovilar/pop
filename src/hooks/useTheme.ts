import { theme as baseTheme } from '../styles/theme';

/**
 * Hook that provides a simplified theme object for narrative components
 * Maps the complex theme structure to a simpler one expected by components
 */
export const useTheme = () => {
  return {
    colors: {
      background: baseTheme.colors.background.primary,
      surface: baseTheme.colors.background.elevated,
      text: baseTheme.colors.text.primary,
      textSecondary: baseTheme.colors.text.secondary,
      success: baseTheme.colors.status.success,
      error: baseTheme.colors.status.error,
      accent: baseTheme.colors.accent[500],
      warning: baseTheme.colors.status.warning,
    },
  };
};
