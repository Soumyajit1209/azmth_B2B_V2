import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, FileText, User, DollarSign } from "lucide-react"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "call",
      description: "Call with John Doe completed",
      time: "10 minutes ago",
      icon: Phone,
    },
    {
      id: 2,
      type: "document",
      description: "Contract uploaded for Acme Inc.",
      time: "1 hour ago",
      icon: FileText,
    },
    {
      id: 3,
      type: "customer",
      description: "New customer Jane Smith added",
      time: "2 hours ago",
      icon: User,
    },
    {
      id: 4,
      type: "payment",
      description: "Payment of $1,250 received from Globex Corp",
      time: "3 hours ago",
      icon: DollarSign,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent">
              <div className="rounded-full bg-primary/10 p-2">
                <activity.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{activity.description}</p>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
