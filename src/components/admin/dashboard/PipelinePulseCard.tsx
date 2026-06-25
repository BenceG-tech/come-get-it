import { PipelineFunnel } from "./PipelineFunnel";
import { StalledLeadsCard } from "./StalledLeadsCard";
import OutreachHealthCard from "./OutreachHealthCard";
import SurfaceCard from "@/components/admin/ui/SurfaceCard";
import { TrendingUp } from "lucide-react";

export default function PipelinePulseCard() {
  return (
    <SurfaceCard
      tone="base"
      icon={<TrendingUp className="h-4 w-4" />}
      title="Pipeline pulzus"
      subtitle="Funnel, akadt leadek, outreach egészség"
    >
      <div className="space-y-3">
        <PipelineFunnel />
        <div className="grid gap-3 md:grid-cols-2">
          <StalledLeadsCard />
          <OutreachHealthCard />
        </div>
      </div>
    </SurfaceCard>
  );
}
