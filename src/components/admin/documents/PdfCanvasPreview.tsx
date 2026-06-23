import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  url: string;
  maxPages?: number;
  className?: string;
}

/**
 * Renderel PDF oldalakat <canvas>-be a pdfjs-dist segítségével.
 * Azért kell, mert iOS Safari/Chrome nem jelenít meg inline PDF-et
 * <object>/<iframe>-ben.
 */
export default function PdfCanvasPreview({ url, maxPages = 3, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        // Lazy import so the main bundle marad könnyű
        const pdfjs: any = await import("pdfjs-dist");
        const workerSrc = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
        pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

        const loadingTask = pdfjs.getDocument({ url, withCredentials: false });
        const pdf = await loadingTask.promise;
        if (cancelled) return;
        setPageCount(pdf.numPages);

        const container = containerRef.current;
        if (!container) return;
        container.innerHTML = "";

        const pages = Math.min(maxPages, pdf.numPages);
        const containerWidth = container.clientWidth || 600;

        for (let i = 1; i <= pages; i++) {
          const page = await pdf.getPage(i);
          if (cancelled) return;
          const viewport = page.getViewport({ scale: 1 });
          const scale = Math.min(2, containerWidth / viewport.width);
          const scaled = page.getViewport({ scale: scale * (window.devicePixelRatio || 1) });

          const canvas = document.createElement("canvas");
          canvas.width = scaled.width;
          canvas.height = scaled.height;
          canvas.style.width = "100%";
          canvas.style.height = "auto";
          canvas.style.display = "block";
          canvas.style.borderRadius = "0.5rem";
          canvas.style.background = "white";
          canvas.style.marginBottom = "0.75rem";

          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          await page.render({ canvasContext: ctx, viewport: scaled, canvas }).promise;
          if (cancelled) return;
          container.appendChild(canvas);
        }
        setLoading(false);
      } catch (e: any) {
        console.error("PDF render error", e);
        if (!cancelled) {
          setError(e?.message ?? "Nem sikerült renderelni a PDF-et.");
          setLoading(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [url, maxPages]);

  return (
    <div className={className}>
      {loading && (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-nf-text-muted">
          <Loader2 className="h-4 w-4 animate-spin" /> PDF előnézet renderelése…
        </div>
      )}
      {error && (
        <div className="p-4 text-center text-sm text-red-400">
          {error}
        </div>
      )}
      <div ref={containerRef} />
      {!loading && !error && pageCount > maxPages && (
        <div className="text-center text-xs text-nf-text-muted mt-1">
          Csak az első {maxPages} oldal — a teljes dokumentumhoz nyisd meg új lapon vagy töltsd le.
        </div>
      )}
    </div>
  );
}
