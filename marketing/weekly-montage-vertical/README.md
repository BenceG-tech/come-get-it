# Come Get It — Weekly UI Montage (9:16, Hungarian)

19-second, 1080x1920 fast-paced promo built around the "a reward almost
every day" concept: Hétfő → Kedd → Szerda → Csütörtök → Péntek, each
beat reframing the same real app screenshots with different Ken Burns
motion, day-title cards, and captions, followed by a rapid recap montage
and a logo/CTA outro.

## Why this is UI-only

The original brief asked for real people walking into venues, bartenders
pouring drinks, groups toasting, etc. This environment has no video
generation model, no stock-footage library, and no actors — only the same
4 app screenshots + logo used in the sibling `marketing/*` projects. Rather
than fake that footage or silently fall short of the brief, this project
honestly reinterprets the concept with only what's actually buildable:
a fast, stylish UI montage using the real screenshots, day labels, and
motion/transition techniques (streak wipes, spin-in phone entrances,
punch-zooms) carried over from `cinematic-ad-vertical/`.

To get the originally-requested people/venue version, either:
- supply real video clips (shot or licensed) for editing, or
- generate clips with an AI video tool (Runway/Pika/Sora/Veo) from
  detailed per-scene prompts, then send them back for editing.

## Timeline

| Time | Beat | Screen | Caption |
|---|---|---|---|
| 0.0–2.0s | Intro | logo | "COME GET IT" / "Minden napra egy hely." / "Minden napra egy ital." |
| 2.0–4.0s | Hétfő | discovery | "Munka után?" / "Jár egy ital." |
| 4.0–6.0s | Kedd | detail | "Új hely." / "Új élmény." |
| 6.0–8.0s | Szerda | redeem (steps) | "Gyors beváltás." / "Egyszerű használat." |
| 8.0–10.5s | Csütörtök | redeem (punch-zoom on ring/CTA) | "Fedezd fel." / "Szerezz pontokat." |
| 10.5–13.5s | Péntek | success | "Péntek esti terv?" / "Megvan." |
| 13.5–16.5s | Recap | fast flash-cut through all 4 | "Hétfő. Kedd. Szerda. Csütörtök. Péntek." / "Come Get It." |
| 16.5–19.0s | Outro | logo + phone ghost | "Partnerhelyek Budapesten. Napi ingyen ital." / "Come Get It · Csatlakozz" |

- `come-get-it-weekly-montage.mp4` — final rendered video (H.264, 30fps, 19s).
- `index.html` — the animation (vanilla HTML/CSS/JS, time-driven via
  `window.__setTime(seconds)`).
- `render.js` — Playwright script that renders 570 frames at 30fps.

## Re-rendering

```
node render.js
ffmpeg -y -framerate 30 -i frames/frame_%05d.png \
  -c:v libx264 -pix_fmt yuv420p -crf 16 -preset slow -movflags +faststart \
  come-get-it-weekly-montage.mp4
```

## Notes

- Szerda and Csütörtök reuse the same `redeem.png` screenshot with a
  shared continuous opacity (`redeemOp`) across both windows, so the two
  day-scenes read as one smooth continuation rather than a fade-to-black
  and back — only the Ken Burns framing (steps view vs. punch-zoom on the
  countdown ring/BEVÁLTOM button) changes at the 8.0s boundary.
- Uses only the regular `Inter.ttf` (repo-root `InterBold.ttf` is a
  corrupted file, not a real font).
