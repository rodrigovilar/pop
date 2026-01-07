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
      borderBottom: `1px solid ${theme.colors.border.light}`,
      marginBottom: theme.spacing['2xl'],
      backgroundColor: theme.colors.background.secondary,
      boxShadow: theme.shadows.elevatedCard,
    }}>
      <div style={{
        display: 'flex',
        gap: theme.spacing['3xl'],
        maxWidth: '1000px',
        margin: '0 auto',
        padding: `0 ${theme.spacing.xl}`,
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
              fontWeight: currentPage === page.id ? theme.typography.fontWeight.bold : theme.typography.fontWeight.medium,
              color: currentPage === page.id ? theme.colors.accent[400] : theme.colors.text.secondary,
              borderBottom: currentPage === page.id ? `2px solid ${theme.colors.accent[500]}` : '2px solid transparent',
              transition: theme.transitions.smooth,
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              if (currentPage !== page.id) {
                e.currentTarget.style.color = theme.colors.text.primary;
                e.currentTarget.style.borderBottomColor = theme.colors.border.medium;
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== page.id) {
                e.currentTarget.style.color = theme.colors.text.secondary;
                e.currentTarget.style.borderBottomColor = 'transparent';
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
