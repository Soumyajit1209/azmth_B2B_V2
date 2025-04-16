import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

export function VoiceCloneHeader() {
  return (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>Voice Cloning</AlertTitle>
      <AlertDescription>
        Record your voice to create an AI voice clone. The more samples you provide, the better the quality of the voice
        clone will be. We recommend at least 5 minutes of clear speech.
      </AlertDescription>
    </Alert>
  )
}
