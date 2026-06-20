import logoSrc from "@/assets/come-get-it-logo.png";

export type LogoPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface Options {
  position?: LogoPosition;
  /** Logo width as a fraction of image width. Default 0.22 (22%). */
  scale?: number;
  /** Edge padding in px. Default 48. */
  padding?: number;
  /** 0..1, default 0.95 */
  opacity?: number;
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

/**
 * Composite the Come Get It logo onto an image and return a data URL (PNG).
 */
export async function composeWithLogo(imageUrl: string, opts: Options = {}): Promise<string> {
  const { position = "top-left", scale = 0.22, padding = 48, opacity = 0.95 } = opts;
  const [base, logo] = await Promise.all([loadImg(imageUrl), loadImg(logoSrc)]);

  const canvas = document.createElement("canvas");
  canvas.width = base.naturalWidth;
  canvas.height = base.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(base, 0, 0);

  const targetW = Math.round(base.naturalWidth * scale);
  const ratio = logo.naturalHeight / logo.naturalWidth;
  const targetH = Math.round(targetW * ratio);

  let x = padding, y = padding;
  if (position === "top-right") x = canvas.width - targetW - padding;
  if (position === "bottom-left") y = canvas.height - targetH - padding;
  if (position === "bottom-right") { x = canvas.width - targetW - padding; y = canvas.height - targetH - padding; }

  ctx.globalAlpha = opacity;
  ctx.drawImage(logo, x, y, targetW, targetH);
  ctx.globalAlpha = 1;

  return canvas.toDataURL("image/png");
}

/** Download helper. */
export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
