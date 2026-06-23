import { Button } from "@/components/ui/button";
import { X, Sparkles, Mail, Trash2, Tag, Download, Send } from "lucide-react";

export default function BulkActionBar({
  count, onClear, onScore, onEmail, onStatus, onDelete, onTag, onExportCsv, onOutreach, loading, showScore = true,
}: {
  count: number;
  onClear: () => void;
  onScore?: () => void;
  onEmail?: () => void;
  onStatus: (s: string) => void;
  onDelete: () => void;
  onTag?: () => void;
  onExportCsv?: () => void;
  onOutreach?: () => void;
  loading?: boolean;
  showScore?: boolean;
}) {
  if (count === 0) return null;
  return (
    <div className="fixed bottom-20 md:bottom-4 left-1/2 -translate-x-1/2 z-40 bg-nf-surface border border-electric-300/40 rounded-full shadow-2xl shadow-electric-300/20 px-3 py-2 flex items-center gap-2 max-w-[95vw] overflow-x-auto">
      <button onClick={onClear} className="text-nf-text-muted hover:text-white p-1"><X className="h-4 w-4" /></button>
      <div className="text-sm font-medium px-2 whitespace-nowrap">{count} kijelölve</div>
      <div className="h-5 w-px bg-nf-border" />
      {showScore && onScore && (
        <Button size="sm" variant="ghost" onClick={onScore} disabled={loading}><Sparkles className="h-4 w-4" /> AI pontoz</Button>
      )}
      {onOutreach && (
        <Button size="sm" variant="ghost" onClick={onOutreach}><Send className="h-4 w-4" /> Outreach</Button>
      )}
      {onEmail && (
        <Button size="sm" variant="ghost" onClick={onEmail}><Mail className="h-4 w-4" /> Email</Button>
      )}
      {onTag && (
        <Button size="sm" variant="ghost" onClick={onTag}><Tag className="h-4 w-4" /> Címke</Button>
      )}
      <select onChange={(e) => { if (e.target.value) onStatus(e.target.value); e.target.value = ""; }}
        className="bg-nf-surface-alt border border-nf-border rounded-full text-xs h-8 px-3">
        <option value="">Státusz…</option>
        <option value="lead">Új lead</option>
        <option value="contacted">Megkeresve</option>
        <option value="negotiating">Tárgyalás</option>
        <option value="proposal_sent">Ajánlat küldve</option>
        <option value="signed">Aláírt</option>
        <option value="rejected">Elutasítva</option>
        <option value="paused">Szünetel</option>
      </select>
      {onExportCsv && (
        <Button size="sm" variant="ghost" onClick={onExportCsv}><Download className="h-4 w-4" /> CSV</Button>
      )}
      <Button size="sm" variant="ghost" onClick={onDelete} className="text-red-400"><Trash2 className="h-4 w-4" /></Button>
    </div>
  );
}
