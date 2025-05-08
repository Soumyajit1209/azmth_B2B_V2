"use client"

import { useState, useEffect, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@clerk/nextjs"

interface TwilioConfigData {
  sid: string;
  authToken: string;
  phoneNumber: string;
}

interface TwilioConfigModalProps {
  onConfigUpdate: () => void;
  initialData?: TwilioConfigData | null;
}

export default function TwilioConfigModal({ onConfigUpdate, initialData = null }: TwilioConfigModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<TwilioConfigData>({
    sid: "",
    authToken: "",
    phoneNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    if (initialData) {
      setFormData({
        sid: initialData.sid || "",
        authToken: initialData.authToken || "",
        phoneNumber: initialData.phoneNumber || "",
      });
    }
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.sid || !formData.authToken || !formData.phoneNumber) {
      toast({
        title: "Invalid configuration",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/twilio-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(userId && { "x-clerk-user-id": userId }),
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();

        toast({
          title: "Configuration saved",
          description: "Your Twilio configuration has been saved successfully",
        });

        if (responseData.assistantId) {
          localStorage.setItem("assistantId", responseData.assistantId);
        }

        onConfigUpdate();
        setOpen(false);
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to save configuration");
      }
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span>Twilio Config</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Twilio Configuration</DialogTitle>
          <DialogDescription>
            Enter your Twilio credentials to enable calling functionality.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sid" className="text-right">
              Account SID
            </Label>
            <Input
              id="sid"
              name="sid"
              value={formData.sid}
              onChange={handleChange}
              className="col-span-3"
              placeholder="AC..."
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="authToken" className="text-right">
              Auth Token
            </Label>
            <Input
              id="authToken"
              name="authToken"
              value={formData.authToken}
              onChange={handleChange}
              className="col-span-3"
              type="password"
              placeholder="Enter auth token"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phoneNumber" className="text-right">
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="col-span-3"
              placeholder="+1..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save configuration"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}