## Alap nyelv: Magyar

**Probléma:** A `LocaleContext` jelenleg a böngésző nyelvét nézi, ezért nem-magyar böngészőknél angolul indul az oldal.

**Megoldás (1 fájl):** `src/contexts/LocaleContext.tsx` — az init logikában a navigator fallback `'en'` helyett legyen `'hu'`. Ha a user korábban kézzel EN-re váltott (localStorage `cg_locale`), azt továbbra is tiszteljük.

```ts
const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
if (stored === 'hu' || stored === 'en') return stored;
return 'hu'; // alap mindig magyar
```

Ennyi — más fájl nem változik.