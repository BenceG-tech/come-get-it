import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Copy, ExternalLink, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDocumentViewer() {
  const { id } = useParams();
  const nav = useNavigate();
  const { toast } = useToast();
  const [doc, setDoc] = useState<any>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          if (sErr || !s) setError(sErr?.message ?? "Nem sikerült link"); else setSignedUrl(s.signedUrl);
        }
      }
      setLoading(false);
    })();
  }, [id]);

  const copyLink = async () => {
    if (!signedUrl) return;
    await navigator.clipboard.writeText(signedUrl);
    toast({ title: "Link másolva" });
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

  const isPdf = doc?.mime_type === "application/pdf" || doc?.storage_path?.endsWith(".pdf");
  const isImage = doc?.mime_type?.startsWith("image/");
  const isText = doc?.mime_type?.startsWith("text/") || doc?.storage_path?.endsWith(".md");

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-screen">
      <header className="border-b border-nf-border px-3 md:px-6 py-3 flex items-center gap-2">
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
      </header>

      <div className="flex-1 overflow-auto p-3 md:p-6">
        {loading && <div className="text-center text-nf-text-muted py-12">Betöltés…</div>}
        {error && (
          <Card className="p-6 max-w-xl mx-auto border-red-500/30">
            <h2 className="font-bold mb-2">Hiba</h2>
            <p className="text-sm text-nf-text-muted">{error}</p>
          </Card>
        )}
        {doc && !signedUrl && doc.content && (
          <Card className="p-4 md:p-6 max-w-3xl mx-auto">
            <pre className="whitespace-pre-wrap text-sm">{doc.content}</pre>
          </Card>
        )}
        {doc && !signedUrl && !doc.content && !error && (
          <div className="text-center text-nf-text-muted py-12">Ehhez a doksihoz nincs csatolt fájl vagy szöveg.</div>
        )}
        {signedUrl && isImage && (
          <div className="max-w-4xl mx-auto">
            <img src={signedUrl} alt={doc?.title} className="w-full h-auto rounded-lg border border-nf-border" />
          </div>
        )}
        {signedUrl && isPdf && (
          <div className="max-w-5xl mx-auto h-full space-y-3">
            <iframe
              src={signedUrl}
              title={doc?.title || "PDF"}
              className="w-full h-[75vh] rounded-lg border border-nf-border bg-white"
            />
            <div className="flex flex-wrap gap-2 justify-center">
              <Button variant="outline" size="sm" onClick={() => window.open(signedUrl, "_blank")}>
                <ExternalLink className="h-4 w-4" /> Megnyitás új lapon
              </Button>
              <Button variant="neon" size="sm" onClick={download}>
                <Download className="h-4 w-4" /> Letöltés
              </Button>
            </div>
            <p className="text-xs text-nf-text-muted text-center">Ha a PDF nem jelenik meg (főleg mobilon), nyisd meg új lapon vagy töltsd le.</p>
          </div>
        )}
        {signedUrl && !isPdf && !isImage && (
          <Card className="p-6 max-w-xl mx-auto text-center space-y-3">
            <FileText className="h-10 w-10 text-electric-300 mx-auto" />
            <p className="text-sm text-nf-text-muted">Ezt a fájltípust nem lehet beágyazva megjeleníteni.</p>
            <Button variant="neon" onClick={download}>
              <Download className="h-4 w-4" /> Letöltés
            </Button>
          </Card>
        )}
        {doc?.content && signedUrl && (
          <details className="mt-6 max-w-3xl mx-auto">
            <summary className="cursor-pointer text-electric-300 text-sm">Szöveges tartalom</summary>
            <pre className="whitespace-pre-wrap mt-2 text-xs bg-nf-surface p-3 rounded">{doc.content}</pre>
          </details>
        )}
      </div>
    </div>
  );
}
