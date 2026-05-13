## Cél

1. SEO-tisztítás: a `come-get-it.app` legyen az egyetlen "igazi" domain a Google szemében — a `comegetitapp.com`-ot is felismerje, de mint alternatív nevet, ne mint duplikált oldalt.
2. Új favicon a Come Get It brand színekkel (cyan #00bcd4 + fekete háttér), hogy ne a Lovable logo jöjjön ki Google találatban.

---

## 1. Favicon csere

A jelenlegi `public/favicon.ico` még a Lovable default. Cserére:

- Generálok egy új, kör alakú **"CG"** monogramos favicont a brandnek megfelelően (cyan glow, fekete háttér), 512×512 PNG formátumban — `imagegen` `premium` tier, mert kicsi méreten kell olvashatónak lennie.
- Mentés: `public/favicon.png` és `public/apple-touch-icon.png` (180×180).
- Törlöm a régi `public/favicon.ico`-t (különben a böngésző azt kéri le elsőként).
- `index.html`-ben frissítem a favicon hivatkozásokat:

```html
<link rel="icon" type="image/png" sizes="32x32" href="/favicon.png?v=3">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=3">
```

(A `?v=3` cache-bust segít a böngészőnek és a Google-nek, hogy frissen lekérjék.)

---

## 2. JSON-LD bővítés az alternatív domainnel

Az `index.html`-ben a meglévő `Organization` JSON-LD-be felveszem a `comegetitapp.com`-ot a `sameAs` listához és `url` mellé `alternateName` / `url` mezőkbe is, hogy a Google strukturáltan értse: ugyanaz az entitás:

```json
{
  "@type": "Organization",
  "name": "Come Get It",
  "url": "https://come-get-it.app/",
  "sameAs": [
    "https://comegetitapp.com/",
    "https://www.come-get-it.app/",
    "https://instagram.com/comegetit_app",
    "https://tiktok.com/@comegetit_app"
  ]
}
```

Ezenkívül a `WebSite` blokkhoz hozzáadok egy `alternateName` mezőt ("comegetitapp").

---

## 3. Mit kell **neked** kézzel megcsinálnod (ezt nem tudom kódból)

A Lovable Domains panelen (Project Settings → Domains):

1. A `come-get-it.app` sor **⋯ menü** → **Set as Primary** (ha még nem az).
2. Ezután a `comegetitapp.com`, `www.comegetitapp.com` és `www.come-get-it.app` automatikusan **301-essel** rá fognak redirectelni a primary-re — ez konszolidálja az SEO link‑erőt.
3. Google Search Console-ban add hozzá külön property-ként mindhárom domaint (come-get-it.app, www.come-get-it.app, comegetitapp.com), és kérj újra indexelést a főoldalra. Itt fogja a Google leghamarabb látni az új favicont és a redirecteket is.

---

## Mit nem csinálok

- Nem nyúlok a custom domain DNS-ekhez (ahhoz Lovable UI vagy a registrar kell).
- Nem írok új SEO komponenst — a meglévő `SEO.tsx` és `routes.ts` jó.
- Nem változtatok a robots.txt-n vagy a sitemap-en (ezek már a primary-re mutatnak).

---

## Technikai részletek

- Fájlok érintve: `public/favicon.png` (új), `public/apple-touch-icon.png` (új), `public/favicon.ico` (törlés), `index.html` (favicon link + JSON-LD).
- A favicon képhez: `imagegen` `premium` tier, transparent_background=false (sötét cyan háttér jobban néz ki kis méretben), 512×512.
- Republish kell a változások éles érvényesüléséhez. A Google favicon-újraolvasás napokat-heteket vehet igénybe.
