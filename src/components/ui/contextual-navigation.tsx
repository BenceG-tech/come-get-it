import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { analytics } from '@/lib/analytics';

interface NextStepSuggestion {
  title: string;
  description: string;
  action: string;
  path?: string;
  external?: boolean;
}

interface RelatedPage {
  title: string;
  description: string;
  path: string;
  badge?: string;
}

const NEXT_STEPS: Record<string, NextStepSuggestion[]> = {
  '/vendeglatohelyek': [
    {
      title: 'Következő lépés',
      description: 'Töltsd ki a jelentkezési űrlapot és csatlakozz a hálózatunkhoz',
      action: 'Jelentkezés indítása',
      path: '#application'
    }
  ],
  '/italmarkak': [
    {
      title: 'Kapcsolatfelvétel',
      description: 'Beszéljük meg a lehetőségeket és indítsuk el a partnerséget',
      action: 'Kapcsolat felvétele',
      path: '#contact'
    }
  ],
  '/rewards-partners': [
    {
      title: 'Partner alkalmazás',
      description: 'Csatlakozz a rewards programunkhoz és növeld az ügyfélkörödet',
      action: 'Jelentkezés',
      path: '#partner-signup'
    }
  ],
  '/come-get-it-accelerator': [
    {
      title: 'Pilot program',
      description: 'Jelentkezz a próba programunkra és légy az elsők között',
      action: 'Pilot jelentkezés',
      path: '#pilot-signup'
    }
  ]
};

const RELATED_PAGES: Record<string, RelatedPage[]> = {
  '/vendeglatohelyek': [
    {
      title: 'Italmárkák',
      description: 'Fedezd fel, hogyan működünk együtt az italmárkákkal',
      path: '/italmarkak',
      badge: 'Partnerek'
    },
    {
      title: 'Rewards-partnerek',
      description: 'Tudj meg többet a rewards rendszerünkről',
      path: '/rewards-partners',
      badge: 'Előnyök'
    }
  ],
  '/italmarkak': [
    {
      title: 'Vendéglátóhelyek',
      description: 'Nézd meg, hogyan dolgozunk a vendéglátóhelyekkel',
      path: '/vendeglatohelyek',
      badge: 'Hálózat'
    },
    {
      title: 'Gyorsítóprogram',
      description: 'Gyorsítsd fel a növekedésed a programunkkal',
      path: '/come-get-it-accelerator',
      badge: 'Fejlődés'
    }
  ],
  '/rewards-partners': [
    {
      title: 'Vendéglátóhelyek',
      description: 'Ismerd meg a vendéglátóhely partnereinket',
      path: '/vendeglatohelyek',
      badge: 'Hálózat'
    },
    {
      title: 'Gyorsítóprogram',
      description: 'Fedezd fel a gyorsítóprogramunkat',
      path: '/come-get-it-accelerator',
      badge: 'Lehetőség'
    }
  ],
  '/come-get-it-accelerator': [
    {
      title: 'Vendéglátóhelyek',
      description: 'Nézd meg a vendéglátóhely lehetőségeket',
      path: '/vendeglatohelyek',
      badge: 'Alapok'
    },
    {
      title: 'Jutalom Partnerek',
      description: 'Tudj meg többet a jutalom lehetőségekről',
      path: '/rewards-partners',
      badge: 'Extra'
    }
  ]
};

export const NextStepsSuggestion: React.FC = () => {
  const location = useLocation();
  const nextSteps = NEXT_STEPS[location.pathname] || [];

  const handleActionClick = (action: string, path?: string) => {
    analytics.track('nextStepAction', {
      page: location.pathname,
      action,
      targetPath: path,
      timestamp: Date.now()
    });
  };

  if (nextSteps.length === 0) return null;

  return (
    <Card className="bg-gradient-to-r from-electric-300/10 to-ocean-300/10 border-electric-300/30">
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <Lightbulb className="h-6 w-6 text-electric-300 mt-1 flex-shrink-0" />
          <div className="flex-1">
            {nextSteps.map((step, index) => (
              <div key={index}>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {step.description}
                </p>
                <Button
                  onClick={() => handleActionClick(step.action, step.path)}
                  className="bg-electric-300 hover:bg-electric-400 text-black font-semibold"
                >
                  {step.action}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const RelatedPagesSection: React.FC = () => {
  const location = useLocation();
  const relatedPages = RELATED_PAGES[location.pathname] || [];

  const handleRelatedPageClick = (title: string, path: string) => {
    analytics.track('relatedPageNavigation', {
      fromPage: location.pathname,
      toPage: path,
      pageTitle: title,
      timestamp: Date.now()
    });
  };

  if (relatedPages.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-foreground">
        Kapcsolódó Lehetőségek
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relatedPages.map((page, index) => (
          <Card key={index} className="group hover:shadow-lg hover:shadow-electric-300/20 transition-all duration-300 border-border/50 hover:border-electric-300/50">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg text-foreground group-hover:text-electric-300 transition-colors">
                  {page.title}
                </h3>
                {page.badge && (
                  <span className="text-xs bg-electric-300/20 text-electric-300 px-2 py-1 rounded-full">
                    {page.badge}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground mb-4">
                {page.description}
              </p>
              <Link
                to={page.path}
                onClick={() => handleRelatedPageClick(page.title, page.path)}
                className="inline-flex items-center text-electric-300 hover:text-electric-400 font-medium group-hover:underline"
              >
                Tudj meg többet
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};