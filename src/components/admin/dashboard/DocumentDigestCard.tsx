import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { FileText, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function DocumentDigestCard() {
  const [stats, setStats] = useState({ newWeek: 0, archive: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const sevenAgo = new Date(Date.now() - 7 * 86400000).toISOString();
      const [{ count: nc }, { count: ac }, { count: tc }] = await Promise.all([
        supabase.from("documents").select("*", { count: "exact", head: true }).gte("created_at", sevenAgo),
        (supabase as any).from("documents").select("*", { count: "exact", head: true }).eq("lifecycle_status", "archived_suggested"),
        supabase.from("documents").select("*", { count: "exact", head: true }),
      ]);
      setStats({ newWeek: nc ?? 0, archive: ac ?? 0, total: tc ?? 0 });
      setLoading(false);
    })();
  }, []);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-electric-300" />
          <h3 className="font-semibold text-sm">Dokumentum digest</h3>
        </div>
        <Link to="/admin/documents" className="text-[11px] text-electric-300 hover:underline">Tovább →</Link>
      </div>
      {loading ? (
        <div className="text-xs text-nf-text-muted">Töltés…</div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          <div>
            <div className="text-2xl font-bold text-electric-300">{stats.newWeek}</div>
            <div className="text-[10px] uppercase text-nf-text-muted">Új (7n)</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400 flex items-center gap-1">
              {stats.archive > 0 && <AlertCircle className="h-4 w-4" />}
              {stats.archive}
            </div>
            <div className="text-[10px] uppercase text-nf-text-muted">Archiválandó</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-[10px] uppercase text-nf-text-muted">Összes</div>
          </div>
        </div>
      )}
    </Card>
  );
}
