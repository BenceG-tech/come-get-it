import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Package, Download } from "lucide-react";
import { exportRowsAsCsv } from "@/lib/export-csv";
import { getLeadProfile, type LeadRow } from "@/lib/lead-profile";
import { buildCsomag, readSavedCsomag, type OutreachCsomag } from "@/lib/outreach-csomag";
import { saveCsomag, uploadCsomagMedia } from "@/lib/outreach-csomag-store";
import { loadImage, posterDataFrom, renderPosterBlob } from "@/lib/outreach-media";

type Result = { id: string; name: string; status: "ok" | "skipped" | "error"; note?: string; csomag?: OutreachCsomag };

// Tömeges megkeresési csomag a kijelölt leadekre: szövegek + ajánlat mentése, opcionálisan feed/story kép.
// A videót leadenként, az adatlapon lehet rögzíteni (10 mp valós idejű felvétel / lead).
export default function BulkOutreachPackageModal({
  partners, open, onOpenChange, onDone,
}: {
  partners: LeadRow[];
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onDone?: () => void;
}) {
  const [withImages, setWithImages] = useState(true);
  const [overwrite, setOverwrite] = useState(false);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const { toast } = useToast();

  const existing = partners.filter((p) => readSavedCsomag(p)).length;

  const run = async () => {
    setRunning(true);
    setResults([]);
    const out: Result[] = [];
    for (const p of partners) {
      const name = String(p.company_name ?? "—");
      const saved = readSavedCsomag(p);
      if (saved && !overwrite) {
        out.push({ id: p.id, name, status: "skipped", note: "már van csomag", csomag: saved });
        setResults([...out]);
        continue;
      }
      try {
        let c = buildCsomag(p);
        await saveCsomag(p.id, c);
        if (withImages) {
          const prof = getLeadProfile(p);
          const img = await loadImage(prof.photoUrl);
          const data = posterDataFrom(prof, c, img);
          for (const v of ["feed", "story"] as const) {
            const blob = await renderPosterBlob(v, data);
            const ref = await uploadCsomagMedia(p.id, v, blob, "png", "image/png");
            c = { ...c, media: { ...c.media, [v]: ref } };
          }
          await saveCsomag(p.id, c);
        }
        out.push({ id: p.id, name, status: "ok", csomag: c });
      } catch (e) {
        out.push({ id: p.id, name, status: "error", note: e instanceof Error ? e.message : String(e) });
      }
      setResults([...out]);
    }
    setRunning(false);
    const ok = out.filter((r) => r.status === "ok").length;
    toast({ title: `Megkeresési csomag: ${ok} kész`, description: `${out.filter((r) => r.status === "skipped").length} kihagyva, ${out.filter((r) => r.status === "error").length} hiba` });
    onDone?.();
  };

  const exportCsv = () => {
    const rows = results
      .filter((r) => r.csomag)
      .map((r) => {
        const p = partners.find((x) => x.id === r.id)!;
        const prof = getLeadProfile(p);
        const c = r.csomag!;
        return {
          name: prof.name, email: prof.emails.join(" | "), phone: prof.phones.join(" | "), instagram: prof.instagramHandle ?? "",
          address: prof.address ?? "", grade: c.score?.grade ?? "", score: c.score?.total ?? "",
          offer: c.offer.item, slot: `${c.offer.days}, ${c.offer.slot}`, cap: c.offer.dailyCap,
          subject: c.texts.emailSubject, email_body: c.texts.emailBody, dm: c.texts.dm, followup: c.texts.followup,
          opener: c.texts.opener, post_ig: c.texts.postInstagram, post_tiktok: c.texts.postTiktok,
          feed_url: c.media?.feed?.url ?? "", story_url: c.media?.story?.url ?? "",
        };
      });
    exportRowsAsCsv(rows, [
      { key: "name", label: "Hely" }, { key: "email", label: "E-mail" }, { key: "phone", label: "Telefon" },
      { key: "instagram", label: "Instagram" }, { key: "address", label: "Cím" }, { key: "score", label: "Pont" },
      { key: "grade", label: "Grade" }, { key: "offer", label: "Ajánlat" }, { key: "slot", label: "Időablak" },
      { key: "cap", label: "Napi keret" }, { key: "subject", label: "E-mail tárgy" }, { key: "email_body", label: "E-mail szöveg" },
      { key: "dm", label: "Instagram-DM" }, { key: "followup", label: "Utánkövető" }, { key: "opener", label: "Nyitómondat" },
      { key: "post_ig", label: "Poszt IG/FB" }, { key: "post_tiktok", label: "Poszt TikTok" },
      { key: "feed_url", label: "Feed kép" }, { key: "story_url", label: "Story kép" },
    ], `megkeresesi-csomagok-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const done = results.length;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!running) { onOpenChange(o); if (!o) setResults([]); } }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Package className="w-4 h-4 text-electric-300" /> Megkeresési csomag – {partners.length} lead</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <p className="text-xs text-nf-text-muted">
            Minden kijelölt leadhez elkészíti és elmenti a javasolt ajánlatot, az e-mailt, a DM-et, az utánkövetőt, a nyitómondatot és a posztszövegeket.
            Semmit nem küld el. A videót leadenként, a csomag ablakában lehet rögzíteni.
          </p>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={withImages} onChange={(e) => setWithImages(e.target.checked)} disabled={running} /> Feed (4:5) és Story (9:16) kép is</label>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={overwrite} onChange={(e) => setOverwrite(e.target.checked)} disabled={running} /> Meglévő csomagok felülírása ({existing} leadnél van már)</label>
          {(running || done > 0) && (
            <div className="space-y-2">
              <Progress value={(done / Math.max(1, partners.length)) * 100} />
              <div className="text-xs text-nf-text-muted">{done} / {partners.length}</div>
              <div className="max-h-48 overflow-y-auto space-y-0.5 text-xs">
                {results.map((r) => (
                  <div key={r.id} className="flex justify-between gap-2">
                    <span className="truncate">{r.name}</span>
                    <span className={r.status === "ok" ? "text-emerald-400" : r.status === "skipped" ? "text-nf-text-muted" : "text-red-400"} title={r.note}>
                      {r.status === "ok" ? "kész" : r.status === "skipped" ? "kihagyva" : "hiba"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          {done > 0 && !running && (
            <Button variant="outline" onClick={exportCsv}><Download className="w-4 h-4" /> Szövegek (CSV)</Button>
          )}
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={running}>Bezárás</Button>
          <Button variant="neon" onClick={run} disabled={running || partners.length === 0}>
            {running && <Loader2 className="w-4 h-4 animate-spin" />} Generálás és mentés
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
