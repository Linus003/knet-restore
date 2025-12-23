"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Download, X } from "lucide-react"
import Image from "next/image"

interface BulkImageUploadProps {
  categories: any[]
  onSuccess: () => void
}

export function BulkImageUpload({ categories, onSuccess }: BulkImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [productData, setProductData] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(files)

    // Initialize product data for each file
    const initialData = files.map((file, index) => ({
      name: file.name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, "").replace(/[-_]/g, " "),
      description: "",
      price: 50000,
      category_id: categories[0]?.id || "",
      stock_quantity: 10,
      featured: false,
    }))
    setProductData(initialData)
  }

  const updateProductData = (index: number, field: string, value: any) => {
    const updated = [...productData]
    updated[index] = { ...updated[index], [field]: value }
    setProductData(updated)
  }

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    const newData = productData.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    setProductData(newData)
  }

  const handleBulkUpload = async () => {
    if (!selectedFiles.length) return

    setUploading(true)

    try {
      const formData = new FormData()

      selectedFiles.forEach((file) => {
        formData.append("images", file)
      })

      formData.append("productData", JSON.stringify(productData))

      const response = await fetch("/api/admin/products/bulk-upload-images", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        alert(data.message)
        setSelectedFiles([])
        setProductData([])
        onSuccess()
      } else {
        alert(data.error || "Error uploading images")
      }
    } catch (error) {
      console.error("Error uploading images:", error)
      alert("Error uploading images")
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = `name,description,price,category_slug,stock_quantity,featured
Samsung Refrigerator,Energy efficient refrigerator with smart features,89999,cooling-heating,10,true
LG Washing Machine,Front load washing machine with steam technology,65999,laundry-appliances,15,false
Microwave Oven,Digital microwave with grill function,25999,kitchen-appliances,20,false`

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "bulk_upload_template.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Bulk Image Upload
          <Button onClick={downloadTemplate} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Select Product Images</Label>
          <div className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full h-32 border-dashed"
            >
              <div className="text-center">
                <Upload className="h-8 w-8 mx-auto mb-2" />
                <p>Click to select multiple images</p>
                <p className="text-sm text-muted-foreground">Supports JPG, PNG, GIF, WebP</p>
              </div>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Selected Images ({selectedFiles.length})</h3>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="relative w-full h-32">
                        <Image
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt={file.name}
                          fill
                          className="object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{file.name}</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label>Product Name</Label>
                        <Input
                          value={productData[index]?.name || ""}
                          onChange={(e) => updateProductData(index, "name", e.target.value)}
                          placeholder="Product name"
                        />
                      </div>

                      <div>
                        <Label>Price (KES)</Label>
                        <Input
                          type="number"
                          value={productData[index]?.price || ""}
                          onChange={(e) => updateProductData(index, "price", Number(e.target.value))}
                          placeholder="50000"
                        />
                      </div>

                      <div>
                        <Label>Stock Quantity</Label>
                        <Input
                          type="number"
                          value={productData[index]?.stock_quantity || ""}
                          onChange={(e) => updateProductData(index, "stock_quantity", Number(e.target.value))}
                          placeholder="10"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label>Category</Label>
                        <Select
                          value={productData[index]?.category_id || ""}
                          onValueChange={(value) => updateProductData(index, "category_id", value)}
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

                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={productData[index]?.description || ""}
                          onChange={(e) => updateProductData(index, "description", e.target.value)}
                          placeholder="Product description"
                          rows={3}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`featured-${index}`}
                          checked={productData[index]?.featured || false}
                          onChange={(e) => updateProductData(index, "featured", e.target.checked)}
                        />
                        <Label htmlFor={`featured-${index}`}>Featured Product</Label>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Button
              onClick={handleBulkUpload}
              disabled={uploading}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {uploading ? "Uploading..." : `Upload ${selectedFiles.length} Products`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
