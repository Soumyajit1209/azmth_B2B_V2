import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { OverviewStats } from "@/components/dashboard/overview-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { UpcomingCalls } from "@/components/dashboard/upcoming-calls"

export const metadata: Metadata = {
  title: "Dashboard-azmth CRM",
  description: "azmth CRM is a powerful and user-friendly customer relationship management tool designed to help businesses manage their interactions with customers and streamline their sales processes.",
  
}


export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Overview of your business performance and activities." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OverviewStats />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
        <div className="col-span-2">
          <SalesChart />
        </div>
        <div>
          <UpcomingCalls />
        </div>
      </div>
      <div className="mt-4">
        <RecentActivity />
      </div>
    </DashboardShell>
  )
}
