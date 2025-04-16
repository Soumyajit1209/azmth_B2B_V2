import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Simulate fetching call history
  const calls = [
    {
      id: "call_1",
      customerId: "cust_1",
      customerName: "John Doe",
      date: new Date().toISOString(),
      duration: 320, // seconds
      status: "completed",
      type: "outbound",
      aiAssisted: true,
    },
    {
      id: "call_2",
      customerId: "cust_2",
      customerName: "Jane Smith",
      date: new Date(Date.now() - 3600000).toISOString(),
      duration: 540, // seconds
      status: "completed",
      type: "inbound",
      aiAssisted: false,
    },
    {
      id: "call_3",
      customerId: "cust_3",
      customerName: "Robert Johnson",
      date: new Date(Date.now() - 7200000).toISOString(),
      duration: 180, // seconds
      status: "missed",
      type: "inbound",
      aiAssisted: false,
    },
  ]

  return NextResponse.json({ calls })
}

export async function POST(request: Request) {
  try {
    const { customerId, type } = await request.json()

    // Simulate initiating a call
    return NextResponse.json({
      success: true,
      callId: "call_" + Math.random().toString(36).substring(2, 9),
      status: "connecting",
      customerId,
      type,
    })
  } catch (error) {
    console.error("Error initiating call:", error)
    return NextResponse.json({ success: false, message: "Failed to initiate call" }, { status: 500 })
  }
}
