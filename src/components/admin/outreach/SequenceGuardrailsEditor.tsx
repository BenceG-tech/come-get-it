import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Loader2, Zap } from "lucide-react";
import FieldHelp from "@/components/admin/help/FieldHelp";
import { useToast } from "@/hooks/use-toast";

export type Guardrails = {
  quiet_hours_from?: string;
  quiet_hours_to?: string;
  skip_weekends?: boolean;
  workdays_only?: boolean;
  max_per_partner_per_month?: number;
  min_days_between_steps?: number;
  auto_pause_on_reply?: boolean;
  auto_pause_on_bounce?: boolean;
};

const DEFAULTS: Guardrails = {
  quiet_hours_from: "20:00",
  quiet_hours_to: "08:00",
  skip_weekends: true,
  workdays_only: false,
  max_per_partner_per_month: 3,
  min_days_between_steps: 2,
  auto_pause_on_reply: true,
  auto_pause_on_bounce: true,
};

export function guardrailsBadges(g?: Guardrails | null): string[] {
  if (!g) return [];
  const out: string[] = [];
  if (g.quiet_hours_from && g.quiet_hours_to) out.push(`Csendes ${g.quiet_hours_from}–${g.quiet_hours_to}`);
  if (g.skip_weekends) out.push("Hétvégén nem");
  if (g.workdays_only) out.push("Csak munkanap");
  if (g.max_per_partner_per_month) out.push(`Max ${g.max_per_partner_per_month}/hó`);
  if (g.min_days_between_steps) out.push(`≥${g.min_days_between_steps} nap lépések közt`);
  if (g.auto_pause_on_reply) out.push("Pause @ reply");
  if (g.auto_pause_on_bounce) out.push("Pause @ bounce");
  return out;
}

export default function SequenceGuardrailsEditor({
  sequenceId, sequenceName, initial, open, onOpenChange, onSaved,
}: {
  sequenceId: string;
  sequenceName: string;
  initial?: Guardrails | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSaved?: () => void;
}) {
  const [g, setG] = useState<Guardrails>({ ...DEFAULTS, ...(initial ?? {}) });
  const [autoGrade, setAutoGrade] = useState<string>("off");
  const [autoConf, setAutoConf] = useState<number>(0.75);
  const [dailyCap, setDailyCap] = useState<number>(30);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) return;
    setG({ ...DEFAULTS, ...(initial ?? {}) });
    // Load current autopilot settings from sequence
    (async () => {
      const { data } = await supabase.from("outreach_sequences")
        .select("auto_send_min_grade, auto_send_min_confidence, daily_cap").eq("id", sequenceId).maybeSingle();
      setAutoGrade((data?.auto_send_min_grade as string) || "off");
      setAutoConf(Number(data?.auto_send_min_confidence ?? 0.75));
      setDailyCap(Number(data?.daily_cap ?? 30));
    })();
  }, [open, sequenceId]);

  const set = (patch: Partial<Guardrails>) => setG((x) => ({ ...x, ...patch }));

  const save = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("outreach_sequences")
        .update({
          guardrails: g as any,
          auto_send_min_grade: autoGrade === "off" ? null : autoGrade,
          auto_send_min_confidence: autoConf,
          daily_cap: dailyCap,
        })
        .eq("id", sequenceId);
      if (error) throw error;
      toast({ title: "Mentve", description: sequenceName });
      onSaved?.();
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-nf-surface border-nf-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-electric-300" /> Guardrails — {sequenceName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Autopilot block */}
          <div className="rounded-lg border border-electric-300/30 bg-electric-300/5 p-3 space-y-3">
            <div className="text-sm font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4 text-electric-300" /> Autopilot kiküldés
              <FieldHelp text="Amikor az 'AI csinálja' task-autopilot enrollment-eket készít, ezen küszöbök fölött nem várja meg a jóváhagyásodat — egyből aktiválja." />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Min. grade</Label>
                <Select value={autoGrade} onValueChange={setAutoGrade}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="off">Ki</SelectItem>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B (és felette)</SelectItem>
                    <SelectItem value="C">C (és felette)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Min. AI conf.</Label>
                <Input type="number" min={0} max={1} step={0.05} value={autoConf}
                  onChange={(e) => setAutoConf(Number(e.target.value) || 0)} />
              </div>
              <div>
                <Label className="text-xs">Napi cap</Label>
                <Input type="number" min={1} max={500} value={dailyCap}
                  onChange={(e) => setDailyCap(Number(e.target.value) || 30)} />
              </div>
            </div>
            <div className="text-[10px] text-nf-text-muted">
              {autoGrade === "off"
                ? "Auto-send KI — minden enrollment draft-ként készül, te aktiválod."
                : `Auto-send: grade ≥ ${autoGrade} & confidence ≥ ${autoConf} → azonnal aktív. A többi draft marad.`}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs flex items-center gap-1">
                Csendes órák — tól <FieldHelp text="Ebben az időablakban a tick nem küld emailt." />
              </Label>
              <Input type="time" value={g.quiet_hours_from ?? ""} onChange={(e) => set({ quiet_hours_from: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs flex items-center gap-1">
                Csendes órák — ig <FieldHelp text="Reggeli kezdés." />
              </Label>
              <Input type="time" value={g.quiet_hours_to ?? ""} onChange={(e) => set({ quiet_hours_to: e.target.value })} />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-nf-border p-3">
            <div>
              <div className="text-sm">Hétvége kihagyása</div>
              <div className="text-xs text-nf-text-muted">Ajánlott B2B-re.</div>
            </div>
            <Switch checked={!!g.skip_weekends} onCheckedChange={(v) => set({ skip_weekends: v })} />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-nf-border p-3">
            <div>
              <div className="text-sm">Csak munkanapokon</div>
              <div className="text-xs text-nf-text-muted">Hét-péntek.</div>
            </div>
            <Switch checked={!!g.workdays_only} onCheckedChange={(v) => set({ workdays_only: v })} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Max email/partner/hó</Label>
              <Input type="number" min={1} max={20} value={g.max_per_partner_per_month ?? ""}
                onChange={(e) => set({ max_per_partner_per_month: Number(e.target.value) || undefined })} />
            </div>
            <div>
              <Label className="text-xs">Min. nap lépések közt</Label>
              <Input type="number" min={0} max={30} value={g.min_days_between_steps ?? ""}
                onChange={(e) => set({ min_days_between_steps: Number(e.target.value) || undefined })} />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-nf-border p-3">
            <div className="text-sm">Auto-pause reply-nél</div>
            <Switch checked={!!g.auto_pause_on_reply} onCheckedChange={(v) => set({ auto_pause_on_reply: v })} />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-nf-border p-3">
            <div className="text-sm">Auto-pause bounce-nál</div>
            <Switch checked={!!g.auto_pause_on_bounce} onCheckedChange={(v) => set({ auto_pause_on_bounce: v })} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Mégse</Button>
          <Button variant="neon" onClick={save} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Shield className="h-4 w-4 mr-1" />} Mentés
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
