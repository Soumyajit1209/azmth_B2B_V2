"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export default function TwilioConfigModal({
  onConfigUpdate,
  className,
}: {
  onConfigUpdate?: () => void;
  className?: string;
}) {
  const [sid, setSid] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [configExists, setConfigExists] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.id;

  // Fetch existing Twilio config when dialog opens
  useEffect(() => {
    if (isOpen && userId) {
      fetchTwilioConfig();
    }
  }, [isOpen, userId]);

  const fetchTwilioConfig = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/twilio-config", {
        method: "GET",
        headers: {
          ...(userId && { "x-clerk-user-id": userId }),
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.twilioConfig) {
          setSid(data.twilioConfig.sid || "");
          setAuthToken(data.twilioConfig.authToken || "");
          setPhoneNumber(data.twilioConfig.phoneNumber || "");
          setConfigExists(true);
        }
      }
    } catch (error) {
      console.error("Error fetching Twilio configuration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/twilio-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(userId && { "x-clerk-user-id": userId }),
        },
        body: JSON.stringify({ sid, authToken, phoneNumber }),
      });

      if (!response.ok) {
        throw new Error("Failed to save Twilio configuration");
      }

      toast({
        title: "Success",
        description: "Twilio configuration saved successfully",
      });

      setConfigExists(true);
      setIsOpen(false);
      
      if (onConfigUpdate) {
        onConfigUpdate();
      }
    } catch (error) {
      console.error("Error saving Twilio configuration:", error);
      toast({
        title: "Error",
        description: "Failed to save Twilio configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={`flex items-center gap-2 ${className}`}
          onClick={() => setIsOpen(true)}
        >
          Configure Twilio
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Configure Twilio</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-white/80" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="sid" className="block text-sm font-medium text-white/80">
                Twilio SID
              </label>
              <Input
                id="sid"
                value={sid}
                onChange={(e) => setSid(e.target.value)}
                placeholder="Enter Twilio SID"
                required
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
            <div>
              <label htmlFor="authToken" className="block text-sm font-medium text-white/80">
                Twilio Auth Token
              </label>
              <Input
                id="authToken"
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
                placeholder="Enter Twilio Auth Token"
                required
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-white/80">
                Twilio Phone Number
              </label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter Twilio Phone Number"
                required
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Configuration"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}