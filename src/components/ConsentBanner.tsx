import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getConsent, onConsentChange, setConsent, type ConsentChoice } from '@/lib/consent';
import { metaPixelEnabled } from '@/lib/metaPixel';

// Sütisáv a hirdetésméréshez. Csak akkor jelenik meg, ha be van állítva Meta Pixel, és még nincs választás.
export const ConsentBanner: React.FC = () => {
  const { pathname } = useLocation();
  const [choice, setChoice] = useState<ConsentChoice | null>(() => getConsent());

  useEffect(() => onConsentChange(setChoice), []);

  if (!metaPixelEnabled || choice !== null || pathname.startsWith('/admin')) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Sütibeállítások"
      className="fixed bottom-0 left-0 right-0 z-[60] border-t border-nf-primary/30 bg-nf-background/95 backdrop-blur px-4 py-4"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center gap-4">
        <p className="text-sm text-white/80 leading-relaxed flex-1">
          Hirdetésmérés: ha elfogadod, a Meta Pixel sütije megmutatja nekünk, melyik hirdetésünkből érkeztél.
          Elutasítással is minden ugyanúgy működik.{' '}
          <Link to="/adatvedelmi-szabalyzat#sutik" className="underline text-nf-primary">Részletek</Link>
        </p>
        <div className="flex gap-3 shrink-0">
          <Button variant="outline" onClick={() => setConsent('denied')}>Elutasítom</Button>
          <Button variant="outline" onClick={() => setConsent('granted')}>Elfogadom</Button>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;
