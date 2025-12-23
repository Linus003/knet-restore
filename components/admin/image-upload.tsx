"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Upload, X, ImageIcon, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value?: string
  onChange: (imageUrl: string) => void
  onRemove?: () => void
  disabled?: boolean
}

export function ImageUpload({ value, onChange, onRemove, disabled }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    clearMessages()

    // Client-side validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"]
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type: ${file.type}. Please upload a JPEG, PNG, WebP, or GIF image.`)
      return
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
      setError(`File is too large (${sizeMB}MB). Maximum size is 10MB.`)
      return
    }

    if (file.size === 0) {
      setError("The file appears to be empty. Please select a valid image.")
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/admin/products/upload-image", {
        method: "POST",
        body: formData,
      })

      let data
      try {
        data = await response.json()
      } catch {
        setError("Server returned an invalid response. Please try again.")
        return
      }

      if (response.ok && data.success) {
        onChange(data.imageUrl)
        setSuccess(`Image "${file.name}" uploaded successfully!`)
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000)
      } else {
        // Show specific error from server
        setError(data.error || "Failed to upload image. Please try again.")
      }
    } catch (error: any) {
      console.error("Error uploading image:", error)
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        setError("Network error. Please check your internet connection and try again.")
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setUploading(false)
      // Reset the file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearMessages()
    onChange(e.target.value)
  }

  const handleRemove = () => {
    clearMessages()
    if (onRemove) {
      onRemove()
    }
  }

  return (
    <div className="space-y-4">
      <Label>Product Image</Label>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Upload Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert className="border-green-500 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}

      {value ? (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Image
                src={value || "/placeholder.svg"}
                alt="Product image"
                width={200}
                height={200}
                className="rounded-lg object-cover"
                onError={(e) => {
                  // If image fails to load, show placeholder
                  const target = e.target as HTMLImageElement
                  target.src = "/modern-tech-product.png"
                }}
              />
              {onRemove && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2 truncate max-w-[200px]" title={value}>
              {value.length > 50 ? value.substring(0, 50) + "..." : value}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-8">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No image selected</p>
              <p className="text-xs text-muted-foreground mb-4">Supported: JPEG, PNG, WebP, GIF (max 10MB)</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/jpg"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      <div>
        <Label htmlFor="image-url">Or enter image URL</Label>
        <Input
          id="image-url"
          type="url"
          value={value || ""}
          onChange={handleUrlChange}
          placeholder="https://example.com/image.jpg"
          disabled={disabled || uploading}
        />
        <p className="text-xs text-muted-foreground mt-1">
          You can paste a direct link to an image instead of uploading
        </p>
      </div>
    </div>
  )
}
