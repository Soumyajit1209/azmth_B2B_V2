"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/ui/chart"

export function SalesChart() {
  // Sample data
  const data = [
    { name: "Jan", sales: 4000, calls: 240, customers: 24 },
    { name: "Feb", sales: 3000, calls: 198, customers: 22 },
    { name: "Mar", sales: 5000, calls: 280, customers: 29 },
    { name: "Apr", sales: 2780, calls: 190, customers: 20 },
    { name: "May", sales: 1890, calls: 150, customers: 18 },
    { name: "Jun", sales: 2390, calls: 170, customers: 21 },
    { name: "Jul", sales: 3490, calls: 220, customers: 25 },
  ]

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>View your sales performance over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="line">
          <TabsList className="mb-4">
            <TabsTrigger value="line">Line</TabsTrigger>
            <TabsTrigger value="bar">Bar</TabsTrigger>
            <TabsTrigger value="area">Area</TabsTrigger>
          </TabsList>
          <TabsContent value="line">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="calls" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="bar">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" />
                <Bar dataKey="calls" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="area">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                <Area type="monotone" dataKey="calls" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
