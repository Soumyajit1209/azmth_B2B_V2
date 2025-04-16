"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Video, Play, Save } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

export function VideoCloneSection() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [savedVideos, setSavedVideos] = useState<Array<{ id: string; name: string }>>([])

  const startRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)

    // Start a timer to update recordingTime
    const interval = setInterval(() => {
      setRecordingTime((prev) => prev + 1)
    }, 1000)

    // Store the interval ID in a ref so we can clear it later
    ;(window as any).recordingInterval = interval
  }

  const stopRecording = async () => {
    setIsRecording(false)

    // Clear the recording timer
    clearInterval((window as any).recordingInterval)

    try {
      // Simulate API call to send recording
      const formData = new FormData()
      formData.append("video", "dummy-video-blob")

      const response = await fetch("/api/video-clone", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        console.log("Video recording sent successfully:", data)
      }
    } catch (error) {
      console.error("Error sending video recording:", error)
    }
  }

  const startTraining = () => {
    setIsTraining(true)
    setTrainingProgress(0)

    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          setIsTraining(false)
          clearInterval(interval)
          // Add a new saved video after training
          const newVideo = {
            id: `video_${Date.now()}`,
            name: `Video ${savedVideos.length + 1}`,
          }
          setSavedVideos((prev) => [...prev, newVideo])
          return 0
        }
        return prev + 2
      })
    }, 300)
  }

  // Format recording time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Video Cloning</AlertTitle>
        <AlertDescription>
          Record your video to create an AI video clone. Make sure you are in a well-lit environment and facing the
          camera directly. We recommend at least 2 minutes of clear video.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Record Video Sample</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="relative h-48 w-64 rounded-md border-4 border-primary flex items-center justify-center bg-black/10">
                  {isRecording && <div className="absolute inset-0 rounded-md animate-pulse bg-primary/20"></div>}
                  {isRecording ? (
                    <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-red-500 animate-pulse"></div>
                  ) : (
                    <Video className="h-12 w-12 text-primary" />
                  )}
                </div>
              </div>

              {isRecording && <div className="text-center text-2xl font-bold">{formatTime(recordingTime)}</div>}

              <div className="text-center text-sm text-muted-foreground">
                {isRecording
                  ? "Recording in progress... Look at the camera and speak clearly."
                  : "Click the button below to start recording your video sample."}
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

        <Card>
          <CardHeader>
            <CardTitle>Train Video Model</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isTraining ? (
                <div className="space-y-2">
                  <div className="text-center text-sm font-medium">Training in progress...</div>
                  <Progress value={trainingProgress} className="h-2" />
                  <div className="text-center text-xs text-muted-foreground">{trainingProgress}% complete</div>
                </div>
              ) : (
                <div className="text-center text-sm text-muted-foreground">
                  {savedVideos.length > 0
                    ? "Your video samples are ready for training."
                    : "Record a video sample first, then train your video model."}
                </div>
              )}

              <div className="flex justify-center">
                <Button onClick={startTraining} disabled={isTraining || savedVideos.length === 0}>
                  {isTraining ? "Training..." : "Train Video Model"}
                </Button>
              </div>

              {savedVideos.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Saved Videos</div>
                  <div className="space-y-2">
                    {savedVideos.map((video) => (
                      <div key={video.id} className="flex items-center justify-between rounded-md border p-2">
                        <div className="text-sm">{video.name}</div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Save className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
