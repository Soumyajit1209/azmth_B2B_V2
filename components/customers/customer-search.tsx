"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Mic } from "lucide-react"

export function CustomerSearch() {
  const [isVoiceSearchActive, setIsVoiceSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const toggleVoiceSearch = () => {
    setIsVoiceSearchActive(!isVoiceSearchActive)

    if (!isVoiceSearchActive) {
      // In a real implementation, this would use the Web Speech API
      // to listen for voice input and convert it to text

      // Simulate voice recognition after 2 seconds
      setTimeout(() => {
        setSearchQuery("John Doe")
        setIsVoiceSearchActive(false)
      }, 2000)
    }
  }

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search customers..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {isVoiceSearchActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md">
            <div className="animate-pulse text-primary">Listening...</div>
          </div>
        )}
      </div>
      <Button variant={isVoiceSearchActive ? "destructive" : "outline"} size="icon" onClick={toggleVoiceSearch}>
        <Mic className="h-4 w-4" />
      </Button>
    </div>
  )
}
