import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Sparkles, RefreshCw, ArrowDownToLine, Loader2,
  TrendingUp, Target, AlertTriangle, ChevronDown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Briefing = {
  id: string;
  date: string;
  summary_md: string;
  highlights: string[];
  suggested_focus: string[];
};

type Tone = "emerald" | "cyan" | "amber";

const TONE: Record<Tone, { ring: string; text: string; chip: string; iconBg: string }> = {
  emerald: {
    ring: "border-emerald-400/20",
    text: "text-emerald-300",
    chip: "bg-emerald-400/10",
    iconBg: "bg-emerald-400/10 text-emerald-300",
  },
  cyan: {
    ring: "border-electric-300/25",
    text: "text-electric-300",
    chip: "bg-electric-300/10",
    iconBg: "bg-electric-300/10 text-electric-300",
  },
  amber: {
    ring: "border-amber-400/20",
    text: "text-amber-300",
    chip: "bg-amber-400/10",
    iconBg: "bg-amber-400/10 text-amber-300",
  },
};

/** Egyetlen szöveg-blokk a briefingből — alapból zárt, "Részletek" expand. */
function MiniBlock({
  title, tone, icon: Icon, summary, full,
}: {
  title: string;
  tone: Tone;
  icon: typeof TrendingUp;
  summary: string;
  full?: string | null;
}) {
  const t = TONE[tone];
  const [open, setOpen] = useState(false);
  const hasMore = !!(full && full.trim().length > summary.length + 8);
  return (
    <div className={cn("rounded-xl border bg-white/[0.015] p-4 transition-colors", t.ring)}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className={cn("h-7 w-7 rounded-lg grid place-items-center", t.iconBg)}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className={cn("text-xs uppercase tracking-widest font-semibold", t.text)}>{title}</div>
      </div>
      <p className="text-sm text-white/75 leading-relaxed">{summary}</p>
      {hasMore && (
        <>
          <button
            onClick={() => setOpen((o) => !o)}
            className="mt-2 inline-flex items-center gap-1 text-[11px] text-white/50 hover:text-white/80 transition-colors"
          >
            <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
            {open ? "Bezár" : "Részletek"}
          </button>
          {open && (
            <div className="mt-2 prose prose-sm prose-invert max-w-none [&_p]:text-sm [&_p]:text-white/70 [&_ul]:text-sm [&_li]:my-0.5 [&_h2]:hidden">
              <ReactMarkdown>{full!}</ReactMarkdown>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/** A summary_md markdown szöveget szekciókra bontja H2 fejlécek mentén. */
function splitSections(md: string): Record<string, { full: string; first: string }> {
  const out: Record<string, { full: string; first: string }> = {};
  if (!md) return out;
  const lines = md.split(/\r?\n/);
  let current: string | null = null;
  let buf: string[] = [];
  const push = () => {
    if (!current) return;
    const full = buf.join("\n").trim();
    const firstPara = full.split(/\n\s*\n/)[0] ?? full;
    const firstSentence = firstPara.replace(/^[-*]\s*/gm, "").split(/(?<=[.!?])\s+/).slice(0, 2).join(" ");
    out[current.toLowerCase()] = { full, first: firstSentence.trim() || firstPara };
  };
  for (const ln of lines) {
    const h = ln.match(/^##\s+(.+)/);
    if (h) {
      push();
      current = h[1].trim();
      buf = [];
    } else if (current) {
      buf.push(ln);
    }
  }
  push();
  return out;
}

function findSection(map: Record<string, { full: string; first: string }>, keys: string[]): { full: string; first: string } | null {
  for (const k of Object.keys(map)) {
    if (keys.some((needle) => k.includes(needle))) return map[k];
  }
  return null;
}

export function DailyBriefingCard() {
  const { user } = useAuth();
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [loading, setLoading] = useState(false);
  const [adopting, setAdopting] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  const load = async () => {
    const { data } = await supabase.from("daily_briefings").select("*").eq("date", today).maybeSingle();
    setBriefing(data as any);
  };

  useEffect(() => { load(); }, []);

  const generate = async (force = false) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("daily-briefing", { body: { force } });
      if (error) throw error;
      if (data?.briefing) setBriefing(data.briefing);
      toast.success(data?.cached ? "Mai briefing betöltve" : "Új briefing kész");
    } catch (e: any) {
      toast.error("Briefing hiba: " + (e?.message ?? e));
    } finally { setLoading(false); }
  };

  const adoptFocus = async () => {
    if (!user || !briefing?.suggested_focus?.length) return;
    setAdopting(true);
    try {
      const top = briefing.suggested_focus.slice(0, 3).map((t) => ({ text: t, done: false }));
      const { data: existing } = await supabase.from("daily_focus").select("id").eq("user_id", user.id).eq("focus_date", today).maybeSingle();
      if (existing) {
        await supabase.from("daily_focus").update({ top_priorities: top }).eq("id", existing.id);
      } else {
        await supabase.from("daily_focus").insert({ user_id: user.id, focus_date: today, top_priorities: top });
      }
      toast.success("Mai fókusz átemelve");
      window.location.reload();
    } catch (e: any) {
      toast.error("Hiba: " + (e?.message ?? e));
    } finally { setAdopting(false); }
  };

  const sections = briefing ? splitSections(briefing.summary_md || "") : {};
  const yesterday = findSection(sections, ["tegnap", "yesterday"]);
  const focus = findSection(sections, ["mai fókusz", "ma ", "fokusz", "today", "focus"]);
  const warn = findSection(sections, ["figyelmeztet", "kockáz", "warning", "risk"]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-electric-300/10 text-electric-300 grid place-items-center">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <div className="text-sm font-semibold">AI napi briefing</div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => generate(true)}
          disabled={loading}
          className="ml-auto h-7 px-2"
          title="Frissítés"
        >
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
        </Button>
      </div>

      {!briefing && !loading && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-4 space-y-2">
          <div className="text-sm text-white/60">Még nincs mai briefing. Generálj egyet — KPI-okat, nyitott partnereket és a naptárt elemzem.</div>
          <Button size="sm" variant="neon" onClick={() => generate(false)} className="w-full">
            Briefing generálása
          </Button>
        </div>
      )}

      {briefing && (
        <>
          <div className="grid gap-2.5">
            {yesterday && (
              <MiniBlock
                title="Tegnap történt"
                tone="emerald"
                icon={TrendingUp}
                summary={yesterday.first}
                full={yesterday.full}
              />
            )}
            {focus && (
              <MiniBlock
                title="Mai fókusz"
                tone="cyan"
                icon={Target}
                summary={focus.first}
                full={focus.full}
              />
            )}
            {warn && (
              <MiniBlock
                title="Figyelmeztetések"
                tone="amber"
                icon={AlertTriangle}
                summary={warn.first}
                full={warn.full}
              />
            )}
            {/* Fallback ha nincs strukturált szekció */}
            {!yesterday && !focus && !warn && (
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-4 prose prose-sm prose-invert max-w-none [&_p]:text-sm [&_p]:text-white/75">
                <ReactMarkdown>{briefing.summary_md}</ReactMarkdown>
              </div>
            )}
          </div>

          {briefing.suggested_focus?.length > 0 && (
            <div className="rounded-xl border border-electric-300/20 bg-electric-300/[0.03] p-4 space-y-2.5">
              <div className="text-[11px] uppercase tracking-widest text-electric-300 font-semibold">Javasolt fókusz</div>
              <div className="space-y-1.5">
                {briefing.suggested_focus.slice(0, 3).map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-white/80 leading-snug">
                    <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-electric-300/15 text-electric-300 text-[11px] font-bold grid place-items-center">
                      {i + 1}
                    </span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <Button
                size="sm"
                variant="neon"
                onClick={adoptFocus}
                disabled={adopting}
                className="w-full mt-1"
              >
                {adopting ? <Loader2 className="h-3 w-3 mr-1.5 animate-spin" /> : <ArrowDownToLine className="h-3 w-3 mr-1.5" />}
                Átemelés Top 3 fókuszba
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DailyBriefingCard;
