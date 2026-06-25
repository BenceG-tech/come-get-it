import { PipelineFunnel } from "./PipelineFunnel";
import { StalledLeadsCard } from "./StalledLeadsCard";
import OutreachHealthCard from "./OutreachHealthCard";

/**
 * Egy modul, ami a sales-pulzust összefogja: funnel + akadt leadek + outreach egészség.
 * A részletes konverziós tölcsér a /admin/reports oldalra került.
 */
export default function PipelinePulseCard() {
  return (
    <div className="space-y-3">
      <PipelineFunnel />
      <div className="grid gap-3 md:grid-cols-2">
        <StalledLeadsCard />
        <OutreachHealthCard />
      </div>
    </div>
  );
}
