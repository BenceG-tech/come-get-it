## Cél

A `06-rewards-partnerek.pdf` újragenerálása, mert az előző verzióban valami elcsúszott a layoutban (valószínűleg a teljes-oldalas screenshot készítésekor a lazy-load / animáció / sticky elemek miatt).

## Lépések

1. **Friss mobil screenshot készítése** a `/rewards-partners` oldalról Playwright-tal:
   - 390×844 viewport, iPhone user agent, magyar locale
   - Navigáció után várunk `networkidle`-ig
   - Lassú scroll végig az oldalon, hogy minden lazy-loaded elem (képek, framer-motion animációk, IntersectionObserver-triggerelt szekciók) betöltsön és a végleges állapotba kerüljön
   - Vissza scroll a tetejére, várakozás
   - Bármilyen sticky/floating elem (pl. CustomerSupport widget, StickyCallToAction) elrejtése CSS-injekcióval, hogy ne takarjon tartalmat
   - `full_page=True` screenshot

2. **PDF újragenerálása** a friss PNG-ből:
   - Felszeletelés A4 arányú lapokra (ugyanaz a logika mint a többi PDF-nél)
   - Mentés: `/mnt/documents/06-rewards-partnerek_v2.pdf`

3. **QA**: a PDF lapok képpé konvertálása (`pdftoppm`) és vizuális ellenőrzés — szövegátfedés, levágott elemek, üres lapok, sticky overlay maradványok keresése. Ha hiba, fix és újra.

4. **Átadás**: `<lov-artifact>` tag a `06-rewards-partnerek_v2.pdf`-hez.

## Megjegyzés

Az eredeti `06-rewards-partnerek.pdf` megmarad referenciának, az új `_v2` suffix-szel készül, hogy össze lehessen hasonlítani.
