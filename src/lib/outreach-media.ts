// Böngészőben (canvas) rajzolt Come Get It márkás anyagok egy leadhez:
// „Így jelennél meg nálunk” feed-poszt (4:5), Story (9:16) és egy 10 mp-es 9:16 videó (MediaRecorder).
// Szerveroldali renderelés nincs — minden a böngészőben készül.
import type { LeadProfile } from "@/lib/lead-profile";
import type { OutreachCsomag } from "@/lib/outreach-csomag";

export const BRAND = {
  bg: "#050708",
  white: "#FFFFFF",
  cyan: "#00D1FF",
  muted: "rgba(255,255,255,0.68)",
  faint: "rgba(255,255,255,0.5)",
  font: "Inter, -apple-system, 'Segoe UI', Roboto, sans-serif",
};

export const DISCLAIMER = "Az aktuális ajánlat és készlet szerint";
export const LAUNCH_LINE = "Indulás: 2026. november 2.";

export type PosterVariant = "feed" | "story";
export const POSTER_SIZE: Record<PosterVariant, { w: number; h: number; label: string }> = {
  feed: { w: 1080, h: 1350, label: "Feed-poszt 4:5" },
  story: { w: 1080, h: 1920, label: "Story 9:16" },
};

export type PosterData = {
  name: string;
  metaLine: string;
  offerLine: string;
  slotLine: string;
  initials: string;
  photo: HTMLImageElement | null;
};

