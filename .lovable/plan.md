## Cél
A jelenlegi „Nincs jogosultság” képernyő ne zsákutca legyen: innen is tudj kijelentkezni, újra belépni, admin linkre menni, és lássuk pontosabban, miért bukik el az admin jogosultság.

## Mit javítok
1. **Admin jogosultság képernyő bővítése**
   - Hozzáadok gombokat:
     - „Újra belépek” → kijelentkeztet és visszavisz `/auth?redirect=/admin` oldalra
     - „Admin újraellenőrzés” → frissíti az oldalt/jogosultság ellenőrzést
     - „Főoldal” → vissza a publikus oldalra
   - Kiírom az aktuálisan belépett email címet, hogy egyértelmű legyen, milyen fiókkal vagy bent.

2. **Admin check hibakezelés javítása**
   - A `useIsAdmin` hook tárolja és visszaadja a Supabase RPC hibát is, nem csak annyit, hogy `false`.
   - Ha a `has_role` hívás hibázik, a képernyőn rövid technikai üzenet jelenik meg, hogy ne vakon találgassunk.

3. **Auth újrapróba egyszerűsítése**
   - A „Nincs jogosultság” oldalról egy kattintással törlődik a session és újra megnyílik a login.
   - Így nem ragadsz be olyan állapotban, ahol rossz userrel vagy félbesikerült sessionnel vagy belépve.

## Amit nem változtatok most
- Nem lazítom az RLS-t.
- Nem kerül be jelszó-alapú admin bypass.
- Nem migrálok Lovable Cloudra.
- Az admin továbbra is Supabase email/password + `user_roles` alapján működik.

## Várható eredmény
Ha rossz accounttal vagy belépve, azonnal tudsz újrapróbálkozni. Ha jó accounttal vagy bent, de a role check hibázik, látni fogjuk a konkrét hibát, és célzottan lehet javítani.