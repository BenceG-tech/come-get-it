import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Inbox, ArrowRight, AlertTriangle } from "lucide-react";

export default function InboxZeroCard() {
  const [items, setItems] = useState<any[]>([]);
  const [counts, setCounts] = useState({ open: 0, warn: 0 });

  useEffect(() => {
    (async () => {
      const now = new Date().toISOString();
      const { data } = await supabase
        .from("inbox_items")
        .select("id, kind, severity, title, entity_kind, entity_id, created_at")
        .eq("status", "open")
        .or(`snoozed_until.is.null,snoozed_until.lte.${now}`)
        .order("severity", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(3);
      setItems(data ?? []);
      const { count } = await supabase.from("inbox_items").select("id", { count: "exact", head: true }).eq("status", "open");
      const { count: warn } = await supabase.from("inbox_items").select("id", { count: "exact", head: true }).eq("status", "open").eq("severity", "warning");
      setCounts({ open: count ?? 0, warn: warn ?? 0 });
    })();
  }, []);

  return (
    <Card className="border-electric-300/30">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base flex items-center gap-2"><Inbox className="w-4 h-4 text-electric-300" /> Founder Inbox</CardTitle>
        <Link to="/admin/inbox" className="text-xs text-electric-300 hover:underline flex items-center gap-1">
          Nyitás <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        {counts.open === 0 ? (
          <div className="text-sm text-electric-300 font-medium py-2">🎉 Inbox zero — nincs nyitott item.</div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-3 text-xs">
              <span className="font-bold text-2xl text-electric-300">{counts.open}</span>
              <span className="text-nf-text-muted">nyitott</span>
              {counts.warn > 0 && (
                <span className="ml-auto flex items-center gap-1 text-red-300">
                  <AlertTriangle className="w-3 h-3" /> {counts.warn} sürgős
                </span>
              )}
            </div>
            <div className="space-y-1.5">
              {items.map((it) => (
                <div key={it.id} className="text-xs flex items-start gap-2 truncate">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${it.severity === "warning" ? "bg-red-400" : "bg-electric-300"}`} />
                  <span className="truncate">{it.title}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
