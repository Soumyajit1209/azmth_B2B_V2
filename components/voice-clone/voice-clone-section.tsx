"use client"
import { RecordingSection } from "@/components/voice-clone/recording-section"
import { TrainingSection } from "@/components/voice-clone/training-section"
import { VoiceCloneHeader } from "@/components/voice-clone/voice-clone-header"
import { useVoiceClone } from "@/components/voice-clone/use-voice-clone"

export function VoiceCloneSection() {
  const {
    isRecording,
    recordingTime,
    isTraining,
    trainingProgress,
    startRecording,
    stopRecording,
    startTraining,
    savedVoices,
  } = useVoiceClone()

  return (
    <div className="space-y-4">
      <VoiceCloneHeader />

      <div className="grid gap-4 md:grid-cols-2">
        <RecordingSection
          isRecording={isRecording}
          recordingTime={recordingTime}
          startRecording={startRecording}
          stopRecording={stopRecording}
        />

        <TrainingSection
          isTraining={isTraining}
          trainingProgress={trainingProgress}
          startTraining={startTraining}
          savedVoices={savedVoices}
        />
      </div>
    </div>
  )
}
