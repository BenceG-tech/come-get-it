import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const STAGES = [
  { key: "lead", label: "Lead" },
  { key: "qualified", label: "Qualified" },
  { key: "meeting", label: "Meeting" },
  { key: "signed", label: "Signed" },
];

export function PipelineFunnel() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      const results = await Promise.all(
        STAGES.map((s) =>
          supabase.from("partners").select("id", { count: "exact", head: true }).eq("status", s.key),
        ),
      );
      const c: Record<string, number> = {};
      STAGES.forEach((s, i) => (c[s.key] = results[i].count ?? 0));
      setCounts(c);
    })();
  }, []);

  const max = Math.max(1, ...Object.values(counts));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-4 w-4 text-electric-300" /> Partner pipeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {STAGES.map((s) => {
          const v = counts[s.key] ?? 0;
          const pct = Math.round((v / max) * 100);
          return (
            <Link
              key={s.key}
              to={`/admin/partners?status=${s.key}`}
              className="block group"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-nf-text-muted group-hover:text-electric-300">{s.label}</span>
                <span className="font-bold">{v}</span>
              </div>
              <div className="h-2 rounded-full bg-nf-surface-alt overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-electric-300 to-electric-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