export function posterDataFrom(profile: LeadProfile, csomag: OutreachCsomag, photo: HTMLImageElement | null): PosterData {
  const meta = [
    csomag.offer.kindLabel ? csomag.offer.kindLabel.charAt(0).toUpperCase() + csomag.offer.kindLabel.slice(1) : null,
    profile.districtLabel,
    profile.rating ? `${profile.rating.toFixed(1).replace(".", ",")}★ Google` : null,
  ].filter(Boolean);
  const initials = profile.name
    .split(/\s+/)
    .filter((w) => /[A-Za-zÀ-ž0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
  return {
    name: profile.name,
    metaLine: meta.join(" · "),
    offerLine: csomag.offer.itemShort.charAt(0).toUpperCase() + csomag.offer.itemShort.slice(1),
    slotLine: `${csomag.offer.days}, ${csomag.offer.slot.replace(/\s*\(.*\)$/, "")}`,
    initials: initials || "CG",
    photo,
  };
}

export async function ensureFonts() {
  try {
    await Promise.all([
      document.fonts?.load(`800 80px Inter`),
      document.fonts?.load(`700 40px Inter`),
      document.fonts?.load(`500 30px Inter`),
    ]);
  } catch {
    /* rendszerfont marad */
  }
}

/** Kép betöltése canvasra. CORS nélküli távoli kép „szennyezné” a canvast, ezért ilyenkor null. */
export function loadImage(src: string | null | undefined): Promise<HTMLImageElement | null> {
  if (!src) return Promise.resolve(null);
  return new Promise((resolve) => {
    const img = new Image();
    if (!src.startsWith("data:") && !src.startsWith("blob:")) img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// ---- rajzoló segédek -------------------------------------------------------------

type Ctx = CanvasRenderingContext2D;

function font(ctx: Ctx, weight: number, size: number) {
  ctx.font = `${weight} ${size}px ${BRAND.font}`;
}

function tracking(ctx: Ctx, px: number) {
  const c = ctx as Ctx & { letterSpacing?: string };
  if ("letterSpacing" in c) c.letterSpacing = `${px}px`;
}

function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrap(ctx: Ctx, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width <= maxWidth || !line) line = test;
    else {
      lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** A legnagyobb betűméret (max..min), amivel a szöveg legfeljebb maxLines sorban elfér. */
function fitText(ctx: Ctx, text: string, maxWidth: number, maxLines: number, max: number, min: number, weight = 800) {
  for (let size = max; size >= min; size -= 4) {
    font(ctx, weight, size);
    const lines = wrap(ctx, text, maxWidth);
    if (lines.length <= maxLines && lines.every((l) => ctx.measureText(l).width <= maxWidth)) return { size, lines };
  }
  font(ctx, weight, min);
  const lines = wrap(ctx, text, maxWidth);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = `${kept[maxLines - 1].replace(/\s*\S*$/, "")}…`;
    return { size: min, lines: kept };
  }
  return { size: min, lines };
}

function background(ctx: Ctx, w: number, h: number) {
  ctx.fillStyle = BRAND.bg;
  ctx.fillRect(0, 0, w, h);
  const g = ctx.createRadialGradient(w * 0.85, h * 0.08, 10, w * 0.85, h * 0.08, w * 0.9);
  g.addColorStop(0, "rgba(0,209,255,0.20)");
  g.addColorStop(1, "rgba(0,209,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const g2 = ctx.createRadialGradient(w * 0.1, h * 0.95, 10, w * 0.1, h * 0.95, w * 0.7);
  g2.addColorStop(0, "rgba(0,209,255,0.08)");
  g2.addColorStop(1, "rgba(0,209,255,0)");
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, w, h);
}

function wordmark(ctx: Ctx, x: number, y: number, size: number, align: CanvasTextAlign = "left") {
  font(ctx, 800, size);
  tracking(ctx, size * 0.12);
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillStyle = BRAND.white;
  const label = "COME GET IT";
  ctx.fillText(label, x, y);
  const width = ctx.measureText(label).width;
  const dotX = align === "center" ? x + width / 2 + size * 0.45 : align === "right" ? x + size * 0.45 : x + width + size * 0.45;
  ctx.fillStyle = BRAND.cyan;
  ctx.beginPath();
  ctx.arc(dotX, y, size * 0.2, 0, Math.PI * 2);
  ctx.fill();
  tracking(ctx, 0);
}

function photoBlock(ctx: Ctx, d: PosterData, x: number, y: number, w: number, h: number, zoom = 1) {
  ctx.save();
  roundRect(ctx, x, y, w, h, 36);
  ctx.clip();
  if (d.photo) {
    const iw = d.photo.naturalWidth || d.photo.width;
    const ih = d.photo.naturalHeight || d.photo.height;
    const scale = Math.max(w / iw, h / ih) * zoom;
    const dw = iw * scale;
    const dh = ih * scale;
    ctx.drawImage(d.photo, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
    const shade = ctx.createLinearGradient(0, y + h * 0.55, 0, y + h);
    shade.addColorStop(0, "rgba(5,7,8,0)");
    shade.addColorStop(1, "rgba(5,7,8,0.65)");
    ctx.fillStyle = shade;
    ctx.fillRect(x, y, w, h);
  } else {
    const g = ctx.createLinearGradient(x, y, x + w, y + h);
    g.addColorStop(0, "#0C1A1F");
    g.addColorStop(1, "#06090A");
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "rgba(0,209,255,0.08)";
    ctx.lineWidth = 2;
    for (let i = -h; i < w; i += 48) {
      ctx.beginPath();
      ctx.moveTo(x + i, y + h);
      ctx.lineTo(x + i + h, y);
      ctx.stroke();
    }
    font(ctx, 800, Math.min(w, h) * 0.38 * zoom);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(0,209,255,0.85)";
    ctx.fillText(d.initials, x + w / 2, y + h / 2);
  }
  ctx.restore();
  ctx.save();
  roundRect(ctx, x, y, w, h, 36);
  ctx.strokeStyle = "rgba(0,209,255,0.35)";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}

function pill(ctx: Ctx, text: string, rightX: number, cy: number, size: number) {
  font(ctx, 600, size);
  const w = ctx.measureText(text).width + size * 1.6;
  const h = size * 2;
  roundRect(ctx, rightX - w, cy - h / 2, w, h, h / 2);
  ctx.strokeStyle = BRAND.cyan;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.fillStyle = BRAND.cyan;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, rightX - w / 2, cy + 1);
}

function offerCard(ctx: Ctx, d: PosterData, x: number, y: number, w: number, scale = 1) {
  const pad = 36 * scale;
  const h = 210 * scale;
  roundRect(ctx, x, y, w, h, 28 * scale);
  ctx.fillStyle = "rgba(0,209,255,0.08)";
  ctx.fill();
  ctx.strokeStyle = "rgba(0,209,255,0.6)";
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  font(ctx, 700, 26 * scale);
  tracking(ctx, 3 * scale);
  ctx.fillStyle = BRAND.cyan;
  ctx.fillText("NAPI EGY INGYEN ITAL", x + pad, y + pad + 22 * scale);
  tracking(ctx, 0);
  const f = fitText(ctx, d.offerLine, w - pad * 2, 1, 50 * scale, 30 * scale, 700);
  ctx.fillStyle = BRAND.white;
  ctx.fillText(f.lines[0], x + pad, y + pad + 22 * scale + 64 * scale);
  font(ctx, 500, 30 * scale);
  ctx.fillStyle = BRAND.muted;
  ctx.fillText(d.slotLine, x + pad, y + pad + 22 * scale + 112 * scale);
  return h;
}

// ---- posztok -------------------------------------------------------------------

export function drawPoster(canvas: HTMLCanvasElement, variant: PosterVariant, d: PosterData) {
  const { w, h } = POSTER_SIZE[variant];
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  background(ctx, w, h);
  const m = 72;
  const story = variant === "story";
  const top = story ? 150 : 90;
  wordmark(ctx, m, top, 34);
  pill(ctx, "Így jelennél meg nálunk", w - m, top, 26);

  const photoY = top + 70;
  const photoH = story ? 820 : 470;
  photoBlock(ctx, d, m, photoY, w - m * 2, photoH);

  let y = photoY + photoH + (story ? 100 : 78);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  font(ctx, 700, 28);
  tracking(ctx, 4);
  ctx.fillStyle = BRAND.cyan;
  ctx.fillText("ÚJ PARTNERHELY", m, y);
  tracking(ctx, 0);

  const nameFit = fitText(ctx, d.name, w - m * 2, 2, story ? 104 : 88, 48);
  ctx.fillStyle = BRAND.white;
  y += 18;
  for (const line of nameFit.lines) {
    y += nameFit.size * 1.08;
    ctx.fillText(line, m, y);
  }
  if (d.metaLine) {
    font(ctx, 500, 32);
    ctx.fillStyle = BRAND.muted;
    y += 58;
    ctx.fillText(d.metaLine, m, y);
  }
  y += story ? 70 : 44;
  offerCard(ctx, d, m, y, w - m * 2);

  font(ctx, 500, 26);
  ctx.fillStyle = BRAND.faint;
  ctx.textAlign = "left";
  ctx.fillText(DISCLAIMER, m, h - (story ? 150 : 64));
  ctx.textAlign = "right";
  ctx.fillText(story ? LAUNCH_LINE : "come-get-it.app", w - m, h - (story ? 150 : 64));
  ctx.textAlign = "left";
}

/** Poszt PNG-be renderelése egy DOM-on kívüli canvasra. */
export async function renderPosterBlob(variant: PosterVariant, d: PosterData): Promise<Blob> {
  await ensureFonts();
  const canvas = document.createElement("canvas");
  drawPoster(canvas, variant, d);
  return canvasToBlob(canvas, "image/png");
}

export function canvasToBlob(canvas: HTMLCanvasElement, type = "image/png", quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("A canvas nem exportálható (CORS-os kép?)"))), type, quality);
    } catch (e) {
      reject(e);
    }
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "lead"
  );
}

