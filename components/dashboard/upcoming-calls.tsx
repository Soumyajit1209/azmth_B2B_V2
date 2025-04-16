import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Phone, Video } from "lucide-react"

export function UpcomingCalls() {
  const calls = [
    {
      id: 1,
      customer: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "JD",
      },
      time: "10:30 AM",
      type: "voice",
    },
    {
      id: 2,
      customer: {
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "JS",
      },
      time: "11:45 AM",
      type: "video",
    },
    {
      id: 3,
      customer: {
        name: "Robert Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "RJ",
      },
      time: "2:15 PM",
      type: "voice",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Calls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {calls.map((call) => (
            <div key={call.id} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={call.customer.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{call.customer.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{call.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{call.time}</p>
                </div>
              </div>
              <div>
                {call.type === "voice" ? (
                  <Phone className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Video className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
