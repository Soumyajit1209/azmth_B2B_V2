"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Play, Save } from "lucide-react"

interface TrainingSectionProps {
  isTraining: boolean
  trainingProgress: number
  startTraining: () => void
  savedVoices: Array<{ id: string; name: string }>
}

export function TrainingSection({ isTraining, trainingProgress, startTraining, savedVoices }: TrainingSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Train Voice Model</CardTitle>
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
              {savedVoices.length > 0
                ? "Your voice samples are ready for training."
                : "Record a voice sample first, then train your voice model."}
            </div>
          )}

          <div className="flex justify-center">
            <Button onClick={startTraining} disabled={isTraining || savedVoices.length === 0}>
              {isTraining ? "Training..." : "Train Voice Model"}
            </Button>
          </div>

          {savedVoices.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Saved Voices</div>
              <div className="space-y-2">
                {savedVoices.map((voice) => (
                  <div key={voice.id} className="flex items-center justify-between rounded-md border p-2">
                    <div className="text-sm">{voice.name}</div>
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
  )
}
