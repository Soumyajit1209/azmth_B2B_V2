import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Simulate fetching documents
  const documents = [
    {
      id: "doc_1",
      name: "Contract_Acme_Inc.pdf",
      type: "pdf",
      size: 2457600, // bytes
      uploadedAt: new Date(Date.now() - 86400000).toISOString(),
      customerId: "cust_1",
      customerName: "John Doe",
    },
    {
      id: "doc_2",
      name: "Invoice_Q1_2023.xlsx",
      type: "xlsx",
      size: 1228800, // bytes
      uploadedAt: new Date(Date.now() - 172800000).toISOString(),
      customerId: "cust_2",
      customerName: "Jane Smith",
    },
    {
      id: "doc_3",
      name: "Proposal_Initech.docx",
      type: "docx",
      size: 3686400, // bytes
      uploadedAt: new Date(Date.now() - 259200000).toISOString(),
      customerId: "cust_3",
      customerName: "Robert Johnson",
    },
  ]

  return NextResponse.json({ documents })
}

export async function POST(request: Request) {
  try {
    // Parse the form data (would contain file in real implementation)
    const formData = await request.formData()
    const file = formData.get("file") as File
    const customerId = formData.get("customerId") as string

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return a success response
    return NextResponse.json({
      success: true,
      document: {
        id: "doc_" + Math.random().toString(36).substring(2, 9),
        name: file.name,
        type: file.name.split(".").pop(),
        size: file.size,
        uploadedAt: new Date().toISOString(),
        customerId,
        customerName:
          customerId === "cust_1"
            ? "John Doe"
            : customerId === "cust_2"
              ? "Jane Smith"
              : customerId === "cust_3"
                ? "Robert Johnson"
                : "Unknown Customer",
      },
    })
  } catch (error) {
    console.error("Error uploading document:", error)
    return NextResponse.json({ success: false, message: "Failed to upload document" }, { status: 500 })
  }
}
