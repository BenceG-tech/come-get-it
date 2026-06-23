import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users, FileText, Calendar, Sparkles, ArrowRight, Wand2, Palette, Activity, Image as ImageIcon,
  ListChecks, Clock, ChevronDown,
} from "lucide-react";
import { PipelineFunnel } from "@/components/admin/dashboard/PipelineFunnel";
import { WaitlistGrowth } from "@/components/admin/dashboard/WaitlistGrowth";
import { TimeTracker } from "@/components/admin/dashboard/TimeTracker";
import { DailyBriefingCard } from "@/components/admin/dashboard/DailyBriefingCard";
import { DailyFocusCard } from "@/components/admin/dashboard/DailyFocusCard";
import { WeeklyGoalsCard } from "@/components/admin/dashboard/WeeklyGoalsCard";
import { WeeklyContentSprintCard } from "@/components/admin/dashboard/WeeklyContentSprintCard";
import OutreachHealthCard from "@/components/admin/dashboard/OutreachHealthCard";
import DocumentDigestCard from "@/components/admin/dashboard/DocumentDigestCard";
import InboxZeroCard from "@/components/admin/dashboard/InboxZeroCard";
import DecisionsDueCard from "@/components/admin/dashboard/DecisionsDueCard";
import NorthstarCard from "@/components/admin/dashboard/NorthstarCard";
import AiUsageCard from "@/components/admin/dashboard/AiUsageCard";
import TrendDigestCard from "@/components/admin/dashboard/TrendDigestCard";
import CompanyHealthCard from "@/components/admin/dashboard/CompanyHealthCard";
import MissionTracker from "@/components/admin/dashboard/MissionTracker";
import TodayTasksCard from "@/components/admin/dashboard/TodayTasksCard";
import DailyStreakBar from "@/components/admin/dashboard/DailyStreakBar";
import QuickActionsBar from "@/components/admin/dashboard/QuickActionsBar";
import EveningSummaryCard from "@/components/admin/dashboard/EveningSummaryCard";
import PageHeader from "@/components/admin/PageHeader";
import { cn } from "@/lib/utils";

type ActivityRow = {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  entity_label: string | null;
  created_at: string;
};

const ENTITY_LINK: Record<string, (id: string) => string> = {
  partner: (id) => `/admin/partners/${id}`,
  document: (id) => `/admin/documents/${id}`,
  content_generation: () => `/admin/content`,
  brand_knowledge: () => `/admin/brand`,
};

const ACTION_LABEL: Record<string, string> = {
  generate: "generálta",
  update: "módosította",
  create: "létrehozta",
  analyze: "elemezte",
  delete: "törölte",
};

