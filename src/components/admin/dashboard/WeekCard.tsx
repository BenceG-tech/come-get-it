import { useState } from "react";
import { Target, Wand2, Brain, ListChecks } from "lucide-react";
import { WeeklyGoalsCard } from "./WeeklyGoalsCard";
import { WeeklyContentSprintCard } from "./WeeklyContentSprintCard";
import DecisionsDueCard from "./DecisionsDueCard";
import SurfaceCard from "@/components/admin/ui/SurfaceCard";
import SegmentedControl from "@/components/admin/ui/SegmentedControl";

const TABS = [
  { id: "goals", label: "Célok", icon: Target },
  { id: "content", label: "Content", icon: Wand2 },
  { id: "decisions", label: "Döntések", icon: Brain },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function WeekCard() {
  const [tab, setTab] = useState<TabId>("goals");

  return (
    <SurfaceCard
      tone="base"
      icon={<ListChecks className="h-4 w-4" />}
      title="Heti munka"
      subtitle="Célok, content sprint, döntések"
      action={<SegmentedControl options={TABS as any} value={tab} onChange={(v) => setTab(v as TabId)} />}
    >
      <div>
        {tab === "goals" && <WeeklyGoalsCard />}
        {tab === "content" && <WeeklyContentSprintCard />}
        {tab === "decisions" && <DecisionsDueCard />}
      </div>
    </SurfaceCard>
  );
}
