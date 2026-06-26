import { useState } from "react";
import { Sun, Zap, Moon } from "lucide-react";
import { DailyBriefingCard } from "./DailyBriefingCard";
import TodayTasksCard from "./TodayTasksCard";
import EveningSummaryCard from "./EveningSummaryCard";
import DailyStreakBar from "./DailyStreakBar";
import SurfaceCard from "@/components/admin/ui/SurfaceCard";
import SegmentedControl from "@/components/admin/ui/SegmentedControl";

const TABS = [
  { id: "now", label: "Most", icon: Zap },
  { id: "morning", label: "Reggel", icon: Sun },
  { id: "evening", label: "Este", icon: Moon },
] as const;

type TabId = (typeof TABS)[number]["id"];

function pickDefault(): TabId {
  const h = new Date().getHours();
  if (h < 10) return "morning";
  if (h >= 18) return "evening";
  return "now";
}

const TODAY_LABEL = new Date().toLocaleDateString("hu-HU", { weekday: "long", month: "long", day: "numeric" });

export default function TodayCard() {
  const [tab, setTab] = useState<TabId>(pickDefault());

  return (
    <SurfaceCard
      tone="accent"
      icon={<Zap className="h-4 w-4" />}
      title="Mai nap"
      subtitle={TODAY_LABEL}
      action={
        <SegmentedControl
          options={TABS as any}
          value={tab}
          onChange={(v) => setTab(v as TabId)}
        />
      }
    >
      <div className="space-y-4">
        {tab === "now" && (
          <>
            <DailyStreakBar />
            <TodayTasksCard />
          </>
        )}
        {tab === "morning" && <DailyBriefingCard />}
        {tab === "evening" && <EveningSummaryCard />}
      </div>
    </SurfaceCard>
  );
}
