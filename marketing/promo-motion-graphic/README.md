# Come Get It — App Promo Motion Graphic

8-second, 1920x1080 promo animation: 4 app screenshots wiggle in from the
left/right and converge, crossfade into the logo emerging from a blurred
glow, a lightning bolt strikes the logo, then the CTA "Book your next day
with Come Get It" fades in underneath.

- `come-get-it-promo.mp4` — final rendered video (H.264, 30fps, 8s).
- `index.html` — the animation itself (vanilla HTML/CSS/JS, time-driven via
  `window.__setTime(seconds)`), self-contained with local fonts/images in
  `assets/`.
- `render.js` — Playwright script that steps through the timeline frame by
  frame (30fps) and screenshots each frame to `frames/`.

## Re-rendering

```
node render.js                 # writes frames/frame_00000.png ... frame_00239.png
ffmpeg -y -framerate 30 -i frames/frame_%05d.png \
  -c:v libx264 -pix_fmt yuv420p -crf 16 -preset slow -movflags +faststart \
  come-get-it-promo.mp4
```

Tweak timing/positions via the `T` (timeline) and `cards` constants at the
top of the `<script>` block in `index.html`, then re-render.
