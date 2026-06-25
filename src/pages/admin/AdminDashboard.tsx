import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Users, FileText, ArrowRight, Activity,
  ListChecks, Clock, ChevronDown, Target, TrendingUp, BarChart3,
} from "lucide-react";
import PageSectionNav from "@/components/admin/PageSectionNav";
import TodayCard from "@/components/admin/dashboard/TodayCard";
import PipelinePulseCard from "@/components/admin/dashboard/PipelinePulseCard";
import WeekCard from "@/components/admin/dashboard/WeekCard";
import InboxZeroCard from "@/components/admin/dashboard/InboxZeroCard";
import QuickActionsBar from "@/components/admin/dashboard/QuickActionsBar";
import PageHeader from "@/components/admin/PageHeader";
import SurfaceCard from "@/components/admin/ui/SurfaceCard";
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

/** Collapsible szekció — alapból zárva. */
function Section({
  id, title, hint, badge, defaultOpen = false, children,
}: { id: string; title: string; hint?: string; badge?: string | number | null; defaultOpen?: boolean; children: React.ReactNode }) {
  const key = `admin-dash-section:${id}`;
  const [open, setOpen] = useState<boolean>(defaultOpen);
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const v = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    if (v != null) setOpen(v === "1");
  }, [key]);
  useEffect(() => {
    const onJump = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.id === id) {
        setOpen(true); setPulse(true);
        window.setTimeout(() => setPulse(false), 750);
      }
    };
    window.addEventListener("admin-section-open", onJump);
    return () => window.removeEventListener("admin-section-open", onJump);
  }, [id]);
  const toggle = () => {
    setOpen((o) => {
      const next = !o;
      if (typeof window !== "undefined") window.localStorage.setItem(key, next ? "1" : "0");
      return next;
    });
  };
  const hasBadge = badge != null && badge !== 0 && badge !== "";
  return (
    <section id={id} className={cn("space-y-3 scroll-mt-20", pulse && "admin-section-pulse")}>
      <button onClick={toggle} className="w-full flex items-center justify-between gap-3 px-1 group" aria-expanded={open}>
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="admin-display text-[11px] uppercase tracking-[0.18em] font-semibold text-white/40 group-hover:text-white/70 transition-colors">{title}</h2>
          {hasBadge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-electric-300/15 text-electric-300 border border-electric-300/30">
              {badge}
            </span>
          )}
          {hint && <span className="text-[11px] text-white/30 hidden sm:inline">— {hint}</span>}
        </div>
        <ChevronDown className={cn("h-3.5 w-3.5 text-white/30 shrink-0 transition-transform", !open && "-rotate-90")} />
      </button>
      {open && <div className="space-y-4">{children}</div>}
    </section>
  );
}

