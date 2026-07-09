# Come Get It — Partner Acquisition Ad (9:16, Hungarian)

10-second, 1080x1920 B2B video aimed at prospective partner venues (bars,
cafés, restaurants, bistros, clubs) in Budapest. Message: more guests,
better visibility, measurable visits, simple redemption, modern app
experience.

- `come-get-it-partner-ad.mp4` — final rendered video (H.264, 30fps, 10s).
- `index.html` — the animation (vanilla HTML/CSS/JS, time-driven via
  `window.__setTime(seconds)`). Same phone-mockup + Ken Burns approach as
  `marketing/app-ad-vertical/`, resized to leave room for a consistent
  lower-third caption band with Hungarian copy per scene.
- `render.js` — Playwright script that steps through the timeline frame by
  frame (30fps) and screenshots each frame to `frames/`.

## Timeline

| Time | Scene | Caption |
|---|---|---|
| 0.0–1.0s | Logo, glow building | "Több vendég. Kevesebb üres asztal." |
| 1.0–2.5s | Discovery (map pins + venue cards glow) | "Jelenj meg ott, ahol a vendégek döntést hoznak." |
| 2.5–4.0s | Detail (pans photo → description → hours → CTA button) | "Saját partnerprofil. Saját ajánlat. Mérhető érdeklődés." |
| 4.0–6.0s | Redemption (3-step + countdown ring sweep) | "Egyszerű beváltás a pultnál." |
| 6.0–7.5s | Success (Egészségedre! + water impact) | "Minden beváltás vendégélmény és pozitív hatás." |
| 7.5–10.0s | Logo outro | "Csatlakozz alapító partnerként." / "Budapesten indulunk — 2026" |

## Re-rendering

```
node render.js                 # writes frames/frame_00000.png ... frame_00299.png
ffmpeg -y -framerate 30 -i frames/frame_%05d.png \
  -c:v libx264 -pix_fmt yuv420p -crf 16 -preset slow -movflags +faststart \
  come-get-it-partner-ad.mp4
```

Tweak timing/copy via the `T` (timeline) constants and the caption `<div>`
text in `index.html`.

## Notes

- Reuses the same 5 screenshots/logo established earlier in this session
  (see `marketing/app-ad-vertical/`) since no new images were supplied for
  this ad.
- Uses only the regular `Inter.ttf` (repo-root `InterBold.ttf` is a
  corrupted file, not a real font — see notes in the sibling project).
