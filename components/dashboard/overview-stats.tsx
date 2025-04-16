import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Users, Phone, DollarSign, Clock } from "lucide-react"

export function OverviewStats() {
  const stats = [
    {
      title: "Total Customers",
      value: "2,543",
      change: "+12.5%",
      increasing: true,
      icon: Users,
    },
    {
      title: "Total Calls",
      value: "1,876",
      change: "+8.2%",
      increasing: true,
      icon: Phone,
    },
    {
      title: "Revenue",
      value: "$48,294",
      change: "+24.3%",
      increasing: true,
      icon: DollarSign,
    },
    {
      title: "Avg. Call Duration",
      value: "4m 32s",
      change: "-2.1%",
      increasing: false,
      icon: Clock,
    },
  ]

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center pt-1 text-xs">
              {stat.increasing ? (
                <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-3 w-3 text-rose-500" />
              )}
              <span className={stat.increasing ? "text-emerald-500" : "text-rose-500"}>{stat.change}</span>
              <span className="ml-1 text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
