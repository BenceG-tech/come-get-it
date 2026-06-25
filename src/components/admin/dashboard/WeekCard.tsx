import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Wand2, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { WeeklyGoalsCard } from "./WeeklyGoalsCard";
import { WeeklyContentSprintCard } from "./WeeklyContentSprintCard";
import DecisionsDueCard from "./DecisionsDueCard";

const TABS = [
  { id: "goals", label: "Célok", icon: Target },
  { id: "content", label: "Content", icon: Wand2 },
  { id: "decisions", label: "Döntések", icon: Brain },
] as const;

/** Heti munka egy kártyában — célok, content sprint, esedékes döntések. */
export default function WeekCard() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("goals");

  return (
    <Card>
      <div className="flex items-center gap-1 p-2 border-b border-nf-border bg-nf-surface-alt/40">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
              tab === t.id
                ? "bg-electric-300/15 text-electric-300"
                : "text-nf-text-muted hover:text-foreground"
            )}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
      </div>
      <CardContent className="p-4">
        {tab === "goals" && <WeeklyGoalsCard />}
        {tab === "content" && <WeeklyContentSprintCard />}
        {tab === "decisions" && <DecisionsDueCard />}
      </CardContent>
    </Card>
  );
}
