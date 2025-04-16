import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Simulate fetching customers
  const customers = [
    {
      id: "cust_1",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      company: "Acme Inc.",
      status: "active",
      lastContact: new Date(Date.now() - 86400000).toISOString(),
      totalSpent: 12500,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "cust_2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1 (555) 987-6543",
      company: "Globex Corp",
      status: "active",
      lastContact: new Date(Date.now() - 172800000).toISOString(),
      totalSpent: 8750,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "cust_3",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      phone: "+1 (555) 456-7890",
      company: "Initech",
      status: "inactive",
      lastContact: new Date(Date.now() - 2592000000).toISOString(),
      totalSpent: 3200,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "cust_4",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      phone: "+1 (555) 789-0123",
      company: "Umbrella Corp",
      status: "active",
      lastContact: new Date(Date.now() - 432000000).toISOString(),
      totalSpent: 15800,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "cust_5",
      name: "Michael Wilson",
      email: "michael.wilson@example.com",
      phone: "+1 (555) 321-6547",
      company: "Stark Industries",
      status: "active",
      lastContact: new Date(Date.now() - 345600000).toISOString(),
      totalSpent: 22400,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  return NextResponse.json({ customers })
}

export async function POST(request: Request) {
  try {
    const customerData = await request.json()

    // Simulate creating a new customer
    return NextResponse.json({
      success: true,
      customer: {
        id: "cust_" + Math.random().toString(36).substring(2, 9),
        ...customerData,
        status: "active",
        lastContact: new Date().toISOString(),
        totalSpent: 0,
      },
    })
  } catch (error) {
    console.error("Error creating customer:", error)
    return NextResponse.json({ success: false, message: "Failed to create customer" }, { status: 500 })
  }
}
