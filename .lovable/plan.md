# Teljes oldalas screenshotok minden route-ról

## Mit csinálok

A published URL-ről (`https://come-get-it.app`) minden publikus route-ról készítek **full-page desktop screenshotot** (1920×1080 viewport, teljes görgethető magasság), majd PDF-be is összefűzöm.

## Érintett route-ok

1. `/` — Főoldal
2. `/vendeglatohelyek` — Vendéglátóhelyeknek
3. `/italmarkak` — Italmárkáknak
4. `/rewards-partners` — Rewards partnerek
5. `/partnerek` — Partnerek hub
6. `/come-get-it-accelerator` — Accelerator
7. `/adatvedelmi-szabalyzat` — Adatvédelem
8. `/auth` — Bejelentkezés

## Hogyan

- A `browser--navigate_to_url` + `browser--screenshot full_page: true` kombóval készítem a PNG-ket 1920×1080 viewporton.
- Mentés `/mnt/documents/screenshots/` mappába: `01-home.png`, `02-vendeglatohelyek.png`, stb.
- Pillow-val PDF-be konvertálom mind a 8 oldalt egy fájlba: `/mnt/documents/come-get-it-screenshots.pdf` (egy oldal = egy screenshot, eredeti arány megtartva).

## Eredmény

- 8 db PNG fájl (egyenként a teljes oldal)
- 1 db kombinált PDF az összes oldallal
- Mind a `/mnt/documents/`-ben, `<presentation-artifact>` tag-ekkel becsatolva.

## Megjegyzés

A live published verziót használom (`come-get-it.app`), nem a preview sandboxot — így a végleges, publikus állapot kerül a screenshotokba.