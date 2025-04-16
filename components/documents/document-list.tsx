"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { FileText, Download, Trash2, FileSpreadsheet, FileCode } from "lucide-react"

interface Document {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: string
  customerId: string
  customerName: string
}

export function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch("/api/documents")
        const data = await response.json()
        setDocuments(data.documents)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching documents:", error)
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  // Get icon based on file type
  const getFileIcon = (type: string) => {
    switch (type) {
      case "xlsx":
      case "csv":
        return <FileSpreadsheet className="h-5 w-5" />
      case "docx":
      case "pdf":
        return <FileText className="h-5 w-5" />
      default:
        return <FileCode className="h-5 w-5" />
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Documents</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-start space-x-4 rounded-md border p-3 hover:bg-accent transition-colors"
                >
                  <div className="rounded-full bg-primary/10 p-2">{getFileIcon(doc.type)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="font-medium">{doc.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatFileSize(doc.size)} • Uploaded on {formatDate(doc.uploadedAt)}
                    </div>
                    <div className="text-xs text-muted-foreground">Customer: {doc.customerName}</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
