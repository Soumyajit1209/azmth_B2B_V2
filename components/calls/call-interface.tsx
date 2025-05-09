"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
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
  X,
  PhoneCall
} from "lucide-react"
import { cn } from "@/lib/utils"

enum CallState {
  IDLE = "idle",
  DIALING = "dialing",
  CONNECTING = "connecting",
  ACTIVE = "active",
  ENDED = "ended",
}

// Define specific call status types for better type safety
export type CallStatus = "initiated" | "completed" | "ended" | "no-answer" | "failed"

interface Contact {
  id: string
  name: string
  number: string
  avatar?: string
  callState: CallState
  callId?: string | null
  callDuration: number
  isMuted: boolean
  isHolding: boolean
  isSpeakerOn: boolean
}

interface CallInterfaceProps {
  isDialPadOpen: boolean
  setIsDialPadOpen: (isOpen: boolean) => void
  onCallStatusChange?: (callId: string, status: string) => void
}

export const CallInterface = forwardRef(({ isDialPadOpen, setIsDialPadOpen, onCallStatusChange }: CallInterfaceProps, ref) => {
  // Get Clerk user data
  const { user } = useUser()

  const [contacts, setContacts] = useState<Contact[]>([])
  const [newContactForms, setNewContactForms] = useState<{id: string, name: string, number: string}[]>([])
  const [showDialpad, setShowDialpad] = useState(false)

  // Expose methods to parent component through ref
  useImperativeHandle(ref, () => ({
    addNewContactForm: () => {
      const formId = Date.now().toString()
      setNewContactForms(prev => [...prev, { id: formId, name: "", number: "" }])
    }
  }))

  // Call status checking intervals
  useEffect(() => {
    const intervals: { [key: string]: NodeJS.Timeout } = {}

    // Setup call duration and status check intervals for active calls
    contacts.forEach(contact => {
      if (contact.callState === CallState.ACTIVE && !contact.isHolding && !intervals[contact.id]) {
        // Call duration timer
        intervals[contact.id] = setInterval(() => {
          setContacts(prev => prev.map(c => 
            c.id === contact.id ? { ...c, callDuration: c.callDuration + 1 } : c
          ))
        }, 1000)
        
        // Call status checking
        if (contact.callId) {
          intervals[`status-${contact.id}`] = setInterval(async () => {
            try {
              const response = await fetch(`/api/call-status?callId=${contact.callId}`)
              const data = await response.json()
              
              if (data.status === "completed" || data.status === "failed" || data.status === "no-answer") {
                setContacts(prev => prev.map(c => 
                  c.id === contact.id ? { ...c, callState: CallState.ENDED } : c
                ))
                
                // Notify parent component about status change
                if (onCallStatusChange) {
                  onCallStatusChange(contact.callId!, data.status)
                }
                
                // Remove ended call after delay
                setTimeout(() => {
                  setContacts(prev => prev.filter(c => c.id !== contact.id))
                }, 3000)
                
                if (intervals[contact.id]) clearInterval(intervals[contact.id])
                if (intervals[`status-${contact.id}`]) clearInterval(intervals[`status-${contact.id}`])
              }
            } catch (error) {
              console.error("Error checking call status:", error)
            }
          }, 5000)
        }
      }
    })

    return () => {
      // Clean up all intervals
      Object.values(intervals).forEach(interval => clearInterval(interval))
    }
  }, [contacts, onCallStatusChange])

  const addNewContactForm = () => {
    const formId = Date.now().toString()
    setNewContactForms(prev => [...prev, { id: formId, name: "", number: "" }])
  }

  const updateContactForm = (id: string, field: 'name' | 'number', value: string) => {
    setNewContactForms(prev => 
      prev.map(form => form.id === id ? { ...form, [field]: value } : form)
    )
  }

  const removeContactForm = (id: string) => {
    setNewContactForms(prev => prev.filter(form => form.id !== id))
  }

  const initiateCall = async (formId: string) => {
    const form = newContactForms.find(f => f.id === formId)
    if (!form || !form.number) return
    
    // Create new contact
    const newContact: Contact = {
      id: form.id,
      name: form.name || `Caller (${form.number})`,
      number: form.number,
      callState: CallState.DIALING,
      callDuration: 0,
      isMuted: false,
      isHolding: false,
      isSpeakerOn: true
    }
    
    // Add to contacts list
    setContacts(prev => [...prev, newContact])
    
    // Remove from contact forms
    removeContactForm(form.id)
    
    try {
      // Call API endpoint
      const response = await fetch('/api/create-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contacts: [
            {
              number: form.number,
              name: form.name || `Caller (${form.number})`,
            }
          ]
        }),
      })

      const data = await response.json()

      if (response.ok && data.callId) {
        console.log("Call initiated successfully:", data)
        
        // Update contact with callId
        setContacts(prev => prev.map(c => 
          c.id === newContact.id ? { ...c, callId: data.callId, callState: CallState.CONNECTING } : c
        ))
        
        // Simulate connected after 2 seconds (you could replace this with real status)
        setTimeout(() => {
          setContacts(prev => prev.map(c => 
            c.id === newContact.id ? { ...c, callState: CallState.ACTIVE } : c
          ))
        }, 2000)
        
        // Notify parent component about status change
        if (onCallStatusChange) {
          onCallStatusChange(data.callId, "initiated")
        }
      } else {
        console.warn("API call failed:", data.error || "Unknown error")
        handleFailedCall(newContact.id)
      }
    } catch (error) {
      console.error("Error during call setup:", error)
      handleFailedCall(newContact.id)
    }
  }

  const handleFailedCall = (contactId: string) => {
    setContacts(prev => prev.map(c => 
      c.id === contactId ? { ...c, callState: CallState.ENDED } : c
    ))
    
    // Remove failed call after delay
    setTimeout(() => {
      setContacts(prev => prev.filter(c => c.id !== contactId))
    }, 3000)
  }

  const endCall = async (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId)
    if (!contact) return
    
    // Update UI state immediately
    setContacts(prev => prev.map(c => 
      c.id === contactId ? { ...c, callState: CallState.ENDED } : c
    ))

    // Only try to notify backend if we have a callId
    if (contact.callId) {
      try {
        // Call API to end the call
        await fetch('/api/end-call', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            callId: contact.callId
          }),
        })
        
        // Notify parent component about status change
        if (onCallStatusChange) {
          onCallStatusChange(contact.callId, "ended")
        }
      } catch (error) {
        console.error("Error ending call:", error)
      }
    }

    // Remove ended call after delay
    setTimeout(() => {
      setContacts(prev => prev.filter(c => c.id !== contactId))
    }, 3000)
  }

  const toggleMute = (contactId: string) => {
    setContacts(prev => prev.map(c => 
      c.id === contactId ? { ...c, isMuted: !c.isMuted } : c
    ))
  }

  const toggleHold = (contactId: string) => {
    setContacts(prev => prev.map(c => 
      c.id === contactId ? { ...c, isHolding: !c.isHolding } : c
    ))
  }

  const toggleSpeaker = (contactId: string) => {
    setContacts(prev => prev.map(c => 
      c.id === contactId ? { ...c, isSpeakerOn: !c.isSpeakerOn } : c
    ))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusText = (contact: Contact) => {
    switch (contact.callState) {
      case CallState.DIALING:
        return "Dialing..."
      case CallState.CONNECTING:
        return "Connecting..."
      case CallState.ACTIVE:
        return contact.isHolding ? "On Hold" : formatTime(contact.callDuration)
      case CallState.ENDED:
        return "Call Ended"
      default:
        return ""
    }
  }

  // Render active calls
  const renderActiveCall = (contact: Contact) => {
    return (
      <Card
        key={contact.id}
        className={cn(
          "overflow-hidden transition-all duration-300 mb-4",
          contact.callState === CallState.ACTIVE && "bg-gradient-to-b from-primary/5 to-background",
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
                    contact.callState === CallState.ACTIVE && !contact.isHolding && "bg-green-500/20 text-green-500 border-green-500/30",
                    contact.isHolding && "bg-amber-500/20 text-amber-500 border-amber-500/30",
                    contact.callState === CallState.ENDED && "bg-red-500/20 text-red-500 border-red-500/30",
                  )}
                >
                  {getStatusText(contact)}
                </Badge>
              </div>
            </div>

            {/* Contact info */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6">
              <Avatar className="h-32 w-32 border-4 border-primary/10">
                <AvatarImage src={contact.avatar || "/placeholder.svg?height=128&width=128"} />
                <AvatarFallback className="text-4xl">{contact.name.charAt(0) || "?"}</AvatarFallback>
              </Avatar>

              <div className="text-center">
                <h2 className="text-2xl font-bold mb-1">{contact.name || "Unknown"}</h2>
                <p className="text-muted-foreground">{contact.number || ""}</p>
              </div>

              {/* Call status badge */}
              {contact.callState === CallState.ACTIVE && (
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
                  variant={contact.isMuted ? "destructive" : "secondary"}
                  className="flex flex-col items-center gap-1 h-auto py-4 rounded-xl"
                  onClick={() => toggleMute(contact.id)}
                  disabled={contact.callState !== CallState.ACTIVE}
                >
                  {contact.isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                  <span className="text-xs">{contact.isMuted ? "Unmute" : "Mute"}</span>
                </Button>

                <Button
                  variant={
                    contact.callState === CallState.ACTIVE || contact.callState === CallState.CONNECTING ? "destructive" : "default"
                  }
                  className="flex flex-col items-center gap-1 h-auto py-4 rounded-xl"
                  onClick={() => endCall(contact.id)}
                >
                  <PhoneOff className="h-6 w-6" />
                  <span className="text-xs">End Call</span>
                </Button>

                <Button
                  variant={contact.isSpeakerOn ? "secondary" : "outline"}
                  className="flex flex-col items-center gap-1 h-auto py-4 rounded-xl"
                  onClick={() => toggleSpeaker(contact.id)}
                  disabled={contact.callState !== CallState.ACTIVE}
                >
                  {contact.isSpeakerOn ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
                  <span className="text-xs">{contact.isSpeakerOn ? "Speaker" : "Earpiece"}</span>
                </Button>
              </div>

              {/* Secondary call controls */}
              {contact.callState === CallState.ACTIVE && (
                <div className="grid grid-cols-4 gap-3">
                  <Button
                    variant="ghost"
                    className="flex flex-col items-center gap-1 h-auto py-3"
                    onClick={() => toggleHold(contact.id)}
                  >
                    <PauseCircle className={cn("h-5 w-5", contact.isHolding && "text-amber-500")} />
                    <span className="text-xs">{contact.isHolding ? "Resume" : "Hold"}</span>
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
              {showDialpad && contact.callState === CallState.ACTIVE && (
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
    )
  }

  // Render idle state with contact forms
  const renderIdleState = () => {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-12">
            {newContactForms.length === 0 ? (
              <div className="text-center text-muted-foreground">
                <Phone className="mx-auto h-12 w-12 mb-4 opacity-20" />
                <p>No active calls</p>
                <p className="text-sm">Click the "New Call" button to start a call</p>
              </div>
            ) : (
              <div className="w-full space-y-4">
                <h3 className="text-lg font-medium">New Call</h3>
                {newContactForms.map(form => (
                  <div key={form.id} className="flex flex-col space-y-3 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Contact Details</h4>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => removeContactForm(form.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor={`name-${form.id}`}>Name</Label>
                        <Input 
                          id={`name-${form.id}`}
                          value={form.name}
                          onChange={(e) => updateContactForm(form.id, 'name', e.target.value)}
                          placeholder="Contact name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`number-${form.id}`}>Phone Number</Label>
                        <Input 
                          id={`number-${form.id}`}
                          value={form.number}
                          onChange={(e) => updateContactForm(form.id, 'number', e.target.value)}
                          placeholder="+1234567890"
                          required
                        />
                      </div>
                    </div>
                    <Button 
                      className="w-full flex items-center justify-center gap-2 mt-2"
                      onClick={() => initiateCall(form.id)}
                      disabled={!form.number}
                    >
                      <PhoneCall className="h-4 w-4" />
                      Call Now
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={addNewContactForm}
                >
                  Add Another Contact
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // If there are active calls, show them, otherwise show the idle state
  return (
    <>
      {contacts.length > 0 ? (
        contacts.map(contact => renderActiveCall(contact))
      ) : (
        renderIdleState()
      )}
    </>
  )
})