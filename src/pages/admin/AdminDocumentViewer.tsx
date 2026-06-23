import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Copy, ExternalLink, FileText, Sparkles, ClipboardCheck, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ContentConverterDialog from "@/components/admin/documents/ContentConverterDialog";
import DocumentReviewDialog from "@/components/admin/documents/DocumentReviewDialog";
import PdfCanvasPreview from "@/components/admin/documents/PdfCanvasPreview";

const needsCanvasPdf = () => {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (ua.includes("Mac") && "ontouchend" in document);
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  return isIOS || isMobile;
};

export default function AdminDocumentViewer() {
  const { id } = useParams();
  const nav = useNavigate();
  const { toast } = useToast();
  const [doc, setDoc] = useState<any>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [converterOpen, setConverterOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  useEffect(() => {
    (async () => {
      if (!id) return;
      const { data, error: dErr } = await supabase.from("documents").select("*").eq("id", id).maybeSingle();
      if (dErr || !data) { setError(dErr?.message ?? "Doksi nem található"); setLoading(false); return; }
      setDoc(data);
      if (data.storage_path) {
        if (data.storage_path.startsWith("http")) {
          setSignedUrl(data.storage_path);
        } else {
          const { data: s, error: sErr } = await supabase.storage.from("admin-docs").createSignedUrl(data.storage_path, 3600);
          if (sErr || !s) { setError(sErr?.message ?? "Nem sikerült link"); }
          else setSignedUrl(s.signedUrl);
        }
      }
      setLoading(false);
    })();
  }, [id]);

  const copyLink = async () => {
    if (!signedUrl) return;
    await navigator.clipboard.writeText(signedUrl);
    toast({ title: "Link másolva (1 óráig érvényes)" });
  };

  const download = () => {
    if (!signedUrl) return;
    const a = document.createElement("a");
    a.href = signedUrl;
    a.download = doc?.title || "dokumentum";
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const isPdf = doc?.mime_type === "application/pdf" || doc?.storage_path?.toLowerCase().endsWith(".pdf");
  const isImage = doc?.mime_type?.startsWith("image/");

  const textPreview =
    doc?.tldr ||
    doc?.content ||
    doc?.ai_description ||
    doc?.description ||
    null;

  const keyPoints: string[] = Array.isArray(doc?.key_points) ? doc.key_points : [];

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="border-b border-nf-border px-3 md:px-6 py-3 flex items-center gap-2 sticky top-0 bg-nf-bg z-10" style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}>

        <Button variant="outline" size="sm" onClick={() => nav(-1)} className="shrink-0">
          <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Vissza</span>
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="font-bold text-sm md:text-base truncate">{doc?.title ?? "Betöltés…"}</h1>
          {doc?.folder && <p className="text-[10px] md:text-xs text-nf-text-muted truncate">{doc.folder}</p>}
        </div>
        {signedUrl && (
          <>
            <Button variant="outline" size="sm" onClick={copyLink} className="shrink-0">
              <Copy className="h-4 w-4" /> <span className="hidden sm:inline">Link</span>
            </Button>
            <Button variant="neon" size="sm" onClick={download} className="shrink-0">
              <Download className="h-4 w-4" /> <span className="hidden sm:inline">Letöltés</span>
            </Button>
          </>
        )}
        {doc && (
          <Button variant="outline" size="sm" onClick={() => setReviewOpen(true)} className="shrink-0">
            <ClipboardCheck className="h-4 w-4" /> <span className="hidden sm:inline">AI review</span>
          </Button>
        )}
        {doc && (
          <Button variant="outline" size="sm" onClick={() => setConverterOpen(true)} className="shrink-0">
            <Sparkles className="h-4 w-4" /> <span className="hidden sm:inline">AI tartalom</span>
          </Button>
        )}
      </header>
      {doc && <ContentConverterDialog open={converterOpen} onOpenChange={setConverterOpen} docId={doc.id} />}
      {doc && <DocumentReviewDialog open={reviewOpen} onOpenChange={setReviewOpen} docId={doc.id} existingReview={doc.ai_review} />}

      <div className="flex-1 p-3 md:p-6 pb-40 md:pb-12 max-w-5xl mx-auto w-full space-y-4 overflow-y-auto">
        {loading && <div className="text-center text-nf-text-muted py-12">Betöltés…</div>}
        {error && (
          <Card className="p-6 border-red-500/30">
            <h2 className="font-bold mb-2">Hiba</h2>
            <p className="text-sm text-nf-text-muted">{error}</p>
          </Card>
        )}

        {/* Always-visible text preview */}
        {doc && (textPreview || keyPoints.length > 0) && (
          <Card className="p-4 md:p-6 space-y-3">
            <div className="flex items-center gap-2 text-electric-300 text-sm font-semibold">
              <FileText className="h-4 w-4" /> Tartalom előnézet
            </div>
            {textPreview && (
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">{textPreview}</pre>
            )}
            {keyPoints.length > 0 && (
              <ul className="list-disc pl-5 text-sm space-y-1 text-nf-text-muted">
                {keyPoints.slice(0, 8).map((k, i) => <li key={i}>{k}</li>)}
              </ul>
            )}
          </Card>
        )}

        {/* Image preview */}
        {signedUrl && isImage && (
          <Card className="p-3 overflow-hidden">
            <img src={signedUrl} alt={doc?.title} className="w-full h-auto rounded-lg" />
          </Card>
        )}

        {/* PDF preview — iOS/mobil: canvas-render; desktop: <object> */}
        {signedUrl && isPdf && (
          <Card className="p-3 space-y-3">
            <div className="flex items-center gap-2 text-electric-300 text-sm font-semibold px-1">
              <FileText className="h-4 w-4" /> PDF előnézet
            </div>
            {needsCanvasPdf() ? (
              <PdfCanvasPreview url={signedUrl} maxPages={3} />
            ) : (
              <object
                data={`${signedUrl}#toolbar=1&view=FitH`}
                type="application/pdf"
                className="w-full h-[70vh] rounded-lg bg-white border border-nf-border"
              >
                <PdfCanvasPreview url={signedUrl} maxPages={3} />
              </object>
            )}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button variant="outline" size="sm" onClick={() => window.open(signedUrl, "_blank", "noopener,noreferrer")}>
                <ExternalLink className="h-4 w-4 mr-1" /> Megnyitás új lapon
              </Button>
              <Button variant="neon" size="sm" onClick={download}>
                <Download className="h-4 w-4 mr-1" /> Letöltés
              </Button>
            </div>
          </Card>
        )}

        {/* Non-PDF, non-image, with file */}
        {signedUrl && !isPdf && !isImage && (
          <Card className="p-6 text-center space-y-3">
            <FileText className="h-10 w-10 text-electric-300 mx-auto" />
            <p className="text-sm text-nf-text-muted">Ezt a fájltípust nem lehet beágyazva megjeleníteni.</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm" onClick={() => window.open(signedUrl, "_blank", "noopener,noreferrer")}>
                <ExternalLink className="h-4 w-4 mr-1" /> Megnyitás új lapon
              </Button>
              <Button variant="neon" size="sm" onClick={download}>
                <Download className="h-4 w-4 mr-1" /> Letöltés
              </Button>
            </div>
          </Card>
        )}

        {/* No file at all */}
        {doc && !signedUrl && !textPreview && keyPoints.length === 0 && !error && (
          <Card className="p-6 text-center text-nf-text-muted">
            Ehhez a doksihoz nincs csatolt fájl vagy szöveg.
          </Card>
        )}

        {/* Meta footer */}
        {doc && (
          <div className="text-xs text-nf-text-muted flex flex-wrap gap-x-4 gap-y-1 px-1">
            {doc.category && <span>kategória: {doc.category}</span>}
            {doc.mime_type && <span>típus: {doc.mime_type}</span>}
            {doc.file_size_bytes && <span>méret: {Math.round(doc.file_size_bytes / 1024)} KB</span>}
            {doc.is_ai_generated && <span className="text-electric-300">AI generált</span>}
          </div>
        )}
      </div>
    </div>
  );
}
