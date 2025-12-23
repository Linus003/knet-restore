"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Upload, Check, X, ImageIcon, Loader2, Sparkles } from "lucide-react"

interface BlobImage {
  url: string
  pathname: string
  size: number
  uploadedAt: string
  suggestedName: string
  suggestedDescription: string
}

interface Category {
  id: string
  name: string
  slug: string
}

interface BlobGalleryProps {
  categories: Category[]
  onProductCreated: () => void
}

export function BlobGallery({ categories, onProductCreated }: BlobGalleryProps) {
  const [images, setImages] = useState<BlobImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<BlobImage | null>(null)
  const [creating, setCreating] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Form data for product creation
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    stock_quantity: "10",
    featured: false,
  })

  const fetchImages = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/blob-images")
      const data = await response.json()

      if (data.success) {
        setImages(data.images)
        if (data.images.length === 0) {
          setError("No images found in Blob storage. Upload images first.")
        }
      } else {
        setError(data.error || "Failed to load images")
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch images")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const selectImage = (image: BlobImage) => {
    setSelectedImage(image)
    setFormData({
      ...formData,
      name: image.suggestedName,
      description: image.suggestedDescription,
    })
    setSuccessMessage(null)
  }

  const createProduct = async () => {
    if (!selectedImage) return

    if (!formData.name || !formData.price || !formData.category_id) {
      setError("Please fill in all required fields (name, price, category)")
      return
    }

    setCreating(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: Number.parseFloat(formData.price),
          category_id: formData.category_id,
          stock_quantity: Number.parseInt(formData.stock_quantity) || 10,
          featured: formData.featured,
          image_url: selectedImage.url,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccessMessage(`Product "${formData.name}" created successfully!`)
        // Remove the used image from the list
        setImages(images.filter((img) => img.url !== selectedImage.url))
        setSelectedImage(null)
        setFormData({
          name: "",
          description: "",
          price: "",
          category_id: formData.category_id, // Keep the category
          stock_quantity: "10",
          featured: false,
        })
        onProductCreated()
      } else {
        setError(data.error || "Failed to create product")
      }
    } catch (err: any) {
      setError(err.message || "Failed to create product")
    } finally {
      setCreating(false)
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Import from Blob Storage
          </h3>
          <p className="text-sm text-muted-foreground">
            Select images you've uploaded to Vercel Blob and create products with smart descriptions
          </p>
        </div>
        <Button variant="outline" onClick={fetchImages} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Messages */}
      {error && (
        <Alert variant="destructive">
          <X className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="border-green-500 bg-green-50 text-green-800">
          <Check className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Gallery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Available Images ({images.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No images found in Blob storage</p>
                <p className="text-sm">Upload images to your Vercel Blob storage first</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
                {images.map((image) => (
                  <div
                    key={image.url}
                    onClick={() => selectImage(image)}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all hover:scale-105 ${
                      selectedImage?.url === image.url
                        ? "border-green-500 ring-2 ring-green-500 ring-offset-2"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={image.suggestedName}
                      fill
                      className="object-cover"
                    />
                    {selectedImage?.url === image.url && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2">
                      <p className="text-xs truncate">{image.suggestedName}</p>
                      <p className="text-xs opacity-70">{formatSize(image.size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Create Product
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedImage ? (
              <div className="space-y-4">
                {/* Preview */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <Image src={selectedImage.url || "/placeholder.svg"} alt="Selected" fill className="object-contain" />
                </div>

                <Badge variant="secondary" className="text-xs">
                  {selectedImage.pathname}
                </Badge>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      placeholder="Product description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price (KES) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock_quantity}
                        onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                        placeholder="10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="featured">Featured Product</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={createProduct}
                      disabled={creating}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {creating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Create Product
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedImage(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select an image from the gallery</p>
                <p className="text-sm">Click on any image to start creating a product</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
