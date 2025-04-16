import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { CalendarView } from "@/components/calendar/calendar-view"
import { VoiceCommands } from "@/components/calendar/voice-commands"

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
