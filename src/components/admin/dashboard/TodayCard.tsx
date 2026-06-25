import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sun, Zap, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import DailyBriefingCard from "./DailyBriefingCard";
import TodayTasksCard from "./TodayTasksCard";
import EveningSummaryCard from "./EveningSummaryCard";
import DailyStreakBar from "./DailyStreakBar";

/**
 * Egy kártya, 3 fül: Reggel (briefing) · Most (mai 3 feladat + streak) · Este (összegzés).
 * Alapból az aktuális napszakot nyitja.
 */
const TABS = [
  { id: "now", label: "Most", icon: Zap },
  { id: "morning", label: "Reggel", icon: Sun },
  { id: "evening", label: "Este", icon: Moon },
] as const;

function pickDefault(): (typeof TABS)[number]["id"] {
  const h = new Date().getHours();
  if (h < 10) return "morning";
  if (h >= 18) return "evening";
  return "now";
}

export default function TodayCard() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>(pickDefault());

  return (
    <Card className="border-electric-300/30">
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
      <CardContent className="p-4 space-y-3">
        {tab === "now" && (
          <>
            <DailyStreakBar />
            <TodayTasksCard />
          </>
        )}
        {tab === "morning" && <DailyBriefingCard />}
        {tab === "evening" && <EveningSummaryCard />}
      </CardContent>
    </Card>
  );
}
