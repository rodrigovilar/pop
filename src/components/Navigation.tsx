import { useI18n } from '../contexts/I18nContext';
import { theme } from '../styles/theme';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const { t } = useI18n();

  const pages = [
    { id: 'overview', label: t('navigation.overview') },
    { id: 'dca', label: t('navigation.dca') },
    { id: 'about', label: t('navigation.about') },
  ];

  return (
    <nav style={{
      borderBottom: `2px solid ${theme.colors.secondary[200]}`,
      marginBottom: theme.spacing['2xl'],
      backgroundColor: theme.colors.background.tertiary,
      boxShadow: theme.shadows.sm,
    }}>
      <div style={{
        display: 'flex',
        gap: theme.spacing['2xl'],
        maxWidth: '900px',
        margin: '0 auto',
        padding: `0 ${theme.spacing.md}`,
      }}>
        {pages.map((page) => (
          <button
            key={page.id}
            onClick={() => onNavigate(page.id)}
            style={{
              background: 'none',
              border: 'none',
              padding: `${theme.spacing.lg} 0`,
              cursor: 'pointer',
              fontSize: theme.typography.fontSize.base,
              fontWeight: currentPage === page.id ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium,
              color: currentPage === page.id ? theme.colors.primary[700] : theme.colors.text.secondary,
              borderBottom: currentPage === page.id ? `3px solid ${theme.colors.primary[600]}` : '3px solid transparent',
              transition: theme.transitions.base,
            }}
            onMouseEnter={(e) => {
              if (currentPage !== page.id) {
                e.currentTarget.style.color = theme.colors.primary[600];
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== page.id) {
                e.currentTarget.style.color = theme.colors.text.secondary;
              }
            }}
          >
            {page.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