// ---- videó -------------------------------------------------------------------

export const VIDEO_DURATION_MS = 10000;
export const VIDEO_SIZE = { w: 720, h: 1280 };

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const easeOut = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);

/** Egy képkocka a 10 mp-es „Új partnerhely: <név>” animációból (t ms-ban). */
export function drawVideoFrame(ctx: Ctx, w: number, h: number, t: number, d: PosterData) {
  const s = w / 1080; // 1080-as rácsra tervezve
  background(ctx, w, h);
  const m = 72 * s;

  // 0–1.6 mp: logó középen, majd felúszik
  const intro = easeOut(t / 900);
  const lift = easeOut((t - 1200) / 700);
  const logoY = h / 2 - (h / 2 - 150 * s) * lift;
  ctx.globalAlpha = intro;
  wordmark(ctx, w / 2, logoY, (64 - 30 * lift) * s, "center");
  ctx.fillStyle = BRAND.cyan;
  const lineW = 320 * s * easeOut((t - 300) / 900) * (1 - lift);
  ctx.fillRect(w / 2 - lineW / 2, logoY + 60 * s, lineW, 4 * s);
  ctx.globalAlpha = 1;

  // 1.8 mp: „Új partnerhely:”
  const a1 = easeOut((t - 1800) / 600);
  ctx.globalAlpha = a1;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  font(ctx, 700, 40 * s);
  tracking(ctx, 6 * s);
  ctx.fillStyle = BRAND.cyan;
  ctx.fillText("ÚJ PARTNERHELY", w / 2, 300 * s + (1 - a1) * 40 * s);
  tracking(ctx, 0);

  // 2.3 mp: név
  const a2 = easeOut((t - 2300) / 700);
  ctx.globalAlpha = a2;
  const nameFit = fitText(ctx, d.name, w - m * 2, 2, 120 * s, 56 * s);
  ctx.fillStyle = BRAND.white;
  ctx.textAlign = "center";
  let y = 330 * s + (1 - a2) * 50 * s;
  for (const line of nameFit.lines) {
    y += nameFit.size * 1.08;
    ctx.fillText(line, w / 2, y);
  }
  if (d.metaLine) {
    font(ctx, 500, 34 * s);
    ctx.fillStyle = BRAND.muted;
    ctx.fillText(d.metaLine, w / 2, y + 64 * s);
  }
  ctx.globalAlpha = 1;

  // 3.8 mp: fotó / monogram lassú zoommal
  const a3 = easeOut((t - 3800) / 800);
  if (a3 > 0) {
    ctx.globalAlpha = a3;
    const ph = 640 * s;
    const py = 760 * s + (1 - a3) * 60 * s;
    photoBlock(ctx, d, m, py, w - m * 2, ph, 1 + 0.08 * clamp01((t - 3800) / 6000));
    ctx.globalAlpha = 1;
  }

  // 6.2 mp: ajánlatkártya
  const a4 = easeOut((t - 6200) / 700);
  if (a4 > 0) {
    ctx.globalAlpha = a4;
    offerCard(ctx, d, m, 1470 * s + (1 - a4) * 60 * s, w - m * 2, s);
    ctx.globalAlpha = 1;
  }

  // 7.6 mp: indulás + apró sor
  const a5 = easeOut((t - 7600) / 700);
  if (a5 > 0) {
    ctx.globalAlpha = a5;
    ctx.textAlign = "center";
    font(ctx, 700, 40 * s);
    ctx.fillStyle = BRAND.white;
    ctx.fillText(LAUNCH_LINE, w / 2, 1770 * s);
    font(ctx, 500, 28 * s);
    ctx.fillStyle = BRAND.faint;
    ctx.fillText(DISCLAIMER, w / 2, 1830 * s);
    ctx.globalAlpha = 1;
  }
  ctx.textAlign = "left";
}

