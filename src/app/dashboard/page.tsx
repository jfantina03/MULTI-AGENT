import { AppLayout } from "@/components/layout/AppLayout";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { ActivityOverview } from "@/components/dashboard/ActivityOverview";
import { NewRequestCard } from "@/components/dashboard/NewRequestCard";
import { RecentDocuments } from "@/components/dashboard/RecentDocuments";
import { PriorityTasks } from "@/components/dashboard/PriorityTasks";
import { AgentShortcuts } from "@/components/dashboard/AgentShortcuts";
import { CalendarWidget } from "@/components/dashboard/CalendarWidget";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-5">
        {/* Welcome + stats */}
        <WelcomeCard />

        {/* KPI row */}
        <ActivityOverview />

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Left column — 2/3 */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            <NewRequestCard />
            <RecentDocuments />
            <PriorityTasks />
          </div>

          {/* Right column — 1/3 */}
          <div className="flex flex-col gap-5">
            <AgentShortcuts />
            <CalendarWidget />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
