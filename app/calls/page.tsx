"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { CallInterface } from "@/components/calls/call-interface"
import { CallStats } from "@/components/calls/call-stats"
import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"
import TwilioConfigModal from "@/components/TwilioConfig"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@clerk/nextjs"
import { Skeleton } from "@/components/ui/skeleton"
import { CallHistory } from "@/components/calls/call-history"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import CallCampaignModal from "./CallCampaignModal"

export default function CallsPage() {
  const [hasTwilioConfig, setHasTwilioConfig] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [twilioConfigData, setTwilioConfigData] = useState(null)
  const [assistantId, setAssistantId] = useState(null)
  const [configChecked, setConfigChecked] = useState(false)
  const [refreshHistory, setRefreshHistory] = useState(false)
  const [callHistory, setCallHistory] = useState([])
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false)
  const { toast } = useToast()
  const { user, isLoaded: isUserLoaded } = useUser()
  const userId = user?.id
  
  // Create a ref to access the CallInterface methods
  const callInterfaceRef = useRef<{ addNewContactForm: () => void } | null>(null)

  // Check if user has Twilio configuration
  useEffect(() => {
    const checkTwilioConfig = async () => {
      if (!userId || !isUserLoaded) return

      try {
        setIsLoading(true)
        const response = await fetch("/api/twilio-config", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-clerk-user-id": userId,
          },
          cache: "no-store",
        })

        if (response.ok) {
          const data = await response.json()
          if (data.twilioConfig) {
            setHasTwilioConfig(true)
            setTwilioConfigData(data.twilioConfig)
            setAssistantId(data.assistantId)
            console.log("Twilio config found:", data.twilioConfig)
            console.log("Assistant ID found:", data.assistantId)
          } else {
            setHasTwilioConfig(false)
          }
        } else {
          console.error("Failed to fetch Twilio config:", await response.text())
          setHasTwilioConfig(false)
        }
      } catch (error) {
        console.error("Error checking Twilio configuration:", error)
        setHasTwilioConfig(false)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId && isUserLoaded) {
      checkTwilioConfig()
    }
  }, [userId, isUserLoaded])

  const handleNewCallClick = () => {
    if (!hasTwilioConfig) {
      toast({
        title: "Twilio not configured",
        description: "Please configure your Twilio account first",
        variant: "destructive",
      })
      return
    }
    
    // Instead of incrementing a counter, call the addNewContactForm method directly
    callInterfaceRef.current?.addNewContactForm()
  }

  const handleConfigUpdate = () => {
    setHasTwilioConfig(true)
  }

  // Modified to match the expected type signature in CallInterface component
  const handleCallStatusChange = useCallback((callId: string, status: string) => {
    console.log(`Call ${callId} status changed to ${status}`)
    
    // Trigger call history refresh when a call is completed or ended
    if (status === "completed" || status === "ended" || status === "no-answer" || status === "failed") {
      setRefreshHistory(prev => !prev)
    }
  }, [])

  // Loading skeleton components
  const HeaderSkeleton = () => (
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  )

  const CallHistorySkeleton = () => (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  )

  const CallInterfaceSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-64 w-full" />
      <div className="mt-4">
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  )

  useEffect(() => {
    // This effect ensures that the Twilio config state persists across page navigation
    if (hasTwilioConfig && twilioConfigData) {
      localStorage.setItem('hasTwilioConfig', 'true')
      localStorage.setItem('twilioConfigData', JSON.stringify(twilioConfigData))
      if (assistantId) {
        localStorage.setItem('assistantId', assistantId)
      }
    }
  }, [hasTwilioConfig, twilioConfigData, assistantId])

  useEffect(() => {
    // Check localStorage for cached Twilio config on initial load
    if (!configChecked && isUserLoaded) {
      const cachedHasConfig = localStorage.getItem('hasTwilioConfig') === 'true'
      const cachedConfigData = localStorage.getItem('twilioConfigData')
      
      if (cachedHasConfig && cachedConfigData) {
        try {
          const parsedData = JSON.parse(cachedConfigData)
          setHasTwilioConfig(true)
          setTwilioConfigData(parsedData)
        } catch (e) {
          console.error("Error parsing cached Twilio config:", e)
        }
      }
      
      setConfigChecked(true)
    }
  }, [isUserLoaded, configChecked])

  if (!isUserLoaded || isLoading) {
    return (
      <DashboardShell>
        <HeaderSkeleton />
        <div className="grid gap-4 md:grid-cols-3 mt-6">
          <div className="md:col-span-1">
            <CallHistorySkeleton />
          </div>
          <div className="md:col-span-2">
            <CallInterfaceSkeleton />
          </div>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Calls" text="Manage and monitor customer calls with AI assistance.">
        <div className="flex items-center gap-2">
          <Button 
            className="flex items-center gap-2" 
            onClick={() => setIsCampaignModalOpen(true)}
          >
            <span>Call Campaign</span>
          </Button>
          <Button 
            className="flex items-center gap-2" 
            onClick={handleNewCallClick}
            disabled={!hasTwilioConfig}
          >
            <Phone className="h-4 w-4" />
            <span>New Call</span>
          </Button>
          <TwilioConfigModal onConfigUpdate={handleConfigUpdate} initialData={twilioConfigData} />
        </div>
      </DashboardHeader>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <CallHistory key={`history-${refreshHistory}`} />
        </div>
        <div className="md:col-span-2">
          <CallInterface 
            ref={callInterfaceRef}
            isDialPadOpen={false}
            setIsDialPadOpen={() => {}}
            onCallStatusChange={handleCallStatusChange}
          />
          <div className="mt-4">
            <CallStats />
          </div>
        </div>
      </div>

      {/* Call Campaign Modal */}
      <Dialog open={isCampaignModalOpen} onOpenChange={setIsCampaignModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Call Campaign</DialogTitle>
          </DialogHeader>
          <CallCampaignModal />
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}