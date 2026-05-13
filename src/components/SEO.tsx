import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical: string; // absolute or path; will be resolved against come-get-it.app
  image?: string; // absolute URL
  type?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const SITE = 'https://come-get-it.app';
const DEFAULT_IMAGE = 'https://come-get-it.app/og/og-main-v3.jpg?v=20260513b';

const upsertMeta = (selector: string, attrs: Record<string, string>) => {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
    document.head.appendChild(el);
  } else {
    Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
  }
  return el;
};

const upsertLink = (rel: string, href: string) => {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
  return el;
};

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
  jsonLd,
}) => {
  useEffect(() => {
    const canonicalUrl = canonical.startsWith('http')
      ? canonical
      : `${SITE}${canonical.startsWith('/') ? '' : '/'}${canonical}`;

    const previousTitle = document.title;
    document.title = title;

    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: noindex ? 'noindex,nofollow' : 'index,follow',
    });

    upsertLink('canonical', canonicalUrl);

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image });
    upsertMeta('meta[property="og:image:secure_url"]', { property: 'og:image:secure_url', content: image });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'Come Get It' });
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'hu_HU' });

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image });

    // JSON-LD
    const scripts: HTMLScriptElement[] = [];
    if (jsonLd) {
      const blocks = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      blocks.forEach((block) => {
        const s = document.createElement('script');
        s.type = 'application/ld+json';
        s.dataset.seoManaged = 'true';
        s.text = JSON.stringify(block);
        document.head.appendChild(s);
        scripts.push(s);
      });
    }

    return () => {
      document.title = previousTitle;
      scripts.forEach((s) => s.parentNode?.removeChild(s));
    };
  }, [title, description, canonical, image, type, noindex, jsonLd]);

  return null;
};

export default SEO;
