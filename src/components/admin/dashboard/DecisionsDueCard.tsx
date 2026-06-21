import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Brain, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function DecisionsDueCard() {
  const [due, setDue] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    (async () => {
      const [d, t] = await Promise.all([
        supabase.from("decisions").select("id", { count: "exact", head: true }).is("outcome", null).lte("review_at", new Date().toISOString()),
        supabase.from("decisions").select("id", { count: "exact", head: true }),
      ]);
      setDue(d.count ?? 0);
      setTotal(t.count ?? 0);
    })();
  }, []);

  return (
    <Link to="/admin/decisions">
      <Card className="p-4 bg-nf-surface border-nf-border hover:border-electric-300/50 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-nf-text-muted uppercase tracking-wider">
              <Brain className="h-3 w-3" /> Döntésnapló
            </div>
            <div className="text-2xl font-bold mt-1 text-white">{due}</div>
            <div className="text-[10px] text-nf-text-muted">értékelésre vár · összesen {total}</div>
          </div>
          <ArrowRight className="h-4 w-4 text-electric-300" />
        </div>
      </Card>
    </Link>
  );
}
