import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, X } from "lucide-react";

export default function ImportWizard({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [imported, setImported] = useState<any>(null);
  const { toast } = useToast();

  const upload = async (dryRun: boolean) => {
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("dry_run", dryRun ? "true" : "false");

      const { data: { session } } = await supabase.auth.getSession();
      const url = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/import-leads-bulk`;
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${session?.access_token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import hiba");
      if (dryRun) setPreview(data);
      else { setImported(data); onDone(); }
    } catch (e: any) {
      toast({ title: "Hiba", description: e.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4 border-electric-300/40">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Tömeges lead-import (Excel/CSV)</h2>
          <button onClick={onClose} className="text-nf-text-muted hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        {!imported && (
          <>
            <div className="text-sm text-nf-text-muted space-y-1">
              <p>Támogatott formátumok: <strong>.xlsx, .xls, .csv</strong></p>
              <p>Felismert oszlopnevek (magyar + angol): <em>cégnév/name, város/city, cím, kapcsolattartó, email, telefon, instagram, website, kategória, rating, rating_count, lat, lng, place_id, jegyzet</em></p>
              <p>Az első oszlop kötelezően a hely neve. Duplikátum detektálás: név + város egyezésre.</p>
            </div>

            <label className="block">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => { setFile(e.target.files?.[0] ?? null); setPreview(null); }}
                className="hidden"
                id="lead-file"
              />
              <div className="border-2 border-dashed border-nf-border hover:border-electric-300/40 rounded-lg p-8 text-center cursor-pointer transition-colors"
                onClick={() => document.getElementById("lead-file")?.click()}>
                <FileSpreadsheet className="h-10 w-10 mx-auto mb-2 text-electric-300" />
                {file ? (
                  <div>
                    <div className="font-medium">{file.name}</div>
                    <div className="text-xs text-nf-text-muted">{(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                ) : (
                  <div className="text-sm text-nf-text-muted">Kattints a fájl kiválasztásához</div>
                )}
              </div>
            </label>

            {file && !preview && (
              <Button variant="neon" className="w-full" disabled={loading} onClick={() => upload(true)}>
                {loading ? "Elemzés…" : "Előnézet (még nem importál)"}
              </Button>
            )}

            {preview && (
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-2 text-center">
                  <Card className="p-3"><div className="text-2xl font-bold">{preview.total_rows}</div><div className="text-[10px] text-nf-text-muted uppercase">Sor</div></Card>
                  <Card className="p-3"><div className="text-2xl font-bold text-electric-300">{preview.to_import}</div><div className="text-[10px] text-nf-text-muted uppercase">Új</div></Card>
                  <Card className="p-3"><div className="text-2xl font-bold text-amber-400">{preview.duplicates}</div><div className="text-[10px] text-nf-text-muted uppercase">Duplikátum</div></Card>
                  <Card className="p-3"><div className="text-2xl font-bold text-red-400">{preview.total_rows - preview.mappable}</div><div className="text-[10px] text-nf-text-muted uppercase">Hibás</div></Card>
                </div>

                {preview.sample?.length > 0 && (
                  <div>
                    <div className="text-xs uppercase text-nf-text-muted mb-1">Minta (első 5):</div>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {preview.sample.map((s: any, i: number) => (
                        <div key={i} className="text-xs bg-nf-surface-alt rounded p-2">
                          <strong className="text-electric-300">{s.company_name}</strong>
                          {s.city ? ` · ${s.city}` : ""}
                          {s.email ? ` · ${s.email}` : ""}
                          {s.category ? ` · ${s.category}` : ""}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => { setFile(null); setPreview(null); }}>Mégse</Button>
                  <Button variant="neon" disabled={loading || preview.to_import === 0} onClick={() => upload(false)}>
                    {loading ? "Importálás…" : `Importálás (${preview.to_import})`}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {imported && (
          <div className="space-y-3 text-center py-4">
            <CheckCircle2 className="h-12 w-12 mx-auto text-green-400" />
            <div className="text-xl font-bold">Kész!</div>
            <div className="text-sm text-nf-text-muted">{imported.imported} új lead importálva, {imported.duplicates} duplikátum kihagyva.</div>
            {imported.errors?.length > 0 && (
              <div className="text-xs text-red-400 flex items-center justify-center gap-1"><AlertTriangle className="h-3 w-3" /> {imported.errors.length} batch-hibával</div>
            )}
            <Button variant="neon" onClick={onClose}>Bezárás</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
