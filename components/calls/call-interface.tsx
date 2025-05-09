"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Phone, PhoneCall, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CallInterfaceProps {
  isDialPadOpen: boolean
  setIsDialPadOpen: (isOpen: boolean) => void
  onCallStatusChange?: (callId: string, status: string) => void
}

export const CallInterface = forwardRef(({ isDialPadOpen, setIsDialPadOpen, onCallStatusChange }: CallInterfaceProps, ref) => {
  // Get Clerk user data
  const { user } = useUser()

  const [newContactForms, setNewContactForms] = useState<{id: string, name: string, number: string, status: string, isExit: boolean}[]>([])

  // Expose methods to parent component through ref
  useImperativeHandle(ref, () => ({
    addNewContactForm: () => {
      const formId = Date.now().toString()
      setNewContactForms(prev => [...prev, { id: formId, name: "", number: "", status: "idle", isExit: false }])
    }
  }))

  const addNewContactForm = () => {
    const formId = Date.now().toString()
    setNewContactForms(prev => [...prev, { id: formId, name: "", number: "", status: "idle", isExit: false }])
  }

  const updateContactForm = (id: string, field: 'name' | 'number', value: string) => {
    setNewContactForms(prev => 
      prev.map(form => form.id === id ? { ...form, [field]: value } : form)
    )
  }

  const removeContactForm = (id: string) => {
    // Mark the form for animated exit
    setNewContactForms(prev => 
      prev.map(form => form.id === id ? { ...form, isExit: true } : form)
    )
    
    // Remove after animation completes
    setTimeout(() => {
      setNewContactForms(prev => prev.filter(form => form.id !== id))
    }, 500) // 500ms matches the animation duration
  }

  const initiateCall = async (formId: string) => {
    const form = newContactForms.find(f => f.id === formId)
    if (!form || !form.number || form.status !== "idle") return
    
    // Update status to loading
    setNewContactForms(prev => 
      prev.map(form => form.id === formId ? { ...form, status: "loading" } : form)
    )
    
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
        
        // Notify parent component about status change
        if (onCallStatusChange) {
          onCallStatusChange(data.callId, "initiated")
        }
        
        // After a brief delay, remove the form with animation
        setTimeout(() => {
          removeContactForm(formId)
        }, 1000)
      } else {
        console.warn("API call failed:", data.error || "Unknown error")
        
        // Reset status back to idle
        setNewContactForms(prev => 
          prev.map(form => form.id === formId ? { ...form, status: "idle" } : form)
        )
      }
    } catch (error) {
      console.error("Error during call setup:", error)
      
      // Reset status back to idle
      setNewContactForms(prev => 
        prev.map(form => form.id === formId ? { ...form, status: "idle" } : form)
      )
    }
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
                <div className="space-y-4">
                  {newContactForms.map(form => (
                    <div 
                      key={form.id} 
                      className={cn(
                        "flex flex-col space-y-3 p-4 border rounded-lg transition-all duration-500 overflow-hidden",
                        form.isExit && "transform -translate-x-full opacity-0"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Contact Details</h4>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => removeContactForm(form.id)}
                          disabled={form.status === "loading"}
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
                            disabled={form.status === "loading"}
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
                            disabled={form.status === "loading"}
                          />
                        </div>
                      </div>
                      <Button 
                        className="w-full flex items-center justify-center gap-2 mt-2"
                        onClick={() => initiateCall(form.id)}
                        disabled={!form.number || form.status === "loading"}
                      >
                        {form.status === "loading" ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Calling...
                          </>
                        ) : (
                          <>
                            <PhoneCall className="h-4 w-4" />
                            Call Now
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
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

  return renderIdleState()
})