## Cél

Egy nagy, mindent magában foglaló **Come Get It Master Knowledge Document**, amit bármelyik LLM-nek / AI-nak odaadhatsz, és teljesen átlátja a projektet — brand, termék, üzleti modell, számok, csapat, roadmap, technológia, hangnem, vizuális identitás.

## Formátum

Két párhuzamos fájl, ugyanabból a forrásból generálva:

1. **`come-get-it-master-knowledge.md`** — strukturált Markdown, ez az LLM-barát formátum (nagy kontextusablakba bemásolható, vagy fájlként feltölthető ChatGPT / Claude / Gemini / Perplexity-hez). Ez a fő deliverable.
2. **`come-get-it-master-knowledge.pdf`** — Neon Fidelity stílusú PDF (#050505 bg, cyan border-cards, Liberation Sans, logó), hogy embernek is olvasható legyen ugyanaz a tartalom.

Mindkettő `/mnt/documents/`-be kerül, `<lov-artifact>` taggel átadva.

## Tartalom (fejezetenként)

1. **One-liner & Elevator pitch** (HU + EN)
2. **Brand identitás** — név, domain, logó-leírás, színpaletta (#050505 / #00bcd4), tipográfia (Anton + Inter), hangnem ("Neon Fidelity"), tegező magyar nyelv, vizuális kulcsszavak
3. **Termék — mit csinál az app** — 4 lépés (Drink → Link → Earn → Give), képernyők leírása, user journey
4. **GIVE — társadalmi felelősség** — 1 beváltott ital = 1 napi tiszta ivóvíz, kumulatív számláló
5. **Üzleti modell** — ingyenes pontgyűjtés, Plus subscription **990 Ft/hét vagy 2 990 Ft/hó** (napi 1 ingyen ital), venue commission, brand sponsorship, rewards partner network
6. **Piac** — frissített számok: ~38 000 F&B HU, ~5 500 BP, ~2 000 BP target venue, ~150-200k elérhető user, TAM 15-30 Mrd Ft, BP SAM 5-8 Mrd Ft, SOM Phase 1 ~15-72 M Ft/év
7. **Célközönségek** — fogyasztó, vendéglátóhely, italmárka, rewards partner
8. **Verseny & differenciálás** — Dusk benchmark (UK), miért más a Come Get It (GIVE + hibrid sub + Budapest-first)
9. **Roadmap** — Phase 0 waitlist → Phase 1 BP soft launch → Phase 2 BP scale → Phase 3 országos → Phase 4 régiós
10. **Csapat & alapító** — Bence Gátai, marketing + Corvinus, solo founder, AI-first build
11. **Tech stack** — React 18 + Vite + TS + Tailwind + shadcn, Supabase (RLS, Edge Functions), React Query, framer-motion, deployed Lovable, custom domain come-get-it.app
12. **Architektúra & funkciók** — landing (waitlist-only), partner sub-pages (/vendeglatohelyek, /italmarkak, /rewards-partners, /partnerek hub, /come-get-it-accelerator), admin RBAC (user_roles tábla), email notifications (Edge Function)
13. **Status & ismert hiányosságok** — mi kész, mi hiányzik (Salt Edge integráció, RevenueCat, push, edge function bugok, latitude oszlop)
14. **Befektetési ask** — 3M / 5M / 8M Ft scenáriók, mire megy, milestone-ok, equity vs. convertible loan vs. profit-share opciók
15. **Kapcsolat & linkek** — hello@come-get-it.app, +36 70 585 2053, IG/TikTok @comegetit_app, főbb URL-ek
16. **Glossary** — kulcsfogalmak rövid definíciókkal (GIVE, Plus, Founding Partner, CSR impact, stb.)
17. **Prompt-utasítás LLM-nek** — utolsó szekció: "Te most a Come Get It tudásbázisát kaptad meg. Használd ezeket a tényeket, ne találj ki újat. Magyarul válaszolj alapból, kivéve ha angolul kérdeznek."

## Technikai részletek

- Forrás: egy közös Python script (`/tmp/master_doc.py`) — egy nagy Markdown stringből generálja az `.md`-t, és ugyanabból a tartalomból építi a PDF-et reportlab-bal (Neon Fidelity stílus, Liberation Sans, logó cover-en, cyan border-cards).
- PDF QA: `pdftoppm` minden oldalon, Ő/ű karakterek és layout ellenőrzés.
- Verzió: `_v1` suffix, hogy később bővíthető legyen.

## Megjegyzés

Ez tisztán artifact-generálás, az app forráskódját nem érinti. Ha jónak látod, jóváhagyás után indítom.
