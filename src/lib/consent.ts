// Marketing-süti hozzájárulás (Meta Pixel). Csak ebben a böngészőben tároljuk.
export type ConsentChoice = 'granted' | 'denied';

const KEY = 'cgi-consent-v1';
const listeners = new Set<(choice: ConsentChoice | null) => void>();

export const getConsent = (): ConsentChoice | null => {
  try {
    const value = localStorage.getItem(KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
};

// null = a választás törlése: a sütisáv újra megjelenik (lábléc: Sütibeállítások)
export const setConsent = (choice: ConsentChoice | null) => {
  try {
    if (choice) localStorage.setItem(KEY, choice);
    else localStorage.removeItem(KEY);
  } catch {
    // privát mód: a választás csak erre a látogatásra él
  }
  listeners.forEach((listener) => listener(choice));
};

export const onConsentChange = (listener: (choice: ConsentChoice | null) => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
