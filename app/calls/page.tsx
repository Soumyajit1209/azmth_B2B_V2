"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { CallInterface } from "@/components/calls/call-interface"
import { CallHistory } from "@/components/calls/call-history"
import { CallStats } from "@/components/calls/call-stats"
import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"

export default function CallsPage() {
  const [isDialPadOpen, setIsDialPadOpen] = useState(false)

  return (
    <DashboardShell>
      <DashboardHeader heading="Calls" text="Manage and monitor customer calls with AI assistance.">
        <Button className="flex items-center gap-2" onClick={() => setIsDialPadOpen(true)}>
          <Phone className="h-4 w-4" />
          <span>New Call</span>
        </Button>
      </DashboardHeader>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <CallHistory />
        </div>
        <div className="md:col-span-2">
          <CallInterface isDialPadOpen={isDialPadOpen} setIsDialPadOpen={setIsDialPadOpen} />
          <div className="mt-4">
            <CallStats />
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
