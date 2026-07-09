# Come Get It — Vertical App Ad (9:16)

8-second, 1080x1920 premium app ad for Reels/TikTok/mobile: logo reveal →
venue discovery → venue detail (free-drink CTA) → redemption flow
(countdown ring) → success/impact screen → logo outro with CTA.

- `come-get-it-app-ad-vertical.mp4` — final rendered video (H.264, 30fps, 8s).
- `index.html` — the animation (vanilla HTML/CSS/JS, time-driven via
  `window.__setTime(seconds)`). A single phone mockup holds all 4 app
  screenshots; per-scene "Ken Burns" push-in/pan and precisely-anchored
  cyan glow overlays highlight the relevant UI (map pins, venue cards, the
  "Kérd ingyen italod" button, the 3-step process, the countdown ring, the
  BEVÁLTOM button, "Egészségedre!", the water-impact box) without altering
  or covering the real screenshots.
- `render.js` — Playwright script that steps through the timeline frame by
  frame (30fps) and screenshots each frame to `frames/`.

## Re-rendering

```
node render.js                 # writes frames/frame_00000.png ... frame_00239.png
ffmpeg -y -framerate 30 -i frames/frame_%05d.png \
  -c:v libx264 -pix_fmt yuv420p -crf 16 -preset slow -movflags +faststart \
  come-get-it-app-ad-vertical.mp4
```

Tweak timing/focus points via the `T` (timeline) and `COORDS` (pixel
coordinates in the 1206x2622 source screenshots) constants in `index.html`.

## Notes

- The logo asset (`assets/logo_alpha.png`) is reused from the earlier
  horizontal promo (`marketing/promo-motion-graphic/`) since none of the
  5 screenshots supplied for this ad was a standalone logo image.
- `InterBold.ttf` at the repo root is not a valid font file (it's an HTML
  page saved with a `.ttf` extension), so this project uses only the
  regular `Inter.ttf` and lets the browser synthesize bold for CTA text.
  The same corrupted file likely affects `marketing/promo-motion-graphic/`
  too.
