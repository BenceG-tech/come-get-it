# Cinematic Scroll Élmény - Mélység és Parallax

## Cél
A főoldalt (`/`) átalakítjuk egy filmes, magával ragadó, 3D-szerű mélységgel rendelkező élménnyé, ahol a görgetés vezérli a rétegek mozgását, a fókuszt és a jelenetek közötti átmeneteket.

---

## Megközelítés - 3 építőelem

### 1. Rétegezett jelenetek (foreground / midground / background)
Minden főbb sectionből (Hero, Drink, Link, Earn) egy "jelenet" lesz, három rétegből felépítve:

```text
┌─────────────────────────────────┐
│  BACKGROUND   (lassú, blur)     │  ← gradiens, ködök, távoli fények
│   ┌─────────────────────────┐   │
│   │  MIDGROUND  (közepes)   │   │  ← absztrakt formák, glow-k
│   │   ┌─────────────────┐   │   │
│   │   │ FOREGROUND      │   │   │  ← telefon mockup, szöveg, CTA
│   │   │ (gyors, éles)   │   │   │
│   │   └─────────────────┘   │   │
│   └─────────────────────────┘   │
└─────────────────────────────────┘
```

### 2. Scroll-vezérelt mozgás (parallax + zoom + fade)
Framer Motion `useScroll` + `useTransform` hook-okkal:
- Background: lassan mozog (0.2x sebesség), enyhe zoom kifelé
- Midground: közepes (0.5x), enyhe eltolódás
- Foreground: 1x sebesség, görgetésre nőhet (zoom-in) vagy halványulhat
- Depth of field: a háttér rétegekre dinamikus `blur()` filter, ami görgetésre erősödik

### 3. Folyamatos átmenetek a section-ök között
- Sticky/pinned section-ök, ahol a tartalom görgetésre animálódik (nem ugrik)
- Egymásba olvadó gradiensek a section határoknál (nincs kemény vágás)
- Cross-fade: ahogy az egyik jelenet kilép, a következő háttere már látszik

---

## Konkrét változtatások

### Új függőség
| Csomag | Cél |
|---|---|
| `framer-motion` | Scroll-vezérelt animációk, parallax, smooth átmenetek |

### Új komponensek (`src/components/cinematic/`)
| Fájl | Felelősség |
|---|---|
| `SceneLayer.tsx` | Egy réteg (bg/mid/fg) parallax sebességgel, blur szinttel, zoom faktorral |
| `CinematicScene.tsx` | 3 SceneLayer-t fog össze egy section-be, sticky viewporttal |
| `DepthBackground.tsx` | Újrahasználható mély, ködös, gradiens háttér csillag/fény pontokkal |
| `ScrollProgress.tsx` | Globális scroll progress, amit a többi komponens használhat |

### Módosított fájlok
| Fájl | Mit |
|---|---|
| `src/components/HeroSection.tsx` | Becsomagoljuk `CinematicScene`-be: háttér mély gradiens + ködök, midground absztrakt formák, foreground telefon + szöveg zoom-mal |
| `src/components/DrinkSection.tsx` | Sticky parallax, telefon foreground görgetésre 1.0 → 1.15 zoom, szöveg balról beúszik |
| `src/components/LinkSection.tsx` | Ugyanez tükrözve (telefon jobbra), háttér más színárnyalattal |
| `src/components/EarnSection.tsx` | Telefon foreground, görgetésre enyhén dől (rotate-Y), pénzérme/fény részecskék midgroundon |
| `src/components/PhoneMockup.tsx` | Erősebb drop-shadow + ambient light a 3D érzéshez (nem cseréljük ki a meglévő glow-t, kiegészítjük) |
| `src/pages/Index.tsx` | Section-ök közötti smooth scroll segédosztály, esetleg `scroll-snap-y: proximity` a folyamatossághoz |
| `src/index.css` | Új utility osztályok: `.depth-blur-sm/md/lg`, `.cinematic-shadow`, `.ambient-light`, `.scene-gradient-overlay` |

---

## Technikai részletek

### Parallax példa (SceneLayer)
```tsx
const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
const y = useTransform(scrollYProgress, [0, 1], [0, speed * -200]);
const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1 + zoom, 1]);
const blur = useTransform(scrollYProgress, [0, 0.5, 1], [maxBlur, 0, maxBlur]);
const filter = useMotionTemplate`blur(${blur}px)`;
```

### Depth of field
- Foreground: `filter: blur(0)`, éles
- Midground: `filter: blur(2-4px)` görgetés állapotától függően
- Background: `filter: blur(8-16px)` állandóan, görgetésre erősödik

### Lighting / shadows
- A telefon mockup köré `box-shadow` + radial gradient overlay (felső-bal "key light")
- `mix-blend-mode: screen` az electric cyan glow rétegekre
- `cinematic-shadow`: nagy, lágy, lefelé eltolt árnyék a foreground elemek alatt

### Smooth scroll
- CSS: `html { scroll-behavior: smooth }` (már van) + `scroll-snap-type: y proximity` a `<main>`-en
- Sticky scenes: `position: sticky; top: 0; height: 100vh` a CinematicScene wrapperen, belső tartalom translateY-jal animálódik

### Teljesítmény
- `will-change: transform, filter` a mozgó rétegeken
- `transform-gpu` Tailwind osztály mindenhol
- `prefers-reduced-motion` támogatás: ha a user kéri, parallax + zoom kikapcsol, csak fade marad
- Mobilon (md alatt) az effektek visszafogottabbak (kevesebb blur, kisebb zoom range), hogy ne legyen lassú

---

## Elfogadási kritériumok
- Görgetésre minden section három különböző sebességű réteggel mozog
- A háttér láthatóan elmosódottabb, mint a foreground (mélység)
- A telefon mockupok görgetésre enyhén nőnek/dőlnek (3D érzés)
- A section-ök között nincs kemény vágás, a gradiens átmegy
- Mobilon is sima 60fps a görgetés
- `prefers-reduced-motion` esetén az alap layout működik animáció nélkül

---

## Mit NEM csinálunk most (későbbi fázisban opcionális)
- Valódi 3D modellek (Three.js / React Three Fiber) - jelentős komplexitás, külön kör
- WebGL shader effektek
- Egér-követő (mouse parallax) - csak scroll alapú lesz először
- Új tartalom / új section-ök - csak a meglévők kapnak új vizuális réteget

Ha a fenti scope OK, jóváhagyás után implementálom.
