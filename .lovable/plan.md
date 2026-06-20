## A opció — Belépés rendberakása a meglévő Supabase auth-tal

### Mi a valószínű ok
A preview URL-en (`id-preview--...lovable.app`) a Lovable `lovable.js` fetch proxy ismert hibája miatt a Supabase auth POST hívás csendben elhal — ezért nem történik semmi a Bejelentkezés gomb után. A published URL-en (`come-get-it.app/auth`) ez nem fordul elő.

### Lépések

**1. Azonnali teszt (kód nélkül)**
- Nyisd meg: `https://come-get-it.app/auth`
- Próbálj belépni `gataibence@gmail.com` + jelszóval
- Ha bemegy → `https://come-get-it.app/admin` működni fog

**2. Ha nincs még fiók ezzel az emaillel**
- Regisztrálj a `/auth` oldalon (Sign up tab) `gataibence@gmail.com` címmel
- Supabase dashboard → Auth → kapcsold ki az email megerősítést (vagy erősítsd meg manuálisan a usert), hogy ne kelljen email-link
- Migrálni fogok egy SQL-t ami `gataibence@gmail.com` user-id-jához hozzárendeli az `admin` szerepet a `user_roles` táblába (a regisztráció UTÁN fut)

**3. UX javítások a `/auth` oldalon (hogy ne tűnjön „semmi sem történik")**
- A Bejelentkezés gombhoz egyértelmű hibakezelés: ha a Supabase nem ad vissza választ X másodperc alatt (pl. preview proxy hiba), jelenjen meg toast: „A preview környezetben az auth nem működik — nyisd meg a come-get-it.app/auth címet."
- Sikeres login után expliciten `navigate('/admin')` ha az URL `?redirect=/admin` paramétert tartalmaz, és az `AdminRoute` `/auth?redirect=/admin`-ra küldje a usert (most csak `/auth`-ra)
- Console.error a signIn hibákra, hogy lássuk a hálózati problémát

**4. Egy „Admin belépés" gomb a `/auth` oldalon**
- Egy kis link/gomb: „Admin vagy? Nyisd meg az élő oldalon → come-get-it.app/auth" — csak akkor mutatva, ha `window.location.host` tartalmazza `lovable.app`-ot

### Mit NEM csinálok ebben a körben
- Nem írom át az `admin-ai-chat` edge functiont jelszó-alapú gate-re
- Nem lazítom a partner/document táblák RLS-ét
- Az auth flow marad Supabase email/password — később bővíthető Google login-nal

### Eredmény
Az élő URL-en be tudsz lépni, `/admin` betöltődik, az AI asszisztens és CRM működik. A preview-ban marad a proxy korlát, de erre tiszta üzenet jelenik meg.
