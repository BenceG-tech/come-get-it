import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { analytics } from '@/lib/analytics';

interface BreadcrumbItem {
  label: string;
  path: string;
  active?: boolean;
}

const PAGE_BREADCRUMBS: Record<string, BreadcrumbItem[]> = {
  '/': [{ label: 'Főoldal', path: '/', active: true }],
  '/vendeglatohelyek': [
    { label: 'Főoldal', path: '/' },
    { label: 'Vendéglátóhelyek', path: '/vendeglatohelyek', active: true }
  ],
  '/italmarkak': [
    { label: 'Főoldal', path: '/' },
    { label: 'Italmárkák', path: '/italmarkak', active: true }
  ],
  '/rewards-partners': [
    { label: 'Főoldal', path: '/' },
    { label: 'Rewards-partnerek', path: '/rewards-partners', active: true }
  ],
  '/come-get-it-accelerator': [
    { label: 'Főoldal', path: '/' },
    { label: 'Gyorsítóprogram', path: '/come-get-it-accelerator', active: true }
  ]
};

export const DynamicBreadcrumb: React.FC = () => {
  const location = useLocation();
  const breadcrumbs = PAGE_BREADCRUMBS[location.pathname] || [];

  const handleBreadcrumbClick = (path: string) => {
    analytics.track('breadcrumbNavigation', {
      fromPage: location.pathname,
      toPage: path,
      timestamp: Date.now()
    });
  };

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-16 z-40 animate-fade-in"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((item, index) => (
            <li key={item.path} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />
              )}
              {item.active ? (
                <span className="text-foreground font-medium flex items-center">
                  {index === 0 && <Home className="h-4 w-4 mr-1" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  onClick={() => handleBreadcrumbClick(item.path)}
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center group"
                >
                  {index === 0 && <Home className="h-4 w-4 mr-1 group-hover:text-electric-300 transition-colors" />}
                  <span className="group-hover:text-electric-300 transition-colors">
                    {item.label}
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};