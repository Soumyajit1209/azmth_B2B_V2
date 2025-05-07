"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Phone, X, Delete, User } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface DialPadProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onCallInitiated: (number: string, name: string) => void
}

export function DialPad({ isOpen, onOpenChange, onCallInitiated }: DialPadProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [contactName, setContactName] = useState("")

  const handleNumberClick = (num: string) => {
    setPhoneNumber((prev) => prev + num)
  }

  const handleDelete = () => {
    setPhoneNumber((prev) => prev.slice(0, -1))
  }

  const handleCall = () => {
    if (phoneNumber.length > 0) {
      const name = contactName.trim() || `Caller (${phoneNumber})`
      onCallInitiated(phoneNumber, name)
      resetForm()
    }
  }

  const resetForm = () => {
    setPhoneNumber("")
    setContactName("")
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm()
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <Card className="border-0 shadow-none">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-xl">Dial Pad</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="space-y-4">
              {/* Contact Name Input */}
              <div className="space-y-2">
                <Label htmlFor="contact-name" className="flex items-center gap-2 text-gray-700">
                  <User className="h-4 w-4" />
                  Contact Name
                </Label>
                <Input
                  id="contact-name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="text-base"
                  placeholder="Enter contact name"
                />
              </div>

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
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
