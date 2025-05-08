"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { DialPad } from "@/components/calls/dial-pad"
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PauseCircle,
  MoreVertical,
  KeyboardIcon as Keypad,
  UserPlus,
} from "lucide-react"
import { cn } from "@/lib/utils"

enum CallState {
  IDLE = "idle",
  DIALING = "dialing",
  CONNECTING = "connecting",
  ACTIVE = "active",
  ENDED = "ended",
}

interface Contact {
  id: string
  name: string
  number: string
  avatar?: string
}

interface CallInterfaceProps {
  isDialPadOpen: boolean
  setIsDialPadOpen: (isOpen: boolean) => void
}

export function CallInterface({ isDialPadOpen, setIsDialPadOpen }: CallInterfaceProps) {
  // Get Clerk user data
  const { user } = useUser()

  const [callState, setCallState] = useState<CallState>(CallState.IDLE)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const [isHolding, setIsHolding] = useState(false)
  const [showDialpad, setShowDialpad] = useState(false)
  const [currentContact, setCurrentContact] = useState<Contact | null>(null)
  const [callId, setCallId] = useState<string | null>(null)
  const [isOfflineMode, setIsOfflineMode] = useState(false)

  // Handle call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined

    if (callState === CallState.ACTIVE && !isHolding) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [callState, isHolding])

  // Handle call status checking
  useEffect(() => {
    let statusCheckInterval: NodeJS.Timeout | undefined

    if (callId && callState === CallState.ACTIVE) {
      // Check call status every 5 seconds
      statusCheckInterval = setInterval(async () => {
        try {
          const response = await fetch(`/api/call-status?callId=${callId}`)
          const data = await response.json()
          
          if (data.status === "completed" || data.status === "failed" || data.status === "no-answer") {
            setCallState(CallState.ENDED)
            
            setTimeout(() => {
              resetCallState()
            }, 2000)
            
            if (statusCheckInterval) clearInterval(statusCheckInterval)
          }
        } catch (error) {
          console.error("Error checking call status:", error)
        }
      }, 5000)
    }

    return () => {
      if (statusCheckInterval) clearInterval(statusCheckInterval)
    }
  }, [callId, callState])

  const initiateCall = async (phoneNumber: string, contactName: string) => {
    // Create contact info
    const contact: Contact = {
      id: Date.now().toString(),
      name: contactName || `Caller (${phoneNumber})`,
      number: phoneNumber,
    }

    // Set current contact
    setCurrentContact(contact)

    // Update call state
    setCallState(CallState.DIALING)
    setCallDuration(0)

    try {
      // Call your API endpoint
      const response = await fetch('/api/create-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contacts: [
            {
              number: phoneNumber,
              name: contactName || `Caller (${phoneNumber})`,
            }
          ]
        }),
      })

      const data = await response.json()

      if (response.ok && data.callId) {
        console.log("Call initiated successfully:", data)
        setCallId(data.callId)
        setIsOfflineMode(false)
        
        // Update call state to connecting
        setCallState(CallState.CONNECTING)
        
        // Simulate connected after 2 seconds (you could replace this with real status)
        setTimeout(() => {
          setCallState(CallState.ACTIVE)
        }, 2000)
      } else {
        console.warn("API call failed:", data.error || "Unknown error")
        handleFailedCall()
      }
    } catch (error) {
      console.error("Error during call setup:", error)
      handleFailedCall()
    }
  }

  const handleFailedCall = () => {
    setCallState(CallState.ENDED)
    
    // Show error state briefly before resetting
    setTimeout(() => {
      resetCallState()
    }, 2000)
  }

  const endCall = async () => {
    // Update UI state immediately
    setCallState(CallState.ENDED)

    // Only try to notify backend if we have a callId
    if (callId) {
      try {
        // Call your API to end the call
        await fetch('/api/end-call', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            callId: callId
          }),
        })
      } catch (error) {
        console.error("Error ending call:", error)
      }
    }

    // Reset after 2 seconds
    setTimeout(() => {
      resetCallState()
    }, 2000)
  }

  // Reset all call state to initial values
  const resetCallState = () => {
    setCallState(CallState.IDLE)
    setCallDuration(0)
    setCurrentContact(null)
    setIsMuted(false)
    setIsHolding(false)
    setShowDialpad(false)
    setCallId(null)
    setIsOfflineMode(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusText = () => {
    switch (callState) {
      case CallState.DIALING:
        return "Dialing..."
      case CallState.CONNECTING:
        return "Connecting..."
      case CallState.ACTIVE:
        return isHolding ? "On Hold" : formatTime(callDuration)
      case CallState.ENDED:
        return "Call Ended"
      default:
        return ""
    }
  }

  // Render the idle state (no active call)
  if (callState === CallState.IDLE) {
    return (
      <>
        <DialPad
          isOpen={isDialPadOpen}
          onOpenChange={setIsDialPadOpen}
          onCallInitiated={(number, name) => {
            setIsDialPadOpen(false)
            initiateCall(number, name)
          }}
        />
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center text-muted-foreground">
                <Phone className="mx-auto h-12 w-12 mb-4 opacity-20" />
                <p>No active calls</p>
                <p className="text-sm">Click the "New Call" button to start a call</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </>
    )
  }
  
  return (
    <>
      <DialPad
        isOpen={isDialPadOpen}
        onOpenChange={setIsDialPadOpen}
        onCallInitiated={(number, name) => {
          setIsDialPadOpen(false)
          initiateCall(number, name)
        }}
      />
      <Card
        className={cn(
          "overflow-hidden transition-all duration-300",
          callState === CallState.ACTIVE && "bg-gradient-to-b from-primary/5 to-background",
        )}
      >
        <CardContent className="p-0">
          <div className="flex flex-col min-h-[500px]">
            {/* Call header with status */}
            <div className="bg-primary/10 p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "px-3 py-1 text-sm",
                    callState === CallState.ACTIVE && !isHolding && "bg-green-500/20 text-green-500 border-green-500/30",
                    isHolding && "bg-amber-500/20 text-amber-500 border-amber-500/30",
                    callState === CallState.ENDED && "bg-red-500/20 text-red-500 border-red-500/30",
                  )}
                >
                  {getStatusText()}
                </Badge>
                {isOfflineMode && callState === CallState.ACTIVE && (
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-500 border-blue-500/30 px-2 py-1 text-xs">
                    Offline Mode
                  </Badge>
                )}
              </div>
            </div>

            {/* Contact info */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6">
              <Avatar className="h-32 w-32 border-4 border-primary/10">
                <AvatarImage src={currentContact?.avatar || "/placeholder.svg?height=128&width=128"} />
                <AvatarFallback className="text-4xl">{currentContact?.name.charAt(0) || "?"}</AvatarFallback>
              </Avatar>

              <div className="text-center">
                <h2 className="text-2xl font-bold mb-1">{currentContact?.name || "Unknown"}</h2>
                <p className="text-muted-foreground">{currentContact?.number || ""}</p>
              </div>

              {/* Call status badge */}
              {callState === CallState.ACTIVE && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500">
                  Call in progress
                </Badge>
              )}
            </div>

            {/* Call actions */}
            <div className="p-6 bg-primary/5">
              {/* Main call controls */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <Button
                  variant={isMuted ? "destructive" : "secondary"}
                  className="flex flex-col items-center gap-1 h-auto py-4 rounded-xl"
                  onClick={() => setIsMuted(!isMuted)}
                  disabled={callState !== CallState.ACTIVE}
                >
                  {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                  <span className="text-xs">{isMuted ? "Unmute" : "Mute"}</span>
                </Button>

                <Button
                  variant={
                    callState === CallState.ACTIVE || callState === CallState.CONNECTING ? "destructive" : "default"
                  }
                  className="flex flex-col items-center gap-1 h-auto py-4 rounded-xl"
                  onClick={endCall}
                >
                  <PhoneOff className="h-6 w-6" />
                  <span className="text-xs">End Call</span>
                </Button>

                <Button
                  variant={isSpeakerOn ? "secondary" : "outline"}
                  className="flex flex-col items-center gap-1 h-auto py-4 rounded-xl"
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  disabled={callState !== CallState.ACTIVE}
                >
                  {isSpeakerOn ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
                  <span className="text-xs">{isSpeakerOn ? "Speaker" : "Earpiece"}</span>
                </Button>
              </div>

              {/* Secondary call controls */}
              {callState === CallState.ACTIVE && (
                <div className="grid grid-cols-4 gap-3">
                  <Button
                    variant="ghost"
                    className="flex flex-col items-center gap-1 h-auto py-3"
                    onClick={() => setIsHolding(!isHolding)}
                  >
                    <PauseCircle className={cn("h-5 w-5", isHolding && "text-amber-500")} />
                    <span className="text-xs">{isHolding ? "Resume" : "Hold"}</span>
                  </Button>

                  <Button
                    variant="ghost"
                    className="flex flex-col items-center gap-1 h-auto py-3"
                    onClick={() => setShowDialpad(!showDialpad)}
                  >
                    <Keypad className="h-5 w-5" />
                    <span className="text-xs">Keypad</span>
                  </Button>

                  <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-3">
                    <UserPlus className="h-5 w-5" />
                    <span className="text-xs">Add Call</span>
                  </Button>

                  <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-3">
                    <MoreVertical className="h-5 w-5" />
                    <span className="text-xs">More</span>
                  </Button>
                </div>
              )}

              {/* In-call dialpad */}
              {showDialpad && callState === CallState.ACTIVE && (
                <div className="mt-4 p-3 bg-background/80 rounded-xl">
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((num) => (
                      <Button key={num} variant="ghost" size="sm">
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}