import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { trackEvent } from "@/lib/track";

export default function PartnerHealthRadar({ partnerId }: { partnerId: string }) {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: res, error } = await supabase.functions.invoke("partner-health-radar", { body: { partner_id: partnerId } });
        if (error) throw error;
        setData(res?.dimensions ?? null);
        trackEvent("health_radar_viewed", { entity_id: partnerId, entity_type: "partner" });
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [partnerId]);

  if (loading) return <Card className="p-4 bg-nf-surface border-nf-border"><Loader2 className="h-4 w-4 animate-spin text-electric-300" /></Card>;
  if (!data) return null;
  return (
    <Card className="p-3 bg-nf-surface border-nf-border">
      <div className="text-xs font-semibold text-electric-300 mb-2">Partner Health Radar</div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#1f2937" />
            <PolarAngleAxis dataKey="key" tick={{ fill: "#9ca3af", fontSize: 10 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} stroke="#374151" />
            <Radar dataKey="value" stroke="#00bcd4" fill="#00bcd4" fillOpacity={0.35} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
