import { Button } from "@/components/ui/button";
import { X, Sparkles, Mail, Trash2, Tag } from "lucide-react";

export default function BulkActionBar({
  count, onClear, onScore, onEmail, onStatus, onDelete, loading,
}: {
  count: number;
  onClear: () => void;
  onScore: () => void;
  onEmail: () => void;
  onStatus: (s: string) => void;
  onDelete: () => void;
  loading?: boolean;
}) {
  if (count === 0) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-nf-surface border border-electric-300/40 rounded-full shadow-2xl shadow-electric-300/20 px-3 py-2 flex items-center gap-2 max-w-[95vw] overflow-x-auto">
      <button onClick={onClear} className="text-nf-text-muted hover:text-white p-1"><X className="h-4 w-4" /></button>
      <div className="text-sm font-medium px-2 whitespace-nowrap">{count} kijelölve</div>
      <div className="h-5 w-px bg-nf-border" />
      <Button size="sm" variant="ghost" onClick={onScore} disabled={loading}><Sparkles className="h-4 w-4" /> AI pontoz</Button>
      <Button size="sm" variant="ghost" onClick={onEmail}><Mail className="h-4 w-4" /> Email</Button>
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
      <Button size="sm" variant="ghost" onClick={onDelete} className="text-red-400"><Trash2 className="h-4 w-4" /></Button>
    </div>
  );
}
