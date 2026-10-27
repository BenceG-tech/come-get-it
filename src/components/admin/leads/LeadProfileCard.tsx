import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Globe, Instagram, Facebook, Linkedin, MapPin, Star, Clock, Tag, User, FileText, ExternalLink, Copy, Calculator, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { getLeadProfile, telHref, webHref, type LeadRow } from "@/lib/lead-profile";
import { computeRubric, rubricToScoreReasons, RUBRIC_DOC } from "@/lib/lead-score-rubric";
import { readSavedCsomag } from "@/lib/outreach-csomag";
import { GradeBadge } from "@/components/admin/leads/LeadScoreBadge";

function Row({ icon: Icon, label, children }: { icon: typeof Mail; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 py-1.5 border-b border-nf-border/50 last:border-0">
      <Icon className="w-3.5 h-3.5 mt-0.5 text-electric-300 shrink-0" />
      <div className="w-28 shrink-0 text-[11px] uppercase tracking-wide text-nf-text-muted pt-px">{label}</div>
      <div className="flex-1 min-w-0 text-sm break-words">{children}</div>
    </div>
  );
}

const Empty = () => <span className="text-nf-text-muted">—</span>;

export default function LeadProfileCard({ partner, onChanged }: { partner: LeadRow; onChanged?: () => void }) {
  const profile = useMemo(() => getLeadProfile(partner), [partner]);
  const rubric = useMemo(() => computeRubric(partner as Parameters<typeof computeRubric>[0]), [partner]);
  const saved = readSavedCsomag(partner);
  const [rescoring, setRescoring] = useState(false);
  const [showFormula, setShowFormula] = useState(false);
  const { toast } = useToast();

  const storedScore = typeof partner.lead_score === "number" ? partner.lead_score : null;
  const storedGrade = typeof partner.lead_grade === "string" ? partner.lead_grade : null;
  const outdated = storedScore !== rubric.total || storedGrade !== rubric.grade;

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Vágólapra másolva", description: text.length > 60 ? `${text.slice(0, 60)}…` : text });
  };

  const rescore = async () => {
    setRescoring(true);
    try {
      const { error } = await supabase
        .from("partners")
        .update({
          lead_score: rubric.total,
          ai_score: rubric.total,
          score_reasons: rubricToScoreReasons(rubric) as unknown as Json,
          score_updated_at: new Date().toISOString(),
          lead_grade: rubric.grade,
          lead_grade_source: "auto",
          lead_grade_computed_at: new Date().toISOString(),
        })
        .eq("id", partner.id);
      if (error) throw error;
      toast({ title: `Újrapontozva: ${rubric.total} pont · ${rubric.grade}` });
      onChanged?.();
    } catch (e) {
      toast({ title: "Hiba", description: e instanceof Error ? e.message : String(e), variant: "destructive" });
    } finally {
      setRescoring(false);
    }
  };

  return (
    <div className="space-y-3">
      <Card className="p-3 bg-nf-surface border-nf-border">
        <div className="text-[10px] uppercase tracking-wider text-electric-300 mb-1">Adatlap</div>
        <Row icon={Tag} label="Kategória">{profile.category ?? <Empty />}</Row>
        <Row icon={MapPin} label="Cím">
          {profile.address ? (
            <span>
              {profile.address}
              {profile.city && !profile.address.toLowerCase().includes(profile.city.toLowerCase()) ? `, ${profile.city}` : ""}
            </span>
          ) : profile.city ?? <Empty />}
          {profile.districtLabel && <span className="ml-2 px-1.5 py-0.5 rounded bg-electric-300/10 text-electric-300 text-[10px]">{profile.districtLabel}</span>}
        </Row>
        <Row icon={Star} label="Google">
          {profile.rating ? (
            <span>
              {profile.rating.toFixed(1).replace(".", ",")}★ <span className="text-nf-text-muted">({profile.reviews ?? 0} értékelés)</span>
            </span>
          ) : <Empty />}
          {profile.mapsUrl && (
            <a href={profile.mapsUrl} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center gap-1 text-electric-300 hover:underline text-xs">
              Térkép <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </Row>
        <Row icon={Mail} label="E-mail">
          {profile.emails.length ? profile.emails.map((e) => (
            <div key={e} className="flex items-center gap-1">
              <a href={`mailto:${e}`} className="text-electric-300 hover:underline truncate">{e}</a>
              <button onClick={() => copy(e)} className="text-nf-text-muted hover:text-white" title="Másolás"><Copy className="w-3 h-3" /></button>
            </div>
          )) : <Empty />}
        </Row>
        <Row icon={Phone} label="Telefon">
          {profile.phones.length ? profile.phones.map((ph) => (
            <div key={ph} className="flex items-center gap-1">
              <a href={telHref(ph)} className="text-electric-300 hover:underline">{ph}</a>
              <button onClick={() => copy(ph)} className="text-nf-text-muted hover:text-white" title="Másolás"><Copy className="w-3 h-3" /></button>
            </div>
          )) : <Empty />}
        </Row>
        <Row icon={Globe} label="Weboldal">
          {profile.website ? <a href={webHref(profile.website)} target="_blank" rel="noopener noreferrer" className="text-electric-300 hover:underline break-all">{profile.website}</a> : <Empty />}
        </Row>
        <Row icon={Instagram} label="Instagram">
          {profile.instagramUrl ? <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-electric-300 hover:underline">@{profile.instagramHandle}</a> : <Empty />}
        </Row>
        <Row icon={Facebook} label="Facebook">
          {profile.facebookUrl ? <a href={webHref(profile.facebookUrl)} target="_blank" rel="noopener noreferrer" className="text-electric-300 hover:underline break-all">{profile.facebookUrl.replace(/^https?:\/\/(www\.)?/, "")}</a> : <Empty />}
        </Row>
        {profile.linkedinUrl && (
          <Row icon={Linkedin} label="LinkedIn">
            <a href={webHref(profile.linkedinUrl)} target="_blank" rel="noopener noreferrer" className="text-electric-300 hover:underline break-all">{profile.linkedinUrl.replace(/^https?:\/\/(www\.)?/, "")}</a>
          </Row>
        )}
        <Row icon={Clock} label="Nyitvatartás">
          {profile.openingHours ? <span className="whitespace-pre-line text-xs">{profile.openingHours}</span> : <Empty />}
        </Row>
        <Row icon={User} label="Kapcsolattartó">{profile.contactName ?? <Empty />}</Row>
        <Row icon={FileText} label="Leírás">
          {profile.description ? <span className="text-xs text-nf-text-muted">{profile.description}</span> : <Empty />}
        </Row>
        {profile.notes && profile.notes !== profile.description && (
          <Row icon={FileText} label="Jegyzet"><span className="text-xs text-nf-text-muted whitespace-pre-line">{profile.notes}</span></Row>
        )}
      </Card>

      <Card className="p-3 bg-nf-surface border-nf-border">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="text-[10px] uppercase tracking-wider text-electric-300">Pontozás – miért?</div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">{rubric.total}/100</span>
            <GradeBadge grade={rubric.grade} />
          </div>
        </div>
        <div className="space-y-1.5">
          {rubric.lines.map((l) => (
            <div key={l.key} className="text-[11px]">
              <div className="flex justify-between gap-2">
                <span>{l.label}</span>
                <span className="font-mono text-nf-text-muted">{l.points}/{l.max}</span>
              </div>
              {l.note && <div className="text-[10px] text-nf-text-muted">{l.note}</div>}
              <div className="h-1 bg-nf-surface-alt rounded-full mt-0.5 overflow-hidden">
                <div className="h-full bg-electric-300" style={{ width: `${(l.points / Math.max(1, l.max)) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        {typeof partner.ai_score_reason === "string" && partner.ai_score_reason && (
          <div className="mt-2 pt-2 border-t border-nf-border text-[11px] text-nf-text-muted">
            <b className="text-nf-text">AI-megjegyzés{partner.lead_grade_source === "ai" && storedGrade ? ` (AI grade: ${storedGrade})` : ""}:</b> {partner.ai_score_reason}
          </div>
        )}
        <div className="mt-2 pt-2 border-t border-nf-border flex items-center justify-between gap-2 flex-wrap">
          <div className="text-[11px] text-nf-text-muted">
            Tárolt: {storedScore ?? "—"} pont · {storedGrade ?? "—"}
            {outdated && <span className="text-amber-400"> · eltér a képlettől</span>}
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" className="h-7 text-xs text-nf-text-muted hover:text-white" onClick={() => setShowFormula((s) => !s)}>Képlet</Button>
            {outdated && (
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={rescore} disabled={rescoring} title="A fenti képlet szerinti pontot és grade-et menti a leadhez (az AI grade-et is felülírja)">
                {rescoring ? <Loader2 className="w-3 h-3 animate-spin" /> : <Calculator className="w-3 h-3" />} Mentés képlet szerint
              </Button>
            )}
          </div>
        </div>
        {showFormula && (
          <div className="mt-2 text-[10px] text-nf-text-muted space-y-1 bg-nf-surface-alt/40 rounded p-2">
            {RUBRIC_DOC.map((d) => (
              <div key={d.label}><b className="text-nf-text">{d.label} (max {d.max}):</b> {d.rule}</div>
            ))}
            <div><b className="text-nf-text">Grade:</b> A ≥ 80 · B ≥ 60 · C ≥ 40 · D &lt; 40</div>
          </div>
        )}
      </Card>

      {saved && (
        <div className="text-[11px] text-nf-text-muted">
          Megkeresési csomag mentve: {new Date(saved.generated_at).toLocaleString("hu-HU")} · ajánlat: {saved.offer.itemShort}, {saved.offer.slot}, napi {saved.offer.dailyCap}
        </div>
      )}
    </div>
  );
}
