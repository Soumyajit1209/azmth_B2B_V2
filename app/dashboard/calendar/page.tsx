
import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { CalendarView } from "@/components/calendar/calendar-view"
import { VoiceCommands } from "@/components/calendar/voice-commands"

export const metadata: Metadata = {
  title: "Calendar - azmth CRM",
  description: "azmth CRM is a powerful and user-friendly customer relationship management tool designed to help businesses manage their interactions with customers and streamline their sales processes.",
}

export default function CalendarPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Calendar" text="Manage your schedule and appointments with voice commands." />
      <div className="flex flex-col gap-4">
        <VoiceCommands />
        <CalendarView />
      </div>
    </DashboardShell>
  )
}
