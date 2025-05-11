"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Bot,
  RefreshCw,
} from "lucide-react";
import { formatDuration, formatDate, getStatusBadge } from "@/lib/utils";
import CallDetailModal from "@/components/calls/call-detail-modal";
import { CallRecord } from "@/types/interfaces";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export function CallHistory() {
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [filteredCalls, setFilteredCalls] = useState<CallRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isLoaded: isUserLoaded } = useUser();
  const userId = user?.id;

  const fetchCalls = useCallback(
    async (silent = false) => {
      const loadingState = silent ? setIsRefreshing : setIsLoading;
      loadingState(true);

      try {
        const response = await fetch("/api/call-records", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-clerk-user-id": userId || "",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch call records");
        }

        const data = await response.json();
        if (data.data == 0) {
          return;
        }
        setCalls(data);

        if (!silent) {
          toast("Call records fetched successfully");
        }
      } catch (error) {
        console.error("Error fetching call records:", error);
        toast("Failed to fetch call records", {
          description: "Please try again.",
        });
      } finally {
        loadingState(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    fetchCalls();

    const intervalId = setInterval(() => {
      fetchCalls(true);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [fetchCalls]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCalls(calls);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      setFilteredCalls(
        calls.filter(
          (call) =>
            call.customer?.name?.toLowerCase().includes(lowerCaseQuery) ||
            call.customer?.number?.toLowerCase().includes(lowerCaseQuery)
        )
      );
    }
  }, [searchQuery, calls]);

  const handleCardClick = (call: CallRecord) => {
    setSelectedCall(call);
  };

  const closeModal = () => {
    setSelectedCall(null);
    fetchCalls(true);
  };

  const getCallIcon = (call: CallRecord) => {
    if (call.endedReason === "customer-did-not-answer") {
      return <PhoneMissed className="h-4 w-4 text-destructive" />;
    }

    const isInbound = call.direction === "inbound";

    return isInbound ? (
      <PhoneIncoming className="h-4 w-4 text-primary" />
    ) : (
      <PhoneOutgoing className="h-4 w-4 text-primary" />
    );
  };

  const formatCallTime = (timestamp: string) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getCallDuration = (startedAt: string, endedAt: string) => {
    if (!startedAt || !endedAt) return "00:00";

    const start = new Date(startedAt).getTime();
    const end = new Date(endedAt).getTime();
    const durationInSeconds = Math.floor((end - start) / 1000);

    const mins = Math.floor(durationInSeconds / 60);
    const secs = durationInSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isCallActive = (call: CallRecord) => {
    return ["in-progress", "connecting", "ringing"].includes(
      call.status?.toLowerCase() || ""
    );
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex flex-col items-center justify-between space-y-2">
        <div className="flex items-center justify-between w-full">
          <CardTitle>Call History</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => fetchCalls()}
            disabled={isLoading || isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span className="text-xs">Refresh</span>
          </Button>
        </div>
        <Input
          placeholder="Search by name or number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
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
              onClick={() => fetchCalls()}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {filteredCalls &&
                filteredCalls.map((call) => (
                  <div
                    key={call.id}
                    className={`flex-col items-center justify-between space-x-4 rounded-md border p-3 hover:bg-accent transition-colors cursor-pointer ${
                      isCallActive(call)
                        ? "border-primary border-2 bg-accent/30"
                        : ""
                    }`}
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
                          {call.customer?.number || "N/A"} •{" "}
                          {formatCallTime(call.startedAt || call.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
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
        <CallDetailModal
          call={selectedCall}
          onClose={closeModal}
          onStatusChange={() => fetchCalls(true)}
        />
      )}
    </Card>
  );
}
