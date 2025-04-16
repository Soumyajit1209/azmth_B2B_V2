import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from "lucide-react"

export function AnalyticsSummary() {
  const metrics = [
    {
      title: "Total Revenue",
      value: "$48,294",
      change: "+24.3%",
      increasing: true,
      icon: TrendingUp,
    },
    {
      title: "Conversion Rate",
      value: "12.8%",
      change: "+3.2%",
      increasing: true,
      icon: TrendingUp,
    },
    {
      title: "Avg. Call Duration",
      value: "4m 32s",
      change: "-2.1%",
      increasing: false,
      icon: TrendingDown,
    },
    {
      title: "Customer Satisfaction",
      value: "94%",
      change: "+5.4%",
      increasing: true,
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.increasing ? "text-emerald-500" : "text-rose-500"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center pt-1 text-xs">
              {metric.increasing ? (
                <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-3 w-3 text-rose-500" />
              )}
              <span className={metric.increasing ? "text-emerald-500" : "text-rose-500"}>{metric.change}</span>
              <span className="ml-1 text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
