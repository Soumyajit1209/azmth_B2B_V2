"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Upload, File, Check, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function DocumentUpload() {
  const { userId } = useAuth()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [documentContent, setDocumentContent] = useState("")
  const [isCreatingAssistant, setIsCreatingAssistant] = useState(false)
  const [assistantCreated, setAssistantCreated] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setUploadComplete(false)
      setDocumentContent("")
      setAssistantCreated(false)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !userId) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 300)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("userId", userId)

      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setUploadComplete(true)
        
        // Store the document content
        if (data.content) {
          setDocumentContent(data.content)
          toast({
            title: "Document processed",
            description: "Your document has been processed successfully.",
          })
        }
      }
    } catch (error) {
      console.error("Error uploading document:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleCreateAssistant = async () => {
    if (!documentContent) {
      toast({
        title: "No content available",
        description: "Please upload a document first.",
        variant: "destructive",
      })
      return
    }

    setIsCreatingAssistant(true)

    try {
      const response = await fetch("/api/create-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: documentContent,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setAssistantCreated(true)
        toast({
          title: "Assistant created",
          description: "Your assistant has been created with the document content.",
        })
      } else {
        throw new Error(data.error || "Failed to create assistant")
      }
    } catch (error) {
      console.error("Error creating assistant:", error)
      toast({
        title: "Creation failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsCreatingAssistant(false)
    }
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Document & Create Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="file">Select PDF File</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="file" 
                type="file" 
                accept=".pdf" 
                onChange={handleFileChange} 
                className="flex-1" 
              />
            </div>
          </div>

          {selectedFile && (
            <div className="rounded-md bg-muted p-3 flex items-center gap-3">
              <File className="h-5 w-5 text-primary" />
              <div className="flex-1 text-sm truncate">{selectedFile.name}</div>
              <div className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(0)} KB</div>
            </div>
          )}

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {uploadComplete && !isUploading && (
            <div className="rounded-md bg-primary/10 p-3 flex items-center gap-3">
              <Check className="h-5 w-5 text-primary" />
              <div className="text-sm">Upload complete!</div>
            </div>
          )}

          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || !userId || isUploading} 
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </>
            )}
          </Button>

          {documentContent && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="content">Document Content</Label>
                <Textarea 
                  id="content" 
                  value={documentContent}
                  rows={6}
                  readOnly
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  This content will be used to create your assistant.
                </p>
              </div>

              <Button 
                onClick={handleCreateAssistant} 
                disabled={!documentContent || isCreatingAssistant || assistantCreated}
                className="w-full"
                variant="secondary"
              >
                {isCreatingAssistant ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Assistant...
                  </>
                ) : (
                  "Create Assistant with Document Content"
                )}
              </Button>

              {assistantCreated && (
                <div className="rounded-md bg-green-50 p-3 flex items-center gap-3 border border-green-200">
                  <Check className="h-5 w-5 text-green-600" />
                  <div className="text-sm text-green-700">
                    Assistant created successfully! You can now use it for scheduling appointments.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}