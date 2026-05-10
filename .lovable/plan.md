## Hero szekció újrarendezése (főoldal)

A jelenlegi mobil hero túl zsúfolt: cím + 4 soros leírás + 847+ counter + 2 gomb + founding note → a telefon mockup csak scroll után jelenik meg. Az alábbi módosítások a fold-on belülre hozzák a mockupot, és letisztítják a hierarchiát.

### 1. Copy rövidítése (i18n)

**Fájl:** `src/i18n/hu.json` és `src/i18n/en.json`

`hero.subtitle` átírása:
- HU: `"Partnerhelyek Budapesten. Napi ingyen ital. Minden beváltással tiszta ivóvíz egy rászorulónak."`
- EN: ekvivalens rövid változat (`"Partner venues in Budapest. A free drink every day. Each redemption funds clean water for someone in need."`)

A többi kulcs (`badge`, `title_line1`, `title_line2`, `cta`, `cta_secondary`, `founding_note`) változatlan marad.

### 2. Mobil sorrend újraépítése

**Fájl:** `src/components/HeroSection.tsx`

Mobilon (single column) az új top-to-bottom sorrend:

```text
[Badge]
H1 (title_line1 + title_line2)
Rövid subtitle (1 mondat)
[CTA elsődleges]
[CTA másodlagos]
[Telefon mockup]  ← közvetlenül a gombok alatt, minimális padding
[Founding note]   ← utolsó elem
```

Desktop (`lg:`) marad kétoszlopos: bal = badge + H1 + subtitle + CTA-k + founding note, jobb = mockup. A bal oszlopban a sorrend desktopon nem változik.

Implementáció: a jelenlegi két `<div>` (bal text-block + jobb mockup-block) helyett mobilon flex-orderrel rendezzük át a részeket, vagy a mockup blokkját mobilon a CTA gombok után, a founding note elé renderejlük (`order` osztályok: pl. mockup `order-3 lg:order-none`, founding-note `order-4 lg:order-none`). A `SocialProof` komponenst kivesszük a hero JSX-ből.

A mockup konténer mobil `min-h`-ját csökkentjük (`min-h-[420px]` → `min-h-[380px]`) és a vertikális paddingot szűkítjük, hogy ne legyen üres rés.

### 3. SocialProof (847+) eltávolítása a heróból

A `<SocialProof />` hívást és az importot töröljük a `HeroSection.tsx`-ből. A komponens fájlja marad (más helyen nincs használva, de nem törlünk).

### 4. Amit NEM változtatunk

- CTA labelek, badge szöveg, H1, founding note copy
- Form, analytics, route-ok, SEO/OG, prerender, navigáció
- Háttér (Budapest night image, glow-k, fade-ek)
- PhoneMockup komponens, képek (`appImages` továbbra is a meglévő `/lovable-uploads/...` képek — IMG_5872 cserét nem kérünk, mert nincs feltöltve)
- Aloldalak (Vendéglátóhelyek, Italmárkák, Rewards Partners) heró szekciói

### Érintett fájlok

- `src/i18n/hu.json`
- `src/i18n/en.json`
- `src/components/HeroSection.tsx`

### Ellenőrzés

A 402×700-as preview viewporton ellenőrzöm, hogy a CTA gombok és a telefon mockup felső kétharmada a fold-on belülre kerül-e, és nincs horizontális overflow.
