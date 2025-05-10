"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Upload, File, Check } from "lucide-react"

export function DocumentUpload() {
  const { userId } = useAuth()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setUploadComplete(false)
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
      // Now using userId from Clerk instead of customerId
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("userId", userId)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setUploadComplete(true)
        console.log("Document uploaded successfully:", data)
      }
    } catch (error) {
      console.error("Error uploading document:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Document</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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

          {uploadComplete && (
            <div className="rounded-md bg-primary/10 p-3 flex items-center gap-3">
              <Check className="h-5 w-5 text-primary" />
              <div className="text-sm">Upload complete!</div>
            </div>
          )}

          <Button onClick={handleUpload} disabled={!selectedFile || !userId || isUploading} className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload Document"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}