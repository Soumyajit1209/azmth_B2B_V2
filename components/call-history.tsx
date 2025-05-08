"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Bot,
  Clock,
  Calendar,
  MessageSquare,
  User,
  RefreshCw
} from "lucide-react";
import { formatDuration, formatDate, getStatusBadge } from "@/lib/utils";
import CallDetailModal from "@/components/call-detail-modal"
import { CallRecord } from "@/types/interfaces";

export function CallHistory() {
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [filteredCalls, setFilteredCalls] = useState<CallRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    const loadingState = calls.length > 0 ? setIsRefreshing : setIsLoading;
    loadingState(true);

    try {
      const response = await fetch("/api/call-records", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch call records");
      }

      const data = await response.json();
      setCalls(data);
      setFilteredCalls(data);
    } catch (error) {
      console.error("Error fetching call records:", error);
    } finally {
      loadingState(false);
    }
  };

  const handleCardClick = (call: CallRecord) => {
    setSelectedCall(call);
  };

  const closeModal = () => {
    setSelectedCall(null);
  };

  // Helper function to determine call icon
  const getCallIcon = (call: CallRecord) => {
    // Check if it's a missed call
    if (call.endedReason === "customer-did-not-answer") {
      return <PhoneMissed className="h-4 w-4 text-destructive" />;
    }
    
    // Check if it's inbound or outbound (you may need to adjust based on actual data structure)
    const isInbound = call.direction === "inbound";
    
    return isInbound ? 
      <PhoneIncoming className="h-4 w-4 text-primary" /> : 
      <PhoneOutgoing className="h-4 w-4 text-primary" />;
  };

  // Format date for display in list
  const formatCallTime = (timestamp: string) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Get call duration in mm:ss format
  const getCallDuration = (startedAt: string, endedAt: string) => {
    if (!startedAt || !endedAt) return "00:00";
    
    const start = new Date(startedAt).getTime();
    const end = new Date(endedAt).getTime();
    const durationInSeconds = Math.floor((end - start) / 1000);
    
    const mins = Math.floor(durationInSeconds / 60);
    const secs = durationInSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Call History</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1"
          onClick={fetchCalls}
          disabled={isLoading || isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="text-xs">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : calls.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <Phone className="h-8 w-8 text-muted-foreground mb-2" />
            <h3 className="font-medium mb-1">No call records found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              No call records available. Initiate calls to see records here.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchCalls}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {filteredCalls.map((call) => (
                <div
                  key={call.id}
                  className="flex items-center justify-between space-x-4 rounded-md border p-3 hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => handleCardClick(call)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      {getCallIcon(call)}
                    </div>
                    <div>
                      <div className="font-medium">
                        {call.customer?.name || "Unknown Caller"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {call.customer?.number || "N/A"} • {formatCallTime(call.startedAt || call.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {call.usedAI && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Bot className="h-3 w-3" />
                        <span>AI</span>
                      </Badge>
                    )}
                    <Badge variant="secondary">
                      {getCallDuration(call.startedAt, call.endedAt)}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={getStatusBadge(call.status, call.endedReason).color}
                    >
                      {getStatusBadge(call.status, call.endedReason).text}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
      
      {selectedCall && (
        <CallDetailModal call={selectedCall} onClose={closeModal} />
      )}
    </Card>
  );
}