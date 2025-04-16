import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { VoiceCloneSection } from "@/components/voice-clone/voice-clone-section"
import { VideoCloneSection } from "@/components/voice-clone/video-clone-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function VoiceClonePage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Voice & Video Clone"
        text="Clone your sales representatives' voices and videos for AI-powered customer interactions."
      />
      <Tabs defaultValue="voice" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="voice">Voice Clone</TabsTrigger>
          <TabsTrigger value="video">Video Clone</TabsTrigger>
        </TabsList>
        <TabsContent value="voice">
          <VoiceCloneSection />
        </TabsContent>
        <TabsContent value="video">
          <VideoCloneSection />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
