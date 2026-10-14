# Feliratkozási gombok és helylista

## Módosítások
- Minden „Mutasd a helyeket” felirat „Iratkozz fel” lesz: a nyitó részben, a DRINK jelenetben és az alsó, görgetés közben megjelenő gombon. Az angol megfelelőjük „Sign up” lesz; a régi nyitógomb fordítását is egységesítjük.
- Az érintett gombok a főoldal meglévő `#signup` feliratkozási űrlapjához görgetnek, nem a helylistához. Csökkentett mozgás esetén animáció nélkül.
- A „Helyek a bétában” szekciót eltávolítjuk a főoldalról. A mögöttes adatokat és szolgáltatásokat nem töröljük.
- Minden más szekció, a v3 videók és görgetős történetek, a partnerjelentkezési gombok, az admin és a feliratkozási folyamat változatlan marad.

## Technikai részletek
- Érintett fordítások HU/EN: `hero.cta`, `experience.join`, `drink.button`, `cta.sticky_join_round`.
- A `HeroSection`, `FeatureScrollStory`, `StickyCallToAction` és a régi `DrinkSection` helylistára mutató gombját `#signup` célra állítjuk.
- Az `Index.tsx` fájlból eltávolítjuk a `PublicVenuesSection` importját és megjelenítését; a komponens forrása megmarad.

## Ellenőrzés
- Asztali és mobilnézetben, magyarul és angolul minden érintett gombot kattintással ellenőrzünk: a feliratkozási űrlapnak láthatóvá kell válnia.
- Ellenőrizzük, hogy a helylista már nem jelenik meg, és nem marad „Mutasd a helyeket” felirat vagy `#helyek` gombcél.
- Ellenőrizzük az automatikus kódellenőrzés eredményét és a böngészőhibákat.
- Csak előnézet készül, publikálás nélkül.
