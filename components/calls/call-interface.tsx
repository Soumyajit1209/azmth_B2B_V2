"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs" // Import the useUser hook from Clerk
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
  Bot,
  User,
  PauseCircle,
  MoreVertical,
  KeyboardIcon as Keypad,
  UserPlus,
} from "lucide-react"
import { cn } from "@/lib/utils"

import { ScrollArea } from "@/components/ui/scroll-area"

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

// Add a new interface for transcript messages after the Contact interface
interface TranscriptMessage {
  id: string
  text: string
  timestamp: string
  speaker: "user" | "caller" | "ai"
}

interface CallInterfaceProps {
  isDialPadOpen: boolean
  setIsDialPadOpen: (isOpen: boolean) => void
}

// Mock transcript messages for when we're in offline/fallback mode
const mockTranscriptMessages = [
  {
    text: "Hello, how can I help you today?",
    speaker: "ai" as const,
  },
  {
    text: "I'd like to inquire about your services.",
    speaker: "caller" as const,
  },
  {
    text: "I'd be happy to provide information about our services. What specific details are you looking for?",
    speaker: "ai" as const,
  },
]

export function CallInterface({ isDialPadOpen, setIsDialPadOpen }: CallInterfaceProps) {
  // Get Clerk user data
  const { user } = useUser()

  const [callState, setCallState] = useState<CallState>(CallState.IDLE)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [isAIMode, setIsAIMode] = useState(true) // AI Mode enabled by default
  const [callDuration, setCallDuration] = useState(0)
  const [isHolding, setIsHolding] = useState(false)
  const [showDialpad, setShowDialpad] = useState(false)
  const [currentContact, setCurrentContact] = useState<Contact | null>(null)
  const [callId, setCallId] = useState<string | null>(null)
  const [isOfflineMode, setIsOfflineMode] = useState(false) // New state to track offline mode
  // Add transcript state to the component
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([])

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

  // Handle call events - with fallback for when callId is missing
  useEffect(() => {
    if (callState === CallState.ACTIVE) {
      let eventSource: EventSource | undefined

      if (callId) {
        // Online mode with real backend events
        try {
          eventSource = new EventSource(`/api/globaltfn/call/events?callId=${callId}`)

          eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if (data.status === "ended") {
              setCallState(CallState.ENDED)

              setTimeout(() => {
                resetCallState()
              }, 2000)

              if (eventSource) eventSource.close()
            }
          }

          eventSource.onerror = () => {
            console.error("Error with event source connection, falling back to offline mode")
            if (eventSource) eventSource.close()
            setIsOfflineMode(true)
          }
        } catch (error) {
          console.error("Failed to establish event source connection:", error)
          setIsOfflineMode(true)
        }
      } else {
        // No callId - use offline mode
        setIsOfflineMode(true)
        console.log("No callId available - running in offline mode")
      }

      return () => {
        if (eventSource) eventSource.close()
      }
    }
  }, [callId, callState])

  // Transcript handling with offline mode fallback
  useEffect(() => {
    if (callState === CallState.ACTIVE) {
      let transcriptSource: EventSource | undefined
      let mockInterval: NodeJS.Timeout | undefined

      // Only try to connect to real backend if we have a callId and are not in offline mode
      if (callId && !isOfflineMode) {
        try {
          transcriptSource = new EventSource(`/api/globaltfn/call/transcript?callId=${callId}`)

          transcriptSource.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if (data.message) {
              setTranscript((prev) => [
                ...prev,
                {
                  id: Date.now().toString(),
                  text: data.message.text,
                  timestamp: new Date().toISOString(),
                  speaker: data.message.speaker,
                },
              ])
            }
          }

          transcriptSource.onerror = () => {
            console.error("Error with transcript event source connection, falling back to mock data")
            if (transcriptSource) transcriptSource.close()
            setIsOfflineMode(true)
            simulateMockTranscript()
          }
        } catch (error) {
          console.error("Failed to establish transcript event source:", error)
          setIsOfflineMode(true)
          simulateMockTranscript()
        }
      } else if (callState === CallState.ACTIVE) {
        // If we're in offline mode or don't have a callId, simulate transcript with mock data
        simulateMockTranscript()
      }

      // Function to simulate mock transcript data
      function simulateMockTranscript() {
        // Only add initial message if transcript is empty
        if (transcript.length === 0) {
          // Add initial AI greeting
          setTranscript([
            {
              id: Date.now().toString(),
              text: "Hello, how can I help you today?",
              timestamp: new Date().toISOString(),
              speaker: "ai",
            },
          ])
        }

        // Set up interval to add mock messages every 8-15 seconds if in AI mode
        mockInterval = setInterval(() => {
          if (isAIMode && !isHolding && callState === CallState.ACTIVE) {
            const randomMessage = mockTranscriptMessages[Math.floor(Math.random() * mockTranscriptMessages.length)]
            setTranscript((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                text: randomMessage.text,
                timestamp: new Date().toISOString(),
                speaker: randomMessage.speaker,
              },
            ])
          }
        }, Math.random() * 7000 + 8000) // Random interval between 8-15 seconds
      }

      return () => {
        if (transcriptSource) transcriptSource.close()
        if (mockInterval) clearInterval(mockInterval)
      }
    }
  }, [callId, callState, isOfflineMode, isAIMode, isHolding, transcript.length])

  const initiateCall = async (phoneNumber: string) => {
    // Find contact by number or create a new one
    const contact: Contact = {
      id: "unknown",
      name: phoneNumber.length > 3 ? `Caller (${phoneNumber})` : "Unknown",
      number: phoneNumber,
    }

    // Set current contact
    setCurrentContact(contact)

    // Update call state
    setCallState(CallState.DIALING)
    setCallDuration(0)
    setIsAIMode(true)
    setTranscript([]) // Clear transcript for new call

    try {
      const userId = user?.id || null
      const userPhoto = user?.imageUrl || null
      const userName = user?.fullName || user?.username || "Unknown User"

      // Try to call the backend API, but handle the case where it might fail
      try {
        // Call the API to initiate the call with user data
        const response = await fetch(`https://eba4-49-37-35-224.ngrok-free.app/initiate-call/${phoneNumber}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // phoneNumber,
            useAI: true,
            userId,
            userPhoto,
            userName,
          }),
        })

        const data = await response.json()

        if (data.success) {
          console.log("Call initiated successfully:", data)
          setCallId(data.callId)
          setIsOfflineMode(false)
        } else {
          console.warn("Backend response indicated failure, running in offline mode:", data.message)
          setCallId(generateMockCallId())
          setIsOfflineMode(true)
        }
      } catch (error) {
        console.warn("Could not reach backend, running in offline mode:", error)
        setCallId(generateMockCallId())
        setIsOfflineMode(true)
      }

      // Simulate connecting after 1.5 seconds (whether online or offline)
      setTimeout(() => {
        setCallState(CallState.CONNECTING)

        // Simulate connected after another 2 seconds
        setTimeout(() => {
          setCallState(CallState.ACTIVE)
        }, 2000)
      }, 1500)
    } catch (error) {
      console.error("Error during call setup:", error)
      setCallState(CallState.ENDED)

      // Reset after 2 seconds
      setTimeout(() => {
        resetCallState()
      }, 2000)
    }
  }

  // Generate a mock call ID for offline mode
  const generateMockCallId = () => {
    return `mock-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  }

  const endCall = async () => {
    // Update UI state immediately
    setCallState(CallState.ENDED)

    // Only try to notify backend if we have a real callId and are not in offline mode
    if (callId && !isOfflineMode) {
      try {
        // Notify backend that call is ended by user
        await fetch("/api/globaltfn/call", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            callId,
            action: "end",
            userId: user?.id || null, 
          }),
        })
      } catch (error) {
        console.error("Error ending call on backend:", error)
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
    setIsAIMode(true) // Reset to AI mode for next call
    setIsOfflineMode(false) // Reset offline mode flag
    setTranscript([]) // Clear transcript
  }

  // Toggle AI mode and notify backend if possible
  const toggleAIMode = async (enabled: boolean) => {
    setIsAIMode(enabled)

    // Add user message to transcript when toggling AI mode off
    if (!enabled) {
      setTranscript(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "Taking over the call manually...",
          timestamp: new Date().toISOString(),
          speaker: "user",
        }
      ]);
    } else {
      setTranscript(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "AI assistant is now handling the call.",
          timestamp: new Date().toISOString(),
          speaker: "ai",
        }
      ]);
    }

    // Only notify backend if we have a real callId and are not in offline mode
    if (callId && !isOfflineMode) {
      try {
        // Update AI mode status on backend
        await fetch("/api/globaltfn/call", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            callId,
            action: "updateAIMode",
            useAI: enabled,
            userId: user?.id || null,
          }),
        })
      } catch (error) {
        console.error("Error updating AI mode on backend:", error)
      }
    }
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

  // Allow the user to manually add a transcript message (useful in offline mode)
  const addUserMessage = () => {
    if (callState === CallState.ACTIVE && !isAIMode) {
      // In a real app, this would open a dialog or prompt
      const message = prompt("Enter your message to the caller:");
      if (message && message.trim()) {
        setTranscript(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            text: message.trim(),
            timestamp: new Date().toISOString(),
            speaker: "user",
          }
        ]);
      }
    }
  }

  // Render the idle state (no active call)
  if (callState === CallState.IDLE) {
    return (
      <>
        <DialPad
          isOpen={isDialPadOpen}
          onOpenChange={setIsDialPadOpen}
          onCallInitiated={(number) => {
            setIsDialPadOpen(false)
            initiateCall(number)
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
        onCallInitiated={(number) => {
          setIsDialPadOpen(false)
          initiateCall(number)
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

              {/* AI Mode toggle (only shown during active call) */}
              {callState === CallState.ACTIVE && (
                <div className="flex items-center space-x-2 bg-primary/5 rounded-full px-4 py-2">
                  <Switch id="ai-mode" checked={isAIMode} onCheckedChange={toggleAIMode} />
                  <Label htmlFor="ai-mode" className="cursor-pointer">
                    AI Mode
                  </Label>
                  <Badge variant={isAIMode ? "default" : "outline"} className="ml-2">
                    {isAIMode ? <Bot className="mr-1 h-3 w-3" /> : <User className="mr-1 h-3 w-3" />}
                    {isAIMode ? "AI Speaking" : "You Speaking"}
                  </Badge>
                </div>
              )}
            </div>

            {callState === CallState.ACTIVE && (
              <div className="px-4 pb-2 mb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Live Transcript</div>
                  <div className="flex items-center gap-2">
                    {!isAIMode && (
                      <Button size="sm" variant="ghost" onClick={addUserMessage} className="text-xs h-6 px-2 py-0">
                        Add Message
                      </Button>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {transcript.length} messages
                    </Badge>
                  </div>
                </div>
                <Card className="overflow-hidden border bg-background/95">
                  <ScrollArea className="h-[200px]">
                    {transcript.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground text-sm p-4">
                        <Bot className="mr-2 h-4 w-4 opacity-50" />
                        Waiting for conversation...
                      </div>
                    ) : (
                      <div className="p-3">
                        {transcript.map((message) => (
                          <div
                            key={message.id}
                            className={cn(
                              "py-2 px-3 rounded-lg mb-2 max-w-[85%]",
                              message.speaker === "ai"
                                ? "bg-primary/10 ml-auto"
                                : message.speaker === "user"
                                  ? "bg-secondary/20 mr-auto"
                                  : "bg-muted mr-auto",
                            )}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div
                                className={cn(
                                  "flex items-center justify-center w-5 h-5 rounded-full",
                                  message.speaker === "ai"
                                    ? "bg-primary text-primary-foreground"
                                    : message.speaker === "user"
                                      ? "bg-secondary text-secondary-foreground"
                                      : "bg-muted-foreground text-muted",
                                )}
                              >
                                {message.speaker === "ai" ? (
                                  <Bot className="h-3 w-3" />
                                ) : message.speaker === "user" ? (
                                  <User className="h-3 w-3" />
                                ) : (
                                  <Phone className="h-3 w-3" />
                                )}
                              </div>
                              <span className="text-xs font-medium">
                                {message.speaker === "ai"
                                  ? "AI Assistant"
                                  : message.speaker === "user"
                                    ? "You"
                                    : "Caller"}
                              </span>
                              <span className="text-xs text-muted-foreground ml-auto">
                                {new Date(message.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                })}
                              </span>
                            </div>
                            <p className="text-sm">{message.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </Card>
              </div>
            )}

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