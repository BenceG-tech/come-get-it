import { Button } from "@/components/ui/button";
import { X, Sparkles, Mail, Trash2, Tag, Download, Send, Telescope, Bot, Loader2, Zap, FastForward } from "lucide-react";

export default function BulkActionBar({
  count, onClear, onScore, onEmail, onStatus, onDelete, onTag, onExportCsv, onOutreach, onResearch, onGrade, onProcessAll,
  loading, researching, grading, processingAll, showScore = true,
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
  onResearch?: () => void;
  onGrade?: () => void;
  onProcessAll?: () => void;
  loading?: boolean;
  researching?: boolean;
  grading?: boolean;
  processingAll?: boolean;
  showScore?: boolean;
}) {
  if (count === 0) return null;
  return (
    <div className="fixed bottom-20 md:bottom-4 left-1/2 -translate-x-1/2 z-40 bg-nf-surface border border-electric-300/40 rounded-full shadow-2xl shadow-electric-300/20 px-3 py-2 flex items-center gap-2 max-w-[95vw] overflow-x-auto">
      <button onClick={onClear} className="text-nf-text-muted hover:text-white p-1"><X className="h-4 w-4" /></button>
      <div className="text-sm font-medium px-2 whitespace-nowrap">{count} kijelölve</div>
      <div className="h-5 w-px bg-nf-border" />
      {onProcessAll && (
        <Button
          size="sm"
          onClick={onProcessAll}
          disabled={processingAll}
          className="bg-electric-300 hover:bg-electric-400 text-black font-semibold rounded-full"
          title="Teljes pipeline: Research + Score + Grade (háttérben, chunkokban)"
        >
          {processingAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />} Mindent
        </Button>
      )}
      {onResearch && (
        <Button size="sm" variant="ghost" onClick={onResearch} disabled={researching} title="AI mélykutatás mindegyikre (web scrape + elemzés)">
          {researching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Telescope className="h-4 w-4" />} Kutat
        </Button>
      )}
      {onGrade && (
        <Button size="sm" variant="ghost" onClick={onGrade} disabled={grading} title="AI A/B/C/D értékelés mindegyikre">
          {grading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />} Grade
        </Button>
      )}
      {showScore && onScore && (
        <Button size="sm" variant="ghost" onClick={onScore} disabled={loading} title="Score újraszámítása">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Score
        </Button>
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

