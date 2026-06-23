import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Image as ImageIcon, Download, Copy, Sparkles } from "lucide-react";

const VARIANTS = [
  { id: "feed", label: "📱 Feed poszt" },
  { id: "story", label: "📲 Story 9:16" },
  { id: "dm", label: "💬 DM preview" },
];

export default function LeadMockupGenerator({ partnerId }: { partnerId: string }) {
  const [mockups, setMockups] = useState<any[]>([]);
  const [generating, setGenerating] = useState<string | null>(null);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("lead_mockups").select("*").eq("partner_id", partnerId).order("created_at", { ascending: false }).limit(12);
    setMockups(data ?? []);
  };
  useEffect(() => { load(); }, [partnerId]);

  const generate = async (variant: string) => {
    setGenerating(variant);
    try {
      const { data, error } = await supabase.functions.invoke("apify-mockup-generate", { body: { partner_id: partnerId, variant } });
      if (error) throw error;
      toast({ title: "Mockup elkészült 🎨" });
      load();
    } catch (e: any) {
      toast({ title: "Generálás hiba", description: e.message, variant: "destructive" });
    } finally { setGenerating(null); }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL vágólapra másolva" });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center gap-1.5"><ImageIcon className="w-4 h-4 text-electric-300" /> Personalized mockup-ok</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {VARIANTS.map((v) => (
          <Button key={v.id} size="sm" variant="outline" onClick={() => generate(v.id)} disabled={!!generating}>
            {generating === v.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} {v.label}
          </Button>
        ))}
      </div>
      {mockups.length === 0 && (
        <div className="text-xs text-nf-text-muted p-4 text-center border border-dashed border-nf-border rounded">
          Generálj egy mockup-ot ami megmutatja hogy nézne ki ez a hely az appban — erős hook outreach-hez.
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        {mockups.map((m) => (
          <div key={m.id} className="relative group">
            <img src={m.image_url} alt="" className="w-full rounded border border-nf-border" loading="lazy" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 rounded">
              <a href={m.image_url} download target="_blank" rel="noopener"><Button size="sm" variant="secondary"><Download className="w-3 h-3" /></Button></a>
              <Button size="sm" variant="secondary" onClick={() => copyUrl(m.image_url)}><Copy className="w-3 h-3" /></Button>
            </div>
            <div className="text-[10px] text-nf-text-muted mt-1">{m.variant} · {new Date(m.created_at).toLocaleDateString("hu")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
