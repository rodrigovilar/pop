import { useI18n } from '../contexts/I18nContext';

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
      borderBottom: '1px solid #e5e7eb',
      marginBottom: '2rem',
    }}>
      <div style={{
        display: 'flex',
        gap: '2rem',
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 1rem',
      }}>
        {pages.map((page) => (
          <button
            key={page.id}
            onClick={() => onNavigate(page.id)}
            style={{
              background: 'none',
              border: 'none',
              padding: '1rem 0',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: currentPage === page.id ? '600' : '400',
              color: currentPage === page.id ? '#f97316' : '#666',
              borderBottom: currentPage === page.id ? '2px solid #f97316' : '2px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            {page.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