export function pickVideoMime(): { mime: string; ext: "mp4" | "webm" } | null {
  if (typeof MediaRecorder === "undefined") return null;
  const candidates: { mime: string; ext: "mp4" | "webm" }[] = [
    { mime: "video/mp4;codecs=avc1.42E01E", ext: "mp4" },
    { mime: "video/mp4;codecs=avc1", ext: "mp4" },
    { mime: "video/mp4", ext: "mp4" },
    { mime: "video/webm;codecs=vp9", ext: "webm" },
    { mime: "video/webm;codecs=vp8", ext: "webm" },
    { mime: "video/webm", ext: "webm" },
  ];
  return candidates.find((c) => MediaRecorder.isTypeSupported(c.mime)) ?? null;
}

/** Lejátssza az animációt a megadott canvasra (felvétel nélkül). Visszaad egy stop függvényt. */
export function playVideoPreview(canvas: HTMLCanvasElement, d: PosterData, loop = true): () => void {
  canvas.width = VIDEO_SIZE.w;
  canvas.height = VIDEO_SIZE.h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => undefined;
  let raf = 0;
  const start = performance.now();
  const tick = (now: number) => {
    let t = now - start;
    if (loop) t %= VIDEO_DURATION_MS + 1500;
    drawVideoFrame(ctx, canvas.width, canvas.height, Math.min(t, VIDEO_DURATION_MS), d);
    if (loop || t < VIDEO_DURATION_MS) raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

/** Felveszi a 10 mp-es animációt a canvasról MediaRecorderrel (MP4, ha a böngésző tudja, különben WebM). */
export async function recordVideo(
  canvas: HTMLCanvasElement,
  d: PosterData,
  onProgress?: (p: number) => void,
): Promise<{ blob: Blob; mime: string; ext: "mp4" | "webm" }> {
  const picked = pickVideoMime();
  if (!picked) throw new Error("Ez a böngésző nem tud videót rögzíteni (MediaRecorder hiányzik).");
  if (typeof canvas.captureStream !== "function") throw new Error("Ez a böngésző nem támogatja a canvas.captureStream-et.");
  canvas.width = VIDEO_SIZE.w;
  canvas.height = VIDEO_SIZE.h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas nem elérhető");
  drawVideoFrame(ctx, canvas.width, canvas.height, 0, d);
  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType: picked.mime, videoBitsPerSecond: 4_000_000 });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };
  const done = new Promise<void>((resolve, reject) => {
    recorder.onstop = () => resolve();
    recorder.onerror = (e) => reject((e as unknown as { error?: Error }).error ?? new Error("Felvételi hiba"));
  });
  recorder.start(250);
  const start = performance.now();
  await new Promise<void>((resolve) => {
    const tick = (now: number) => {
      const t = now - start;
      drawVideoFrame(ctx, canvas.width, canvas.height, Math.min(t, VIDEO_DURATION_MS), d);
      onProgress?.(clamp01(t / VIDEO_DURATION_MS));
      if (t < VIDEO_DURATION_MS + 300) requestAnimationFrame(tick);
      else resolve();
    };
    requestAnimationFrame(tick);
  });
  recorder.stop();
  await done;
  stream.getTracks().forEach((tr) => tr.stop());
  const mime = picked.mime.split(";")[0];
  return { blob: new Blob(chunks, { type: mime }), mime, ext: picked.ext };
}
