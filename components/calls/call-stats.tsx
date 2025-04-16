"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/ui/chart"

export function CallStats() {
  // Sample data
  const data = [
    { name: "Mon", inbound: 12, outbound: 18, ai: 15 },
    { name: "Tue", inbound: 15, outbound: 20, ai: 18 },
    { name: "Wed", inbound: 18, outbound: 22, ai: 20 },
    { name: "Thu", inbound: 14, outbound: 19, ai: 17 },
    { name: "Fri", inbound: 16, outbound: 21, ai: 19 },
    { name: "Sat", inbound: 8, outbound: 10, ai: 9 },
    { name: "Sun", inbound: 6, outbound: 8, ai: 7 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="inbound"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
              name="Inbound Calls"
            />
            <Area
              type="monotone"
              dataKey="outbound"
              stackId="1"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.6}
              name="Outbound Calls"
            />
            <Area
              type="monotone"
              dataKey="ai"
              stackId="2"
              stroke="#ffc658"
              fill="#ffc658"
              fillOpacity={0.6}
              name="AI Assisted"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
