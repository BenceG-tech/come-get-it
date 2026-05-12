# Új doksi-csomag — v3 + extra anyagok

A korábbi `nf_gen.py` Neon Fidelity engine-t kibővítem **logó-támogatással** és **screenshot-támogatással** (a honlapról + meglévő app mockup-okból). Mindent egy menetben legyártok, vizuális QA-val.

## Mit gyártok le (egy körben, párhuzamosan)

### A) Frissített befektetői csomag (v2)
1. **11-befekteto-overview_v2.pdf** — frissítve a részletes számokkal, status %-okkal, screenshotokkal a hero/app képekből, logóval a borítón
2. **12-befekteto-1pager_v2.pdf** — barát-verzió (3-5M Ft scenárió kiemelve)
3. **13-letter-of-intent-sablon_v2.pdf** — három struktúra (equity / convertible / profit-share)

### B) Barát-specifikus csomag (új)
4. **14-barat-bemutato.pdf** — személyes hangvételű 6-8 oldal: "miért most, miért én, miért te" + konkrét milestone & return tábla (3M / 5M / 8M Ft scenáriók)
5. **15-milestone-return-tabla.pdf** — 1-2 oldalas vizuális: 24 hónapos timeline, pesszimista/reális/optimista return
6. **16-barat-loi-sablon.pdf** — egyszerű, baráti hangvételű LOI (equity vagy kamatos kölcsön opció)

### C) Sales & Onboarding csomag (új)
7. **17-cold-email-pack.pdf** — 9 email: 3 célcsoport (venue / brand / reward partner) × 3 variáció (cold / follow-up / breakup)
8. **18-linkedin-dm-scripts.pdf** — DM scriptek + connection request szövegek
9. **19-venue-onboarding-playbook.pdf** — 30 napos venue onboarding (week 1-4 task lista, KPI-k)
10. **20-in-venue-print-kit-brief.pdf** — tent-card / QR poszter / ablakmatrica design brief és QR-flow

### D) PR & Launch csomag (új)
11. **21-sajtokozlemeny-launch.pdf** — szeptemberi launch press release sablon
12. **22-founder-bio-qa.pdf** — Bence bio + 15 várható kérdés-válasz interjúkhoz

## Vizuális frissítések az engine-ben
- **Logo a borítón**: `src/assets/come-get-it-logo.webp` betöltése reportlab-bal (PIL-en keresztül), centrálva a kicker felett
- **Screenshot blokk**: új `screenshot_card()` helper — phone-frame szerű cyan border-card képpel és caption-nel. Forrás: `public/lovable-uploads/*.webp` (DRINK / LINK / EARN képek) + browser--screenshot a `/` és `/vendeglatohelyek` hero-kból
- **Footer**: minden lapon `come-get-it.app · hello@come-get-it.app · Bence Gátai` egységesen
- **Stílus változatlan**: #050505 bg, cyan #00bcd4 border-cards, NEM tömör kék panelek, Liberation Sans

## QA folyamat
Minden PDF-et `pdftoppm`-mel képpé renderelek, és minden oldalt átnézek (overflow, overlap, kontraszt, logó-pozíció, screenshot minőség). Hibákat javítom, újra renderelem, amíg tiszta.

## Output
Minden a `/mnt/documents/` alá kerül, és minden fájlhoz `<lov-artifact>` taggel adom át.

## Megjegyzés
Mivel ez **artifact-generálás** (nem app-fejlesztés), nem módosítok forrásfájlt — csak a `/tmp/` engine-t és a `/mnt/documents/` outputokat. Az app működésére semmilyen hatás.
