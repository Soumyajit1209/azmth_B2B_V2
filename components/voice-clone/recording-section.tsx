"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Square } from "lucide-react"

interface RecordingSectionProps {
  isRecording: boolean
  recordingTime: number
  startRecording: () => void
  stopRecording: () => void
}

export function RecordingSection({ isRecording, recordingTime, startRecording, stopRecording }: RecordingSectionProps) {
  // Format recording time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Voice Sample</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative h-32 w-32 rounded-full border-4 border-primary flex items-center justify-center">
              {isRecording && <div className="absolute inset-0 rounded-full animate-pulse bg-primary/20"></div>}
              {isRecording ? <Square className="h-12 w-12 text-primary" /> : <Mic className="h-12 w-12 text-primary" />}
            </div>
          </div>

          {isRecording && <div className="text-center text-2xl font-bold">{formatTime(recordingTime)}</div>}

          <div className="text-center text-sm text-muted-foreground">
            {isRecording
              ? "Recording in progress... Speak clearly and naturally."
              : "Click the button below to start recording your voice sample."}
          </div>

          <div className="flex justify-center">
            {isRecording ? (
              <Button variant="destructive" onClick={stopRecording}>
                Stop Recording
              </Button>
            ) : (
              <Button onClick={startRecording}>Start Recording</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