/** Collapsible szekció — alapból zárva, állapot localStorage-ban. */
function Section({
  id, title, hint, defaultOpen = false, children,
}: { id: string; title: string; hint?: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const key = `admin-dash-section:${id}`;
  const [open, setOpen] = useState<boolean>(defaultOpen);
  useEffect(() => {
    const v = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    if (v != null) setOpen(v === "1");
  }, [key]);
  const toggle = () => {
    setOpen((o) => {
      const next = !o;
      if (typeof window !== "undefined") window.localStorage.setItem(key, next ? "1" : "0");
      return next;
    });
  };
  return (
    <section className="space-y-3">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between gap-3 px-1 group"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-sm uppercase tracking-widest font-semibold text-electric-300">{title}</h2>
          {hint && <span className="text-[11px] text-nf-text-muted hidden sm:inline">— {hint}</span>}
        </div>
        <ChevronDown className={cn("h-4 w-4 text-nf-text-muted shrink-0 transition-transform", !open && "-rotate-90")} />
      </button>
      {open && <div className="space-y-4">{children}</div>}
    </section>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ partners: 0, leads: 0, signed: 0, docs: 0, followupsDue: 0 });
  const [followups, setFollowups] = useState<any[]>([]);
  const [todayChecklist, setTodayChecklist] = useState<any[]>([]);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [recentImages, setRecentImages] = useState<any[]>([]);
  const [activity, setActivity] = useState<ActivityRow[]>([]);
  const [recentGen, setRecentGen] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const today = new Date().toISOString();
      const [p, l, s, d, f, cl, pr, ri, ac, rg] = await Promise.all([
        supabase.from("partners").select("id", { count: "exact", head: true }),
        supabase.from("partners").select("id", { count: "exact", head: true }).eq("status", "lead"),
        supabase.from("partners").select("id", { count: "exact", head: true }).eq("status", "signed"),
        supabase.from("documents").select("id", { count: "exact", head: true }),
        supabase.from("partners").select("id, company_name, status, next_followup_at").lte("next_followup_at", today).not("next_followup_at", "is", null).order("next_followup_at").limit(8),
        supabase.from("checklist_items").select("id, title, status, priority").neq("status", "done").order("priority", { ascending: false }).limit(6),
        supabase.from("documents").select("id, title, updated_at").is("ai_review", null).order("updated_at", { ascending: false }).limit(5),
        supabase.from("image_analysis_versions").select("id, document_id, created_at, result").order("created_at", { ascending: false }).limit(5),
        supabase.from("activity_log").select("id, action, entity_type, entity_id, entity_label, created_at").order("created_at", { ascending: false }).limit(12),
        supabase.from("content_generations").select("id, brief, brand_fit_score, created_at").order("created_at", { ascending: false }).limit(4),
      ]);
      setStats({
        partners: p.count ?? 0,
        leads: l.count ?? 0,
        signed: s.count ?? 0,
        docs: d.count ?? 0,
        followupsDue: f.data?.length ?? 0,
      });
      setFollowups(f.data ?? []);
      setTodayChecklist(cl.data ?? []);
      setPendingReviews(pr.data ?? []);
      setRecentImages(ri.data ?? []);
      setActivity((ac.data as any) ?? []);
      setRecentGen(rg.data ?? []);
    })();
  }, []);

  const statCards = [
    { label: "Összes partner", value: stats.partners, icon: Users, to: "/admin/partners" },
    { label: "Új leadek", value: stats.leads, icon: Users, to: "/admin/leads" },
    { label: "Aláírt", value: stats.signed, icon: Users, to: "/admin/partners" },
    { label: "Dokumentumok", value: stats.docs, icon: FileText, to: "/admin/documents" },
  ];

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 10) return "Jó reggelt, Bence!";
    if (h < 14) return "Szia Bence!";
    if (h < 18) return "Hajrá Bence!";
    return "Jó estét, Bence!";
  })();

  return (
    <div className="admin-page">
      <PageHeader
        title={greeting}
        subtitle={new Date().toLocaleDateString("hu-HU", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        helpSlug="dashboard"
      />

      {/* ===== STREAK + GYORS AKCIÓK — motivál és gyorsít ===== */}
      <DailyStreakBar />
      <QuickActionsBar />
      <EveningSummaryCard />


      {/* ===== FÓKUSZ MA — top 3 dolog + mai feladatok + inbox ===== */}
      <section className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DailyFocusCard />
          <TodayTasksCard />
          <InboxZeroCard />
        </div>
        <MissionTracker />
      </section>

      {/* ===== 2. PIPELINE & WAITLIST — alapból csukva mobilon, nyitva desktopon nincs (mindenkinek csukva, hadd nyissa ki ha kell) ===== */}
      <Section id="pipeline" title="Pipeline & waitlist" hint="Funnel, növekedés, outreach egészsége">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <PipelineFunnel />
          <WaitlistGrowth />
          <OutreachHealthCard />
        </div>
        <DailyBriefingCard />
      </Section>

      {/* ===== 3. HETI MUNKA ===== */}
      <Section id="weekly" title="Heti munka" hint="Célok, content sprint, döntések">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <WeeklyGoalsCard />
          <WeeklyContentSprintCard />
          <DecisionsDueCard />
        </div>
      </Section>

      {/* ===== 4. TUDÁS & RIPORTOK ===== */}
      <Section id="insights" title="Tudás & riportok" hint="Trendek, doksik, AI-használat, idő, company health">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <NorthstarCard />
          <TrendDigestCard />
          <DocumentDigestCard />
          <AiUsageCard />
          <CompanyHealthCard />
          <TimeTracker />
        </div>
      </Section>

      {/* ===== 5. GYORS BELÉPÉS ===== */}
      <Section id="quick" title="Gyors belépés" defaultOpen>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link to="/admin/content">
            <Card className="hover:border-electric-300/60 transition-colors h-full border-electric-300/30">
              <CardContent className="p-4">
                <Wand2 className="h-5 w-5 text-electric-300 mb-2" />
                <div className="font-bold text-sm">Content Studio</div>
                <div className="text-[10px] text-nf-text-muted mt-0.5">Minden formátum 1 briefből</div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/admin/brand">
            <Card className="hover:border-electric-300/60 transition-colors h-full">
              <CardContent className="p-4">
                <Palette className="h-5 w-5 text-electric-300 mb-2" />
                <div className="font-bold text-sm">Brand Memory</div>
                <div className="text-[10px] text-nf-text-muted mt-0.5">Hangnem · personák · USP-k</div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/admin/ai">
            <Card className="hover:border-electric-300/60 transition-colors h-full">
              <CardContent className="p-4">
                <Sparkles className="h-5 w-5 text-electric-300 mb-2" />
                <div className="font-bold text-sm">AI asszisztens</div>
                <div className="text-[10px] text-nf-text-muted mt-0.5">Kérdezz, taktikázz</div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/admin/calendar">
            <Card className="hover:border-electric-300/60 transition-colors h-full">
              <CardContent className="p-4">
                <Calendar className="h-5 w-5 text-electric-300 mb-2" />
                <div className="font-bold text-sm">Naptár</div>
                <div className="text-[10px] text-nf-text-muted mt-0.5">Mit, mikor posztolj</div>
              </CardContent>
            </Card>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {statCards.map((c) => (
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
      </Section>

      {/* ===== 6. LISTÁK ===== */}
      <Section id="lists" title="Mai listák" hint="Follow-up, checklist, review, képek">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-electric-300" /> Mai / elmaradt follow-up
                {followups.length > 0 && <span className="ml-auto text-xs text-electric-300">{followups.length}</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {followups.length === 0 && <div className="text-nf-text-muted text-sm">Nincs esedékes follow-up. 🎉</div>}
              {followups.map((f) => (
                <Link key={f.id} to={`/admin/partners/${f.id}`} className="flex items-center justify-between p-2.5 rounded-lg bg-nf-surface-alt hover:bg-nf-surface-alt/70">
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">{f.company_name}</div>
                    <div className="text-xs text-nf-text-muted">{f.status} · {new Date(f.next_followup_at).toLocaleDateString("hu-HU")}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-electric-300 shrink-0" />
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ListChecks className="h-4 w-4 text-electric-300" /> Checklist
                {todayChecklist.length > 0 && <span className="ml-auto text-xs text-electric-300">{todayChecklist.length}</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {todayChecklist.length === 0 && <div className="text-nf-text-muted text-sm">Üres a checklist. <Link to="/admin/checklist" className="text-electric-300 underline">Új feladat</Link></div>}
              {todayChecklist.map((c) => (
                <Link key={c.id} to="/admin/checklist" className="flex items-center justify-between p-2.5 rounded-lg bg-nf-surface-alt hover:bg-nf-surface-alt/70">
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">{c.title}</div>
                    <div className="text-xs text-nf-text-muted">{c.status} · prioritás: {c.priority ?? "—"}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-electric-300 shrink-0" />
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-electric-300" /> Doksik felülvizsgálatra
                {pendingReviews.length > 0 && <span className="ml-auto text-xs text-electric-300">{pendingReviews.length}</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendingReviews.length === 0 && <div className="text-nf-text-muted text-sm">Nincs függő review.</div>}
              {pendingReviews.map((d) => (
                <Link key={d.id} to={`/admin/documents/${d.id}`} className="flex items-center justify-between p-2.5 rounded-lg bg-nf-surface-alt hover:bg-nf-surface-alt/70">
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">{d.title}</div>
                    <div className="text-xs text-nf-text-muted">{new Date(d.updated_at).toLocaleDateString("hu-HU")}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-electric-300 shrink-0" />
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ImageIcon className="h-4 w-4 text-electric-300" /> Friss képelemzések
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentImages.length === 0 && <div className="text-nf-text-muted text-sm">Még nincs.</div>}
              {recentImages.map((r) => (
                <Link key={r.id} to={`/admin/documents/${r.document_id}`} className="flex items-center justify-between p-2.5 rounded-lg bg-nf-surface-alt hover:bg-nf-surface-alt/70">
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">{(r.result as any)?.description?.slice(0, 60) || "Képelemzés"}</div>
                    <div className="text-xs text-nf-text-muted">{new Date(r.created_at).toLocaleString("hu-HU")}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-electric-300 shrink-0" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* ===== 7. AKTIVITÁS ===== */}
      <Section id="activity" title="Aktivitás & friss tartalmak">
        <div className="grid lg:grid-cols-[1fr_320px] gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-4 w-4 text-electric-300" /> Aktivitás
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {activity.length === 0 && <div className="text-nf-text-muted text-sm">Még nincs naplózott esemény.</div>}
              {activity.map((a) => {
                const href = a.entity_id && ENTITY_LINK[a.entity_type]?.(a.entity_id);
                const inner = (
                  <div className="flex items-center justify-between gap-3 py-1.5 px-2 rounded hover:bg-nf-surface-alt">
                    <div className="text-sm truncate">
                      <span className="text-electric-300">{ACTION_LABEL[a.action] ?? a.action}</span>{" "}
                      <span className="text-nf-text-muted text-xs">{a.entity_type}:</span>{" "}
                      <span>{a.entity_label || "—"}</span>
                    </div>
                    <div className="text-[10px] text-nf-text-muted whitespace-nowrap">{new Date(a.created_at).toLocaleString("hu-HU", { dateStyle: "short", timeStyle: "short" })}</div>
                  </div>
                );
                return href ? <Link key={a.id} to={href}>{inner}</Link> : <div key={a.id}>{inner}</div>;
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Wand2 className="h-4 w-4 text-electric-300" /> Friss tartalmak
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentGen.length === 0 && (
                <div className="text-nf-text-muted text-sm">
                  Még nincs. <Link to="/admin/content" className="text-electric-300 underline">Indíts egyet</Link>
                </div>
              )}
              {recentGen.map((g) => (
                <Link key={g.id} to="/admin/content" className="block p-2.5 rounded-lg bg-nf-surface-alt hover:bg-nf-surface-alt/70">
                  <div className="text-sm font-medium line-clamp-2">{g.brief}</div>
                  <div className="text-[10px] text-nf-text-muted mt-1 flex items-center gap-2">
                    <span>{new Date(g.created_at).toLocaleDateString("hu-HU")}</span>
                    {g.brand_fit_score != null && <span className="text-electric-300">brand-fit: {g.brand_fit_score}</span>}
                  </div>
                </Link>
              ))}
              <Link to="/admin/content">
                <Button variant="neon" size="sm" className="w-full mt-2">Új tartalom generálás</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Section>
    </div>
  );
}
