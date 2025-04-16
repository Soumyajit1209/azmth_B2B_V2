"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, MicOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function VoiceCommands() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [lastCommand, setLastCommand] = useState("")

  const toggleListening = () => {
    setIsListening(!isListening)

    if (!isListening) {
      // In a real implementation, this would use the Web Speech API
      // to listen for voice commands

      // Simulate voice recognition after 2 seconds
      setTimeout(() => {
        const commands = [
          "Create a meeting with John tomorrow at 2 PM",
          "Schedule a call with Jane on Friday at 10 AM",
          "Show me all events for next week",
          "Cancel my 3 PM meeting",
          "Reschedule the team meeting to Thursday",
        ]

        const randomCommand = commands[Math.floor(Math.random() * commands.length)]
        setTranscript(randomCommand)
        setLastCommand(randomCommand)
        setIsListening(false)
      }, 2000)
    } else {
      setTranscript("")
    }
  }

  const exampleCommands = [
    "Create a meeting with [name] on [date] at [time]",
    "Schedule a call with [customer]",
    "Show me all events for [date/period]",
    "Cancel my [time] meeting",
    "Reschedule [event] to [date/time]",
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Voice Commands</span>
          <Badge variant={isListening ? "default" : "outline"}>{isListening ? "Listening..." : "Ready"}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <Button
              variant={isListening ? "destructive" : "default"}
              size="lg"
              className="h-16 w-16 rounded-full"
              onClick={toggleListening}
            >
              {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>
          </div>

          {isListening && <div className="text-center animate-pulse">Listening for commands...</div>}

          {transcript && (
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm font-medium">Recognized:</p>
              <p className="text-sm">{transcript}</p>
            </div>
          )}

          {lastCommand && !isListening && (
            <div className="rounded-md bg-primary/10 p-3">
              <p className="text-sm font-medium">Last Command:</p>
              <p className="text-sm">{lastCommand}</p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium mb-2">Example Commands:</p>
            <ul className="space-y-1">
              {exampleCommands.map((command, index) => (
                <li key={index} className="text-xs text-muted-foreground">
                  • {command}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
