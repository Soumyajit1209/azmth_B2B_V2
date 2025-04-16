import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";

interface ChatWindowProps {
  selectedCustomer: {
    id: string;
    name: string;
    company: string;
    avatar: string;
  } | null;
}

interface ChatEntry {
  id: string;
  date: string;
  time: string;
  summary?: string;
  content: { sender: "user" | "response"; message: string }[];
}

export function ChatWindow({ selectedCustomer }: ChatWindowProps) {
  const [expandedChatId, setExpandedChatId] = useState<string | null>(null);

  // Example chat data
  const chatEntries: ChatEntry[] = [
    {
      id: "1",
      date: "1/2/2025",
      time: "12:00 PM",
      summary: "Initial contact",
      content: [
        { sender: "user", message: "Hello, how can I help you?" },
        { sender: "response", message: "I need assistance with my account." },
        { sender: "user", message: "Sure, let me check that for you." },
      ],
    },
    {
      id: "2",
      date: "1/3/2025",
      time: "1:00 PM",
      content: [
        {
          sender: "response",
          message: "Good afternoon, how can I assist you?",
        },
        { sender: "user", message: "I have a billing issue." },
        {
          sender: "response",
          message: "Let me connect you to the billing team.",
        },
      ],
    },
    {
      id: "3",
      date: "1/4/2025",
      time: "3:30 PM",
      content: [
        { sender: "user", message: "Can you help me reset my password?" },
        {
          sender: "response",
          message: "Sure, I can guide you through the process.",
        },
      ],
    },
  ];

  if (!selectedCustomer) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-center">
        Select a customer to start chatting.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center space-x-3 shrink-0">
        <Avatar>
          <AvatarImage src={selectedCustomer.avatar || "/placeholder.svg"} />
          <AvatarFallback>
            {selectedCustomer.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{selectedCustomer.name}</div>
          <div className="text-sm text-muted-foreground">
            {selectedCustomer.company}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
        {chatEntries.map((entry) => (
          <Accordion type="single" collapsible key={entry.id}>
            <AccordionItem value={entry.id}>
              <AccordionTrigger className="hover:bg-transparent">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{entry.date}</span>
                  <ClockIcon className="h-5 w-5 text-muted-foreground ml-4" />
                  <span className="font-medium">{entry.time}</span>
                </div>
                <br />
                <span className="font-medium opacity-50">{entry.summary}</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-2 space-y-4">
                  {entry.content.map((chat, index) => (
                    <div
                      key={index}
                      className={`flex flex-col ${
                        chat.sender === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      {/* Chat Message */}
                      <div
                        className={`p-2 rounded-lg ${
                          chat.sender === "user"
                            ? "bg-white text-black border border-gray-300" // Right-side chat (user)
                            : "bg-black text-white border border-white" // Left-side chat (response)
                        }`}
                      >
                        {chat.message}
                      </div>

                      {/* Audio Player */}
                      <audio
                        controls
                        className={`mt-2 ${
                          chat.sender === "user" ? "self-end" : "self-start"
                        }`}
                      >
                        <source
                          src="/path/to/dummy-audio.mp3"
                          type="audio/mpeg"
                        />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t shrink-0">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-md"
          />
          <Button>Send</Button>
        </div>
      </div>
    </div>
  );
}
