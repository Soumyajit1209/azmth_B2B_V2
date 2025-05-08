"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { CallInterface } from "@/components/calls/call-interface"
import CallHistoryPage from "@/components/calls/call-history"
import { CallStats } from "@/components/calls/call-stats"
import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"
import TwilioConfigModal from "@/components/TwilioConfig"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@clerk/nextjs"

export default function CallsPage() {
  const [isDialPadOpen, setIsDialPadOpen] = useState(false)
  const [hasTwilioConfig, setHasTwilioConfig] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useUser()
  const userId = user?.id

  // Check if user has Twilio configuration
  useEffect(() => {
    const checkTwilioConfig = async () => {
      if (!userId) return

      try {
        setIsLoading(true)
        const response = await fetch("/api/twilio-config", {
          method: "GET",
          headers: {
            ...(userId && { "x-clerk-user-id": userId }),
          },
        })

        if (response.ok) {
          const data = await response.json()
          setHasTwilioConfig(!!data.twilioConfig)
        } else {
          setHasTwilioConfig(false)
        }
      } catch (error) {
        console.error("Error checking Twilio configuration:", error)
        setHasTwilioConfig(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkTwilioConfig()
  }, [userId])

  const handleNewCallClick = () => {
    if (!hasTwilioConfig) {
      toast({
        title: "Twilio not configured",
        description: "Please configure your Twilio account first",
        variant: "destructive",
      })
      return
    }
    
    setIsDialPadOpen(true)
  }

  const handleConfigUpdate = () => {
    setHasTwilioConfig(true)
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Calls" text="Manage and monitor customer calls with AI assistance.">
        <div className="flex items-center gap-2">
          <Button 
            className="flex items-center gap-2" 
            onClick={handleNewCallClick}
            disabled={isLoading || !hasTwilioConfig}
          >
            <Phone className="h-4 w-4" />
            <span>New Call</span>
          </Button>
          <TwilioConfigModal onConfigUpdate={handleConfigUpdate} />
        </div>
      </DashboardHeader>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <CallHistoryPage />
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