"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Phone, X, Delete, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface DialPadProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onCallInitiated: (number: string) => void
}

export function DialPad({ isOpen, onOpenChange, onCallInitiated }: DialPadProps) {
  const [phoneNumber, setPhoneNumber] = useState("")

  const handleNumberClick = (num: string) => {
    setPhoneNumber((prev) => prev + num)
  }

  const handleDelete = () => {
    setPhoneNumber((prev) => prev.slice(0, -1))
  }

  const handleCall = () => {
    if (phoneNumber.length > 0) {
      onCallInitiated(phoneNumber)
      setPhoneNumber("")
    }
  }

  // Reset phone number when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setPhoneNumber("")
    }
    onOpenChange(open)
  }

  // Recent contacts (would come from API in real implementation)
  const recentContacts = [
    { id: "1", name: "John Doe", number: "+1 (555) 123-4567", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "2", name: "Jane Smith", number: "+1 (555) 987-6543", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "3", name: "Robert Johnson", number: "+1 (555) 456-7890", avatar: "/placeholder.svg?height=40&width=40" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <Card className="border-0 shadow-none">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-xl">Dial Pad</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="space-y-4">
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="text-xl text-center font-mono"
                placeholder="Enter phone number"
              />

              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((num) => (
                  <Button
                    key={num}
                    variant="outline"
                    className="h-14 text-xl"
                    onClick={() => handleNumberClick(num.toString())}
                  >
                    {num}
                  </Button>
                ))}
              </div>

              <div className="flex justify-between mt-4">
                <Button variant="outline" size="icon" className="h-14 w-14" onClick={handleDelete}>
                  <Delete className="h-6 w-6" />
                </Button>
                <Button
                  className={cn("h-14 w-14 rounded-full", phoneNumber.length === 0 && "opacity-50 cursor-not-allowed")}
                  onClick={handleCall}
                  disabled={phoneNumber.length === 0}
                >
                  <Phone className="h-6 w-6" />
                </Button>
                <Button variant="outline" size="icon" className="h-14 w-14" onClick={() => onOpenChange(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {recentContacts.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Recent Contacts</h3>
                  <div className="space-y-2">
                    {recentContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-accent cursor-pointer"
                        onClick={() => {
                          setPhoneNumber(contact.number.replace(/\D/g, ""))
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{contact.name}</div>
                            <div className="text-xs text-muted-foreground">{contact.number}</div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            setPhoneNumber(contact.number.replace(/\D/g, ""))
                            handleCall()
                          }}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
