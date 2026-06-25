A gond nem maga a screenshot, hanem hogy a mostani telefon keret fix `w-64 h-[520px]`, ami kb. 0.49-es képarány, miközben a hero screenshotok inkább 0.56 körüliek. Ezért vagy levágódik, vagy fekete sávos/összenyomott érzete van.

Terv:
1. Átállítom a `PhoneMockup` komponenst egy screenshot-barát telefon arányra: kb. `9:16` kijelző, nem a mostani túl keskeny/túl magas formára.
2. A hero telefonban a képek `cover + object-top` módban menjenek, hogy szépen kitöltsék a kijelzőt, de a fontos felső UI ne csússzon ki.
3. Meghagyom opcionálisan a `contain` módot azoknak a régi szekcióknak, ahol nagyon eltérő arányú kép van, de a főoldali hero mockup kapjon külön, szép kitöltős beállítást.
4. Mobilon kicsit szélesebb, alacsonyabb mockupot használok, hogy ne tűnjön „lecsúszottnak” és ne foglaljon túl sok vertikális helyet.
5. Finomítom a notch/káva méretét is, hogy inkább modern iPhone-szerű legyen, ne takarja feleslegesen a screenshot tetejét.

Eredmény: a hero telefon mockup nem fekete sávos lesz, nem vágja le durván a széleket, és a feltöltött app screenshot természetesebben tölti ki a képernyőt.