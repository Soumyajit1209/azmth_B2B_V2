import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AnalyticsCharts } from "@/components/analytics/analytics-charts"
import { AnalyticsFilters } from "@/components/analytics/analytics-filters"
import { AnalyticsSummary } from "@/components/analytics/analytics-summary"

export const metadata: Metadata = {
  title: "Analytics - azmth CRM",
  description: "azmth CRM is a powerful and user-friendly customer relationship management tool designed to help businesses manage their interactions with customers and streamline their sales processes.",
}

export default function AnalyticsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Analytics" text="Detailed insights and reports about your business performance." />
      <AnalyticsFilters />
      <AnalyticsSummary />
      <AnalyticsCharts />
    </DashboardShell>
  )
}
