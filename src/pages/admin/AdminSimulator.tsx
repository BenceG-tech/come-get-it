import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { TrendingUp, Sparkles, AlertTriangle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/track";

/**
 * Pipeline Simulator (what-if) + Pre-mortem (AI risks)
 */
export default function AdminSimulator() {
  const [extraLeadsPerWeek, setExtraLeads] = useState(10);
  const [conversionBoost, setConversionBoost] = useState(0); // % boost
  const [horizon, setHorizon] = useState(60);
  const [premortem, setPremortem] = useState<string | null>(null);
  const [premortemLoading, setPremortemLoading] = useState(false);
  const { toast } = useToast();
  const [baseRates, setBaseRates] = useState<{ contactRate: number; negotiationRate: number; signedRate: number; weeklyLeadVelocity: number; avgRevenue: number }>({
    contactRate: 0.4, negotiationRate: 0.3, signedRate: 0.25, weeklyLeadVelocity: 5, avgRevenue: 50000,
  });

  useEffect(() => {
    (async () => {
      const since = new Date(Date.now() - 90 * 86400 * 1000).toISOString();
      const { data: parts } = await supabase
        .from("partners")
        .select("id, status, created_at")
        .gte("created_at", since)
        .limit(2000);
      const p = parts ?? [];

      // Heuristic conversion rates based on current pipeline distribution
      const count = (statuses: string[]) => p.filter((x) => statuses.includes(x.status)).length;
      const leads = count(["lead", "contacted", "negotiating", "proposal_sent", "signed"]) || 1;
      const contacted = count(["contacted", "negotiating", "proposal_sent", "signed"]);
      const negotiating = count(["negotiating", "proposal_sent", "signed"]);
      const signed = count(["signed"]);

      setBaseRates({
        contactRate: Math.max(0.2, contacted / leads),
        negotiationRate: Math.max(0.2, contacted > 0 ? negotiating / contacted : 0.3),
        signedRate: Math.max(0.1, negotiating > 0 ? signed / negotiating : 0.25),
        weeklyLeadVelocity: Math.max(2, Math.round(p.length / 13)),
        avgRevenue: 50000,
      });
    })();
  }, []);

  // Monte Carlo simulation
  const sim = useMemo(() => {
    const runs = 500;
    const weeks = Math.ceil(horizon / 7);
    const boost = 1 + conversionBoost / 100;
    const c1 = Math.min(0.95, baseRates.contactRate * boost);
    const c2 = Math.min(0.95, baseRates.negotiationRate * boost);
    const c3 = Math.min(0.95, baseRates.signedRate * boost);
    const weeklyLeads = baseRates.weeklyLeadVelocity + extraLeadsPerWeek;
    const results: number[] = [];
    for (let r = 0; r < runs; r++) {
      let signed = 0;
      for (let w = 0; w < weeks; w++) {
        const newLeads = Math.max(0, Math.round(weeklyLeads + (Math.random() - 0.5) * 4));
        let stage = newLeads;
        // each stage: binomial(stage, rate)
        const draw = (n: number, p: number) => { let s = 0; for (let i = 0; i < n; i++) if (Math.random() < p) s++; return s; };
        stage = draw(stage, c1);
        stage = draw(stage, c2);
        stage = draw(stage, c3);
        signed += stage;
      }
      results.push(signed);
    }
    results.sort((a, b) => a - b);
    const pct = (p: number) => results[Math.floor(p * results.length)] ?? 0;
    return {
      p10: pct(0.1), p50: pct(0.5), p90: pct(0.9),
      revP50: pct(0.5) * baseRates.avgRevenue,
      weeklyLeads,
      c1: Math.round(c1 * 100), c2: Math.round(c2 * 100), c3: Math.round(c3 * 100),
    };
  }, [extraLeadsPerWeek, conversionBoost, horizon, baseRates]);

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-5xl">
      <div className="mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2"><TrendingUp className="w-6 h-6 text-electric-300" /> Pipeline Simulator</h1>
        <p className="text-sm text-nf-text-muted">Mi van, ha többet keresel meg, vagy jobb a konverziód? Monte Carlo szimuláció a historikus adatokból.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Beállítások</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2"><span>+ Heti új leadek</span><span className="font-bold text-electric-300">+{extraLeadsPerWeek}</span></div>
              <Slider value={[extraLeadsPerWeek]} onValueChange={(v) => setExtraLeads(v[0])} min={0} max={50} step={1} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2"><span>Konverzió boost</span><span className="font-bold text-electric-300">+{conversionBoost}%</span></div>
              <Slider value={[conversionBoost]} onValueChange={(v) => setConversionBoost(v[0])} min={-30} max={60} step={5} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2"><span>Időhorizont</span><span className="font-bold text-electric-300">{horizon} nap</span></div>
              <Slider value={[horizon]} onValueChange={(v) => setHorizon(v[0])} min={30} max={180} step={30} />
            </div>
            <div className="text-xs text-nf-text-muted pt-2 border-t border-nf-border">
              <div>Historikus base: heti {baseRates.weeklyLeadVelocity} új lead</div>
              <div>Lead→kontakt: {Math.round(baseRates.contactRate * 100)}% · kontakt→tárgyalás: {Math.round(baseRates.negotiationRate * 100)}% · ajánlat→aláírt: {Math.round(baseRates.signedRate * 100)}%</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-electric-300/30">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Sparkles className="w-4 h-4 text-electric-300" /> Várt eredmény ({horizon} nap múlva)</CardTitle></CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="text-xs text-nf-text-muted mb-1">Aláírt partnerek (median)</div>
              <div className="text-6xl font-bold text-electric-300">{sim.p50}</div>
              <div className="text-xs text-nf-text-muted mt-2">Tartomány (p10–p90): <span className="text-white">{sim.p10}–{sim.p90}</span></div>
            </div>
            <div className="border-t border-nf-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-nf-text-muted">Heti új lead (új ütem)</span><span className="font-semibold">{sim.weeklyLeads}</span></div>
              <div className="flex justify-between"><span className="text-nf-text-muted">Effektív konverzió</span><span className="font-semibold">{sim.c1}% → {sim.c2}% → {sim.c3}%</span></div>
              <div className="flex justify-between pt-2 border-t border-nf-border"><span className="text-nf-text-muted">Becsült bevétel (median)</span><span className="font-semibold text-electric-300">{Math.round(sim.revP50).toLocaleString("hu-HU")} Ft</span></div>
            </div>
            <div className="mt-4 text-[11px] text-nf-text-muted italic">500 Monte Carlo futtatás. Becsült bevétel: 50 000 Ft / aláírt partner (heurisztika).</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
