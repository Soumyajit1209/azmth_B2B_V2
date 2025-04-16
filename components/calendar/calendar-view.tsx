"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

export function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState("day")

  // Sample events
  const events = [
    {
      id: 1,
      title: "Call with John Doe",
      time: "10:00 AM - 10:30 AM",
      type: "call",
      customer: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "JD",
      },
    },
    {
      id: 2,
      title: "Team Meeting",
      time: "11:00 AM - 12:00 PM",
      type: "meeting",
    },
    {
      id: 3,
      title: "Lunch Break",
      time: "12:00 PM - 1:00 PM",
      type: "personal",
    },
    {
      id: 4,
      title: "Call with Jane Smith",
      time: "2:00 PM - 2:30 PM",
      type: "call",
      customer: {
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "JS",
      },
    },
    {
      id: 5,
      title: "Product Demo",
      time: "3:00 PM - 4:00 PM",
      type: "meeting",
      customer: {
        name: "Acme Inc.",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "AI",
      },
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Calendar</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="day" onValueChange={setView}>
          <TabsList className="mb-4">
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
          <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-7">
            <div className="md:col-span-5 lg:col-span-5">
              <TabsContent value="day" className="mt-0">
                <div className="space-y-4">
                  <div className="text-xl font-bold">
                    {date?.toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-2">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-start space-x-4 rounded-md border p-3 hover:bg-accent transition-colors"
                        >
                          <div className="text-sm font-medium text-muted-foreground w-24">
                            {event.time.split(" - ")[0]}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{event.title}</div>
                              <Badge variant="outline">{event.type}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">{event.time}</div>
                            {event.customer && (
                              <div className="mt-2 flex items-center space-x-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={event.customer.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>{event.customer.initials}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{event.customer.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
              <TabsContent value="week" className="mt-0">
                <div className="text-xl font-bold mb-4">
                  Week of{" "}
                  {date?.toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="text-center text-sm font-medium">
                      {new Date(
                        date!.getFullYear(),
                        date!.getMonth(),
                        date!.getDate() - date!.getDay() + i,
                      ).toLocaleDateString(undefined, { weekday: "short" })}
                    </div>
                  ))}
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="h-24 border rounded-md p-1 text-xs overflow-hidden">
                      {i === 2 && (
                        <div className="bg-primary/10 text-primary rounded-sm p-1 mb-1 truncate">Call with John</div>
                      )}
                      {i === 4 && (
                        <div className="bg-primary/10 text-primary rounded-sm p-1 mb-1 truncate">Team Meeting</div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="month" className="mt-0">
                <div className="text-xl font-bold mb-4">
                  {date?.toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-sm font-medium">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 35 }).map((_, i) => (
                    <div key={i} className="h-16 border rounded-md p-1 text-xs overflow-hidden">
                      {i + 1}
                      {i === 10 && <div className="bg-primary/10 text-primary rounded-sm p-1 mt-1 truncate">Call</div>}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </div>
            <div className="md:col-span-2 lg:col-span-2">
              <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
              <div className="mt-4">
                <div className="font-medium mb-2">Upcoming Events</div>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {events.slice(0, 3).map((event) => (
                      <div key={event.id} className="rounded-md border p-2 text-sm">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-xs text-muted-foreground">{event.time}</div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
