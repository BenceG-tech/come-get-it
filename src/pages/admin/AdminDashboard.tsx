import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, Calendar, Sparkles, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ partners: 0, leads: 0, signed: 0, docs: 0, followupsDue: 0 });
  const [followups, setFollowups] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const today = new Date().toISOString();
      const [p, l, s, d, f] = await Promise.all([
        supabase.from("partners").select("id", { count: "exact", head: true }),
        supabase.from("partners").select("id", { count: "exact", head: true }).eq("status", "lead"),
        supabase.from("partners").select("id", { count: "exact", head: true }).eq("status", "signed"),
        supabase.from("documents").select("id", { count: "exact", head: true }),
        supabase.from("partners").select("id, company_name, status, next_followup_at").lte("next_followup_at", today).not("next_followup_at", "is", null).order("next_followup_at").limit(10),
      ]);
      setStats({
        partners: p.count ?? 0,
        leads: l.count ?? 0,
        signed: s.count ?? 0,
        docs: d.count ?? 0,
        followupsDue: f.data?.length ?? 0,
      });
      setFollowups(f.data ?? []);
    })();
  }, []);

  const cards = [
    { label: "Összes partner", value: stats.partners, icon: Users, to: "/admin/partners" },
    { label: "Új leadek", value: stats.leads, icon: Users, to: "/admin/partners" },
    { label: "Aláírt", value: stats.signed, icon: Users, to: "/admin/partners" },
    { label: "Dokumentumok", value: stats.docs, icon: FileText, to: "/admin/documents" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Áttekintés</h1>
        <p className="text-sm text-nf-text-muted">Üdv a parancsnoki hídon — itt látod, hol állsz.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to}>
            <Card className="hover:border-electric-300/50 transition-colors h-full">
              <CardContent className="p-4 md:p-5">
                <c.icon className="h-5 w-5 text-electric-300 mb-2 md:mb-3" />
                <div className="text-2xl md:text-3xl font-bold">{c.value}</div>
                <div className="text-[10px] md:text-xs text-nf-text-muted uppercase tracking-wider leading-tight mt-1">{c.label}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>


      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-electric-300" /> Mai/elmaradt follow-up
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {followups.length === 0 && <div className="text-nf-text-muted text-sm">Nincs esedékes follow-up.</div>}
            {followups.map((f) => (
              <Link key={f.id} to={`/admin/partners/${f.id}`} className="flex items-center justify-between p-3 rounded-lg bg-nf-surface-alt hover:bg-nf-surface-alt/70">
                <div>
                  <div className="font-medium">{f.company_name}</div>
                  <div className="text-xs text-nf-text-muted">{f.status} · {new Date(f.next_followup_at).toLocaleDateString("hu-HU")}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-electric-300" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border-electric-300/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-electric-300" /> AI asszisztens
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-nf-text-muted">Kérdezd meg: „Kit keressek meg ma?", „Írj IG DM-et a [partner név]-nek", „Adj 4 hetes marketing tervet a vendéglátóhely-toborzáshoz".</p>
            <Link to="/admin/ai">
              <Button variant="neon" size="sm">Beszélgetés indítása</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
