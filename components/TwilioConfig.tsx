"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs";

interface TwilioConfigData {
  sid: string;
  authToken: string;
  phoneNumber: string;
}

interface TwilioConfigModalProps {
  onConfigUpdate: () => void;
  initialData?: TwilioConfigData | null;
}

export default function TwilioConfigModal({
  onConfigUpdate,
  initialData = null,
}: TwilioConfigModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<TwilioConfigData>({
    sid: "",
    authToken: "",
    phoneNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("")
  const { user } = useUser();

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
      toast("Error",
        {
          description:"All fields are required"
        });
      return;
    }

    try {
      setIsLoading(true);
      toast("Creating assistant...", {
        description: "Please wait while we set up your assistant.",
        duration: 3000,
      });

      // Step 1: Create assistant
      const assistantRes = await fetch("/api/create-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-clerk-user-id": user?.id || ""
        }
        ,
        body: JSON.stringify({
          content
        })
      });

      if (!assistantRes.ok) {
        const error = await assistantRes.json();
        throw new Error(error.message || "Failed to create assistant");
      }
      

      const { id,message } = await assistantRes.json();
      if (!id) {
        throw new Error(message || "Assistant ID not found");
      }
      if (message === "Assistant already created") {
        toast("Success", {
          description: message || "Assistant has been successfully created.",
        });
        setOpen(false);
        return;
      }

      // Step 2: Create number
      toast("Linking Twilio number...", {
        description: "Almost there! Configuring your number.",
        duration: 3000,
      });

      const numberRes = await fetch("/api/create-number", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          sid: formData.sid,
          authToken: formData.authToken,
          phoneNumber: formData.phoneNumber,
          clerkId: user?.id,
        }),
      });

      if (!numberRes.ok) {
        const error = await numberRes.json();
        throw new Error(error.message || "Failed to create number");
      }
      const data = await numberRes.json()
      toast("Twilio configuration complete", {
        description: data.message || "Your assistant is now ready to make calls.",
      });

      onConfigUpdate();
      setOpen(false);
    } catch (err: any) {
      toast.error("Error", {
        description: err.message || "Something went wrong",
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
              type="password"
              value={formData.authToken}
              onChange={handleChange}
              className="col-span-3"
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phoneNumber" className="text-right">
              Context
            </Label>
            <Input
              id="content"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="col-span-3"
              placeholder="Context For Agent"
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
