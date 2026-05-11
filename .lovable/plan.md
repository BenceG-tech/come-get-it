# "Miért éri meg mindenkinek?" szekció áttervezése

A főoldali `BenefitsSection` kártyáit a feltöltött screenshot stílusára alakítjuk át — kép-háttérrel, felül kis kerek ikonnal, alul bal-igazított címmel és egy rövid leírással. A jelenlegi 4 kártya helyett **5 kártya** lesz egy sorban, a screenshot szerint.

## Mit változtatunk

### 1. `src/components/BenefitsSection.tsx`
- **5 kártya** (jelenlegi 4 helyett):
  1. **Felhasználók** — `Users` ikon
  2. **Vendéglátóhelyek** — `Store` / `Home` ikon
  3. **Italmárkák** — `Wine` ikon
  4. **Rewards Partnerek** — `Gift` ikon
  5. **Közösség** — `Heart` ikon
- **Layout**: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5`, minden kártya egyforma magas, képpel a háttérben.
- **Kártya szerkezet** (a screenshot pontos utánzása):
  - Háttérkép cover, dark gradient overlay (felül enyhe, alul erősebb fekete).
  - **Bal felső sarok**: kis kerek azúr-szegélyű ikon-medál (kb. 36-40px).
  - **Bal alsó / alsó harmad**: 
    - Felirat: rövid cím nagy betűvel, **uppercase, font-anton**, balra zárva.
    - Alatta: 1 db rövid leírás (max ~10 szó), `text-white/70`, 2-3 sor.
  - Nincs bullet pont, nincs hosszabb body szöveg.
  - Hover: enyhe lift + azúr glow border (megmarad a brandes feel).
- **Aspect ratio**: portrait-szerű (kb. `aspect-[3/4]` vagy `min-h-[260px]`), hogy a kép dominálhasson.
- I18n kulcsok frissítése a `hu.json`-ban (`benefits.user.title/desc`, `benefits.venue.title/desc`, `benefits.brand.title/desc`, `benefits.rewards.title/desc`, `benefits.community.title/desc`) — `en.json` is.

### 2. Új kép-eszközök (`src/assets/benefits/`)
5 új, releváns kép — **premium minőségű, brand-konform** (sötét, azúr/cyan fényekkel, mozis hangulat). Mindegyik portrait orientációban, tartalom-fókusszal:
1. `felhasznalok.jpg` — fiatalok koccintanak egy bárban, meleg fények + cyan accent.
2. `vendeglatohelyek.jpg` — elegáns bár belseje, palackok, hangulatvilágítás.
3. `italmarkak.jpg` — prémium koktél/ital felvétel sötét háttéren cyan glow-val.
4. `rewards-partnerek.jpg` — telefon az appal egy kéz tartja, bár környezetben.
5. `kozosseg.jpg` — kézfogás vagy közösségi pillanat, sötét bár, neon visszfény.

(A jelenlegi `lokacio-push.jpg`, `uj-vendegek.jpg` stb. képek megmaradnak más szekcióknak — ezek külön set lesznek.)

## Mi NEM változik
- A szekció címe (`Miért éri meg mindenkinek?`) és pozíciója.
- A `bg-nf-background` szekció-háttér és nf-section-glow.
- Más szekciók, navigáció, footer.
- Brand színek és pill-button stílus.

## Technikai részletek
- Tailwind: `bg-cover bg-center`, dupla overlay (gradient + opcionális azúr radial accent), `border-nf-primary/20 → /60` hover.
- Ikon-medál: `w-10 h-10 rounded-full border border-nf-primary/40 bg-nf-primary/10`, ikon `w-5 h-5 text-nf-primary`.
- Felirat: `font-anton uppercase tracking-tight text-base md:text-lg`, leírás `text-xs md:text-sm text-white/70 leading-relaxed`.
- Képgenerálás: `imagegen` premium tier, transparent_background=false, kb. 768x1024 (portrait).

Jóváhagyás után generálom az 5 új képet és frissítem a komponenst + i18n fájlokat.
