# Come Get It — Cinematic Premium Ad (9:16, Hungarian)

15-second, 1080x1920 high-energy "Apple-style product reveal meets
nightlife app ad" for prospective hospitality partners in Budapest. More
dynamic than the sibling projects: floating 3D phone with spin-in
entrances, neon streak wipe transitions, animated callout chips, and a
dramatic punch-zoom into the redemption CTA.

- `come-get-it-cinematic-ad.mp4` — final rendered video (H.264, 30fps, 15s).
- `index.html` — the animation (vanilla HTML/CSS/JS, time-driven via
  `window.__setTime(seconds)`).
- `render.js` — Playwright script that steps through the timeline frame by
  frame (30fps) and screenshots each frame to `frames/`.

## What's different from `partner-ad-vertical/`

- **Neon streak transitions**: a skewed cyan/white light bar sweeps across
  the full frame at each scene boundary (`TRANSITIONS` array + `.streak`/
  `.streakGlow` elements), replacing plain crossfades.
- **Phone entrance**: at every scene start the phone spins in from ±46°
  with a spring overshoot (`easeOutBack`) and punches in from 0.8x scale,
  rather than sitting static.
- **Two-phase redemption scene**: steps 1-2-3 highlight first, then a fast
  `easeOutExpo` "punch" zooms from 1.06x to 1.42x centered near the
  countdown ring/BEVÁLTOM button (see `redeemPunchAt` in `index.html`).
- **Callout chips**: one small pill label per scene (`.callout`), anchored
  to natural-pixel coordinates so it pans/zooms with the screenshot.
- **Punchy multi-line captions**: each scene cycles 1-3 short bold lines
  with a scale+fade "pop" (`popCaption`) instead of a single paragraph.
- **Outro phone silhouette**: a faint ghosted phone outline (`.phoneGhost`)
  behind the logo for depth.

## Re-rendering

```
node render.js                 # writes frames/frame_00000.png ... frame_00449.png
ffmpeg -y -framerate 30 -i frames/frame_%05d.png \
  -c:v libx264 -pix_fmt yuv420p -crf 16 -preset slow -movflags +faststart \
  come-get-it-cinematic-ad.mp4
```

Tweak timing via the `T` (timeline) and `TRANSITIONS` constants, or the
caption content in the HTML `<div class="captionBand">` blocks.

## Notes

- Reuses the same 5 screenshots/logo established earlier in this session.
- Uses only the regular `Inter.ttf` (repo-root `InterBold.ttf` is a
  corrupted file, not a real font).
