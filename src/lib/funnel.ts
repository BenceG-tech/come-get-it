import { supabase } from '@/integrations/supabase/client';

// First-party, cookieless funnel measurement for the public site.
// No cookie, no localStorage, no personal data: every page load gets a random
// in-memory visit id, so we can count "how far did this visit get" without
// identifying anyone. Rows land in `web_funnel_events` (insert-only for anon).

const visitId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
  ? crypto.randomUUID()
  : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const isBot = typeof navigator !== 'undefined' && /bot|crawl|spider|headless|lighthouse|prerender/i.test(navigator.userAgent);

const context = () => {
  const params = new URLSearchParams(window.location.search);
  const ua = navigator.userAgent;
  return {
    path: window.location.pathname,
    device: window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop',
    in_app: /Instagram|FBAN|FBAV|TikTok/i.test(ua) ? (/Instagram/i.test(ua) ? 'instagram' : /TikTok/i.test(ua) ? 'tiktok' : 'facebook') : null,
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_content: params.get('utm_content'),
    referrer: document.referrer ? new URL(document.referrer).hostname : null,
  };
};

const sent = new Set<string>();

// The last CTA the visitor pressed, so a signup can be credited to the button that brought them to the form.
let lastCta: string | null = null;
export const setLastCta = (location: string) => { lastCta = location; };
export const getLastCta = () => lastCta;

export const funnel = (event: string, props: Record<string, unknown> = {}, onceKey?: string) => {
  if (typeof window === 'undefined' || isBot) return;
  if (onceKey) {
    if (sent.has(onceKey)) return;
    sent.add(onceKey);
  }
  const ctx = context();
  // Fire and forget: measurement must never break the page.
  // The table is not in the generated types yet, hence the narrow cast.
  const table = (supabase.from as unknown as (name: string) => { insert: (row: object) => PromiseLike<{ error: unknown }> })('web_funnel_events');
  table
    .insert({ visit_id: visitId, event: event.slice(0, 64), props, ...ctx })
    .then(({ error }) => { if (error) console.debug('[funnel]', error); }, () => {});
};

// Scroll depth (25/50/75/90 %) and which landing sections were actually seen.
export const startFunnelTracking = (page: string) => {
  if (typeof window === 'undefined' || isBot) return () => {};
  funnel('page_view', { page }, `page_view:${page}`);

  const startedAt = Date.now();
  const marks = [25, 50, 75, 90];
  let frame = 0;
  const onScroll = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = (window.scrollY / max) * 100;
      for (const m of marks) if (pct >= m) funnel('scroll_depth', { page, percent: m, seconds: Math.round((Date.now() - startedAt) / 1000) }, `scroll:${page}:${m}`);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          const name = el.dataset.funnelSection || el.id || el.classList[0];
          if (name) funnel('section_view', { page, section: name, seconds: Math.round((Date.now() - startedAt) / 1000) }, `section:${page}:${name}`);
        }
      }, { threshold: 0.35 })
    : null;
  // Sections render after mount; observe what exists now and once more shortly after.
  const observe = () => document.querySelectorAll<HTMLElement>('main > section, main [data-funnel-section]').forEach(el => observer?.observe(el));
  observe();
  const later = window.setTimeout(observe, 1500);

  return () => {
    window.removeEventListener('scroll', onScroll);
    cancelAnimationFrame(frame);
    window.clearTimeout(later);
    observer?.disconnect();
  };
};
