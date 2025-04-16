"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Bot, Clock } from "lucide-react"

interface Call {
  id: string
  customerId?: string
  customerName?: string
  phoneNumber?: string
  date: string
  duration: number
  status: string
  type: string
  aiAssisted: boolean
}

export function CallHistory() {
  const [calls, setCalls] = useState<Call[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response = await fetch("/api/calls")
        const data = await response.json()
        setCalls(data.calls)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching calls:", error)
        setIsLoading(false)
      }
    }

    fetchCalls()
  }, [])

  // Add a new call to history (would be triggered by events in a real app)
  const addCallToHistory = (call: Call) => {
    setCalls((prev) => [call, ...prev])
  }

  // Listen for custom events (simulating real-time updates)
  useEffect(() => {
    // Simulate a new outgoing call after 5 seconds
    const timer = setTimeout(() => {
      addCallToHistory({
        id: "call_" + Math.random().toString(36).substring(2, 9),
        phoneNumber: "+1 (555) 987-6543",
        date: new Date().toISOString(),
        duration: 124,
        status: "completed",
        type: "outbound",
        aiAssisted: true,
      })
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  // Format duration as mm:ss
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Call History</CardTitle>
        <Button variant="ghost" size="sm" className="gap-1">
          <Clock className="h-4 w-4" />
          <span className="text-xs">Recent</span>
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {calls.map((call) => (
                <div
                  key={call.id}
                  className="flex items-center justify-between space-x-4 rounded-md border p-3 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      {call.type === "inbound" ? (
                        call.status === "missed" ? (
                          <PhoneMissed className="h-4 w-4 text-destructive" />
                        ) : (
                          <PhoneIncoming className="h-4 w-4 text-primary" />
                        )
                      ) : (
                        <PhoneOutgoing className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{call.customerName || call.phoneNumber || "Unknown"}</div>
                      <div className="text-sm text-muted-foreground">{formatDate(call.date)}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {call.aiAssisted && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Bot className="h-3 w-3" />
                        <span>AI</span>
                      </Badge>
                    )}
                    <Badge variant="secondary">{formatDuration(call.duration)}</Badge>
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
