import PageHeader from "@/components/admin/PageHeader";
import NorthstarCard from "@/components/admin/dashboard/NorthstarCard";
import CompanyHealthCard from "@/components/admin/dashboard/CompanyHealthCard";
import AiUsageCard from "@/components/admin/dashboard/AiUsageCard";
import { TimeTracker } from "@/components/admin/dashboard/TimeTracker";
import TrendDigestCard from "@/components/admin/dashboard/TrendDigestCard";
import { WaitlistGrowth } from "@/components/admin/dashboard/WaitlistGrowth";
import { ConversionFunnel } from "@/components/admin/dashboard/ConversionFunnel";
import DocumentDigestCard from "@/components/admin/dashboard/DocumentDigestCard";

/**
 * Riportok — minden, ami másodlagos KPI/insight.
 * Korábban a Dashboard "Tudás & riportok" szekciójában laktak.
 */
export default function AdminReports() {
  return (
    <div className="admin-page">
      <PageHeader
        title="Riportok"
        subtitle="Northstar, company health, waitlist, AI használat, idő, trendek"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <NorthstarCard />
        <CompanyHealthCard />
        <WaitlistGrowth />
        <ConversionFunnel />
        <TrendDigestCard />
        <DocumentDigestCard />
        <AiUsageCard />
        <TimeTracker />
      </div>
    </div>
  );
}