function ListBlock({
  title, icon: Icon, items, empty, renderItem,
}: {
  title: string;
  icon: typeof Clock;
  items: any[];
  empty: React.ReactNode;
  renderItem: (it: any) => React.ReactNode;
}) {
  return (
    <SurfaceCard
      tone="base"
      icon={<Icon className="h-4 w-4" />}
      title={title}
      action={items.length > 0 ? <span className="text-xs text-electric-300 font-medium">{items.length}</span> : null}
    >
      <div className="space-y-1.5">
        {items.length === 0 ? (
          <div className="text-xs text-white/40 py-2">{empty}</div>
        ) : (
          items.map(renderItem)
        )}
      </div>
    </SurfaceCard>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ partners: 0, leads: 0, signed: 0, docs: 0, followupsDue: 0 });
  const [followups, setFollowups] = useState<any[]>([]);
  const [todayChecklist, setTodayChecklist] = useState<any[]>([]);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [activity, setActivity] = useState<ActivityRow[]>([]);

  useEffect(() => {
    (async () => {
      const today = new Date().toISOString();
      const [p, l, s, d, f, cl, pr, ac] = await Promise.all([
        supabase.from("partners").select("id", { count: "exact", head: true }),
        supabase.from("partners").select("id", { count: "exact", head: true }).eq("status", "lead"),
        supabase.from("partners").select("id", { count: "exact", head: true }).eq("status", "signed"),
        supabase.from("documents").select("id", { count: "exact", head: true }),
        supabase.from("partners").select("id, company_name, status, next_followup_at").lte("next_followup_at", today).not("next_followup_at", "is", null).order("next_followup_at").limit(8),
        supabase.from("checklist_items").select("id, title, status, priority").neq("status", "done").order("priority", { ascending: false }).limit(6),
        supabase.from("documents").select("id, title, updated_at").is("ai_review", null).order("updated_at", { ascending: false }).limit(5),
        supabase.from("activity_log").select("id, action, entity_type, entity_id, entity_label, created_at").order("created_at", { ascending: false }).limit(12),
      ]);
      setStats({
        partners: p.count ?? 0, leads: l.count ?? 0, signed: s.count ?? 0,
        docs: d.count ?? 0, followupsDue: f.data?.length ?? 0,
      });
      setFollowups(f.data ?? []);
      setTodayChecklist(cl.data ?? []);
      setPendingReviews(pr.data ?? []);
      setActivity((ac.data as any) ?? []);
    })();
  }, []);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 10) return "Jó reggelt, Bence!";
    if (h < 14) return "Szia Bence!";
    if (h < 18) return "Hajrá Bence!";
    return "Jó estét, Bence!";
  })();

  const sectionNav = [
    { id: "focus", label: "Ma", icon: Target },
    { id: "pipeline", label: "Pipeline", icon: TrendingUp },
    { id: "week", label: "Hét", icon: ListChecks },
    { id: "lists", label: "Listák", icon: Clock },
    { id: "activity", label: "Aktivitás", icon: Activity },
  ];

  const statCards = [
    { label: "Partner", value: stats.partners, icon: Users, to: "/admin/partners" },
    { label: "Új lead", value: stats.leads, icon: Target, to: "/admin/leads" },
    { label: "Aláírt", value: stats.signed, icon: Users, to: "/admin/partners" },
    { label: "Doksi", value: stats.docs, icon: FileText, to: "/admin/documents" },
  ];

  return (
    <div className="admin-page">
      <PageSectionNav sections={sectionNav} />

      <PageHeader
        title={greeting}
        subtitle={new Date().toLocaleDateString("hu-HU", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        helpSlug="dashboard"
      />

      {/* ===== FOLD-ABOVE: 2 oszlop, bal a fókusz, jobb az inbox + gyors akciók ===== */}
      <section id="focus" className="scroll-mt-20">
        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <TodayCard />
          <div className="space-y-4">
            <InboxZeroCard />
            <QuickActionsBar />
          </div>
        </div>
      </section>

      {/* ===== PIPELINE PULSE ===== */}
      <Section
        id="pipeline"
        title="Pipeline"
        hint="Funnel, akadt leadek, outreach"
        badge={stats.leads > 0 ? `${stats.leads} új lead` : null}
        defaultOpen
      >
        <PipelinePulseCard />
        <Link to="/admin/reports" className="inline-flex items-center gap-1.5 text-xs text-electric-300 hover:underline">
          <BarChart3 className="h-3.5 w-3.5" /> Részletes riportok
        </Link>
      </Section>

      {/* ===== HETI MUNKA ===== */}
      <Section
        id="week"
        title="Heti munka"
        hint="Célok, content sprint, döntések"
        badge={todayChecklist.length > 0 ? `${todayChecklist.length} feladat` : null}
      >
        <WeekCard />
      </Section>

      {/* ===== LISTÁK ===== */}
      <Section id="lists" title="Mai listák" hint="Follow-up, checklist, review" badge={stats.followupsDue > 0 ? `${stats.followupsDue} esedékes` : null}>
        <div className="grid gap-4 md:grid-cols-3">
          <ListBlock
            title="Follow-up"
            icon={Clock}
            items={followups}
            empty="Nincs esedékes follow-up. 🎉"
            renderItem={(f) => (
              <Link key={f.id} to={`/admin/partners/${f.id}`} className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-white/[0.03] transition-colors">
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate text-white/85">{f.company_name}</div>
                  <div className="text-[11px] text-white/40">{f.status} · {new Date(f.next_followup_at).toLocaleDateString("hu-HU")}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-electric-300 transition-colors shrink-0" />
              </Link>
            )}
          />
          <ListBlock
            title="Checklist"
            icon={ListChecks}
            items={todayChecklist}
            empty={<>Üres. <Link to="/admin/checklist" className="text-electric-300 underline">Új feladat</Link></>}
            renderItem={(c) => (
              <Link key={c.id} to="/admin/checklist" className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-white/[0.03] transition-colors">
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate text-white/85">{c.title}</div>
                  <div className="text-[11px] text-white/40">{c.status} · prio: {c.priority ?? "—"}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-electric-300 transition-colors shrink-0" />
              </Link>
            )}
          />
          <ListBlock
            title="Doksi review"
            icon={FileText}
            items={pendingReviews}
            empty="Nincs függő review."
            renderItem={(d) => (
              <Link key={d.id} to={`/admin/documents/${d.id}`} className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-white/[0.03] transition-colors">
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate text-white/85">{d.title}</div>
                  <div className="text-[11px] text-white/40">{new Date(d.updated_at).toLocaleDateString("hu-HU")}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-electric-300 transition-colors shrink-0" />
              </Link>
            )}
          />
        </div>
      </Section>

      {/* ===== AKTIVITÁS ===== */}
      <Section id="activity" title="Aktivitás">
        <SurfaceCard tone="base" icon={<Activity className="h-4 w-4" />} title="Friss események">
          <div className="space-y-0.5">
            {activity.length === 0 && <div className="text-xs text-white/40">Még nincs naplózott esemény.</div>}
            {activity.map((a) => {
              const href = a.entity_id && ENTITY_LINK[a.entity_type]?.(a.entity_id);
              const inner = (
                <div className="flex items-center justify-between gap-3 py-1.5 px-2 -mx-1 rounded hover:bg-white/[0.03] transition-colors">
                  <div className="text-sm truncate text-white/80">
                    <span className="text-electric-300">{ACTION_LABEL[a.action] ?? a.action}</span>{" "}
                    <span className="text-white/40 text-xs">{a.entity_type}:</span>{" "}
                    <span>{a.entity_label || "—"}</span>
                  </div>
                  <div className="text-[10px] text-white/35 whitespace-nowrap tabular-nums">{new Date(a.created_at).toLocaleString("hu-HU", { dateStyle: "short", timeStyle: "short" })}</div>
                </div>
              );
              return href ? <Link key={a.id} to={href}>{inner}</Link> : <div key={a.id}>{inner}</div>;
            })}
          </div>
        </SurfaceCard>
      </Section>

      {/* Statisztika footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map((c) => (
          <Link key={c.label} to={c.to}>
            <SurfaceCard tone="base" padded={false} className="p-4 h-full hover:border-electric-300/30 transition-colors">
              <c.icon className="h-4 w-4 text-electric-300 mb-2" />
              <div className="text-2xl font-bold tabular-nums text-white">{c.value}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider mt-1">{c.label}</div>
            </SurfaceCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
