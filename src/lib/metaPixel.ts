import { getConsent, onConsentChange } from './consent';

// A Meta Events Managerben létrehozott dataset (Pixel) azonosítója.
// Üresen a Pixel nem töltődik be, és a sütisáv sem jelenik meg.
export const META_PIXEL_ID: string = import.meta.env.VITE_META_PIXEL_ID ?? '';
export const metaPixelEnabled = META_PIXEL_ID.length > 0;

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: Fbq;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

let loaded = false;

// A Meta hivatalos alapkódja, csak hozzájárulás után futtatva
const load = () => {
  if (loaded || !metaPixelEnabled || typeof window === 'undefined') return;
  loaded = true;

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as Fbq;
  fbq.queue = [];
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);

  // automatikus gomb- és űrlapfigyelés kikapcsolva: csak azt küldjük, amit itt kifejezetten mérünk
  fbq('set', 'autoConfig', false, META_PIXEL_ID);
  fbq('init', META_PIXEL_ID);
  fbq('track', 'PageView');
};

export const initMetaPixel = () => {
  if (!metaPixelEnabled) return;
  if (getConsent() === 'granted') load();
  onConsentChange((choice) => {
    if (choice === 'granted') {
      if (loaded) window.fbq?.('consent', 'grant');
      else load();
    } else if (loaded) {
      window.fbq?.('consent', 'revoke');
    }
  });
};

// Sikeres előregisztráció vagy partnerjelentkezés. Személyes adatot nem küldünk.
export const trackMetaLead = (contentName: string) => {
  if (!loaded || getConsent() !== 'granted') return;
  window.fbq?.('track', 'Lead', { content_name: contentName });
};
