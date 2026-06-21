import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Target, Users, Beer, ArrowRight } from "lucide-react";
import HelpTip from "@/components/admin/help/HelpTip";

/**
 * Szeptemberi misszió 3 számlálóval:
 * 1. Partner LOI (előmegállapodás) — cél: 20 szept. 1-ig
 * 2. Előregisztráció (waitlist) — cél: 500
 * 3. Italszponzor pitch fázis
 */

const SEPTEMBER_DEADLINE = new Date(new Date().getFullYear(), 8, 1); // szept 1
const PARTNER_TARGET = 20;
const WAITLIST_TARGET = 500;

export default function MissionTracker() {
  const [loiCount, setLoiCount] = useState(0);
  const [signedCount, setSignedCount] = useState(0);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [waitlist7d, setWaitlist7d] = useState(0);
  const [sponsorStage, setSponsorStage] = useState<"prep" | "research" | "outreach" | "meeting" | "offer">("prep");

  const daysLeft = Math.max(0, Math.ceil((SEPTEMBER_DEADLINE.getTime() - Date.now()) / 86400000));

  useEffect(() => {
    (async () => {
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
      const [loi, signed, wl, wl7] = await Promise.all([
        supabase.from("partners").select("id", { count: "exact", head: true }).in("status", ["loi", "signed"]),
        supabase.from("partners").select("id", { count: "exact", head: true }).eq("status", "signed"),
        supabase.from("waitlist").select("id", { count: "exact", head: true }),
        supabase.from("waitlist").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
      ]);
      setLoiCount(loi.count ?? 0);
      setSignedCount(signed.count ?? 0);
      setWaitlistCount(wl.count ?? 0);
      setWaitlist7d(wl7.count ?? 0);

      // Italszponzor stage heuristic: ha van >=10 LOI és >=300 waitlist → outreach-re kész
      if ((loi.count ?? 0) >= 10 && (wl.count ?? 0) >= 300) setSponsorStage("outreach");
      else if ((loi.count ?? 0) >= 5) setSponsorStage("research");
      else setSponsorStage("prep");
    })();
  }, []);

  const partnerPct = Math.min(100, (loiCount / PARTNER_TARGET) * 100);
  const waitlistPct = Math.min(100, (waitlistCount / WAITLIST_TARGET) * 100);
  const STAGE_LABEL = { prep: "Előkészítés", research: "Kutatás", outreach: "Outreach", meeting: "Találkozók", offer: "Ajánlat" }[sponsorStage];

  return (
    <Card className="border-electric-300/40 bg-gradient-to-br from-electric-300/10 via-electric-300/5 to-transparent">
      <div className="p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-electric-300">🎯 Szeptemberi misszió</div>
            <div className="text-sm text-nf-text-muted">{daysLeft} nap van hátra szept. 1-ig</div>
          </div>
          <HelpTip
            what="Három cél, amit szeptemberig elérünk: partner-előmegállapodások, előregisztrációk, italszponzor pitch."
            why="Ez a 3 szám dönti el, hogy van-e érdemben miről tárgyalni a befektetőkkel és italmárkákkal ősszel."
            how="Minden nap nézd meg, hogy halad-e — ha valamelyik elakad, az legyen ma a fókusz."
          />
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          {/* 1. Partner LOI */}
          <Link to="/admin/partners" className="group">
            <div className="p-3 rounded-lg bg-nf-bg/40 border border-nf-border hover:border-electric-300/60 transition-colors h-full">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-nf-text-muted">
                <Target className="w-3 h-3" /> 1. Partner LOI
              </div>
              <div className="flex items-baseline gap-2 mt-1.5">
                <div className="text-3xl font-bold text-electric-300">{loiCount}</div>
                <div className="text-xs text-nf-text-muted">/ {PARTNER_TARGET}</div>
                <ArrowRight className="w-3.5 h-3.5 text-nf-text-muted ml-auto group-hover:text-electric-300 transition" />
              </div>
              <div className="mt-2 h-1.5 bg-nf-surface-alt rounded-full overflow-hidden">
                <div className="h-full bg-electric-300 transition-all" style={{ width: `${partnerPct}%` }} />
              </div>
              <div className="text-[10px] text-nf-text-muted mt-1">{signedCount} aláírt · {loiCount - signedCount} LOI</div>
            </div>
          </Link>

          {/* 2. Waitlist */}
          <Link to="/admin/content" className="group">
            <div className="p-3 rounded-lg bg-nf-bg/40 border border-nf-border hover:border-electric-300/60 transition-colors h-full">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-nf-text-muted">
                <Users className="w-3 h-3" /> 2. Előregisztráció
              </div>
              <div className="flex items-baseline gap-2 mt-1.5">
                <div className="text-3xl font-bold text-electric-300">{waitlistCount}</div>
                <div className="text-xs text-nf-text-muted">/ {WAITLIST_TARGET}</div>
                <ArrowRight className="w-3.5 h-3.5 text-nf-text-muted ml-auto group-hover:text-electric-300 transition" />
              </div>
              <div className="mt-2 h-1.5 bg-nf-surface-alt rounded-full overflow-hidden">
                <div className="h-full bg-electric-300 transition-all" style={{ width: `${waitlistPct}%` }} />
              </div>
              <div className="text-[10px] text-nf-text-muted mt-1">
                +{waitlist7d} elmúlt 7 nap {waitlist7d > 30 ? "🔥" : ""}
              </div>
            </div>
          </Link>

          {/* 3. Italszponzor */}
          <Link to="/admin/brand" className="group">
            <div className="p-3 rounded-lg bg-nf-bg/40 border border-nf-border hover:border-electric-300/60 transition-colors h-full">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-nf-text-muted">
                <Beer className="w-3 h-3" /> 3. Italszponzor
              </div>
              <div className="flex items-baseline gap-2 mt-1.5">
                <div className="text-lg font-bold text-electric-300 truncate">{STAGE_LABEL}</div>
                <ArrowRight className="w-3.5 h-3.5 text-nf-text-muted ml-auto group-hover:text-electric-300 transition" />
              </div>
              <div className="flex gap-1 mt-2">
                {(["prep", "research", "outreach", "meeting", "offer"] as const).map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 flex-1 rounded-full ${
                      ["prep", "research", "outreach", "meeting", "offer"].indexOf(sponsorStage) >=
                      ["prep", "research", "outreach", "meeting", "offer"].indexOf(s)
                        ? "bg-electric-300"
                        : "bg-nf-surface-alt"
                    }`}
                  />
                ))}
              </div>
              <div className="text-[10px] text-nf-text-muted mt-1">
                {loiCount >= 10 && waitlistCount >= 300 ? "Ready to pitch" : `Kell: ${Math.max(0, 10 - loiCount)} LOI · ${Math.max(0, 300 - waitlistCount)} signup`}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </Card>
  );
}
