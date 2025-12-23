"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Download, X, CloudUpload } from "lucide-react"
import { formatKESSimple } from "@/lib/currency"
import { ImageUpload } from "@/components/admin/image-upload"
import { BulkImageUpload } from "@/components/admin/bulk-image-upload"
import { BlobGallery } from "./blob-gallery"
import { ProductAssistant } from "@/components/admin/product-assistant"

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    stock_quantity: "",
    featured: false,
    image_url: "",
  })

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
      ])
      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()
      setProducts(productsData.products || [])
      setCategories(categoriesData.categories || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : "/api/admin/products"
    const method = editingProduct ? "PUT" : "POST"

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number.parseFloat(formData.price),
          stock_quantity: Number.parseInt(formData.stock_quantity),
        }),
      })

      if (response.ok) {
        fetchData()
        resetForm()
      } else {
        const data = await response.json()
        alert(data.error || "Error saving product")
      }
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Error saving product")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const handleEdit = (product: any) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category_id: product.category_id || "",
      stock_quantity: product.stock_quantity.toString(),
      featured: product.featured || false,
      image_url: product.image_url || "",
    })
    setShowAddForm(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category_id: "",
      stock_quantity: "",
      featured: false,
      image_url: "",
    })
    setEditingProduct(null)
    setShowAddForm(false)
  }

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/admin/products/bulk-upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        fetchData()
        alert("Products uploaded successfully!")
      } else {
        alert("Error uploading products")
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("Error uploading products")
    }
  }

  const downloadTemplate = () => {
    const csvContent =
      "name,description,price,category_slug,stock_quantity,featured,image_url\n" +
      "Example Product,This is a sample product description,1999,kitchen,50,true,https://example.com/image.jpg\n"
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "products_template.csv"
    a.click()
  }

  const handleDescriptionGenerated = (description: string) => {
    setFormData((prev) => ({ ...prev, description }))
  }

  const handlePriceEstimated = (price: number) => {
    setFormData((prev) => ({ ...prev, price: price.toString() }))
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Products Management</h1>

      <Tabs defaultValue="products">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="products">All Products</TabsTrigger>
          <TabsTrigger value="add">Add Product</TabsTrigger>
          <TabsTrigger value="bulk-csv">CSV Upload</TabsTrigger>
          <TabsTrigger value="bulk-images">Image Upload</TabsTrigger>
          <TabsTrigger value="blob-gallery">
            <CloudUpload className="h-4 w-4 mr-1" />
            Blob Gallery
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                All Products ({products.length})
                <Button onClick={() => setShowAddForm(true)} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product: any) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                      <div className="relative w-16 h-16">
                        <Image
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>

                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.category?.name}</p>
                      </div>

                      <div>
                        <p className="font-medium">{formatKESSimple(product.price)}</p>
                      </div>

                      <div>
                        <p className="text-sm">Stock: {product.stock_quantity}</p>
                        {product.stock_quantity < 10 && (
                          <Badge variant="destructive" className="text-xs">
                            Low Stock
                          </Badge>
                        )}
                      </div>

                      <div>{product.featured && <Badge>Featured</Badge>}</div>

                      <div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(product.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="price">Price (KES)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category_id}
                        onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category: any) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock_quantity}
                        onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      />
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>
                  </div>

                  <div>
                    <ImageUpload
                      value={formData.image_url}
                      onChange={(imageUrl) => setFormData({ ...formData, image_url: imageUrl })}
                      onRemove={() => setFormData({ ...formData, image_url: "" })}
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    {editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk-csv">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Bulk CSV Upload
                <Button onClick={downloadTemplate} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csv-upload">Upload CSV File</Label>
                  <Input id="csv-upload" type="file" accept=".csv" onChange={handleBulkUpload} className="mt-2" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload a CSV file with columns: name, description, price, category_slug, stock_quantity, featured,
                  image_url
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk-images">
          <BulkImageUpload categories={categories} onSuccess={fetchData} />
        </TabsContent>

        <TabsContent value="blob-gallery">
          <BlobGallery categories={categories} onProductCreated={fetchData} />
        </TabsContent>
      </Tabs>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {editingProduct ? "Edit Product" : "Add New Product"}
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="modal-name">Product Name</Label>
                      <Input
                        id="modal-name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="modal-price">Price (KES)</Label>
                      <Input
                        id="modal-price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="modal-category">Category</Label>
                      <Select
                        value={formData.category_id}
                        onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category: any) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="modal-stock">Stock Quantity</Label>
                      <Input
                        id="modal-stock"
                        type="number"
                        value={formData.stock_quantity}
                        onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="modal-description">Description</Label>
                      <Textarea
                        id="modal-description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="modal-featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      />
                      <Label htmlFor="modal-featured">Featured Product</Label>
                    </div>
                  </div>

                  <div>
                    <ImageUpload
                      value={formData.image_url}
                      onChange={(imageUrl) => setFormData({ ...formData, image_url: imageUrl })}
                      onRemove={() => setFormData({ ...formData, image_url: "" })}
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    {editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <ProductAssistant
        productContext={formData.name ? `Currently editing: ${formData.name}` : undefined}
        onDescriptionGenerated={handleDescriptionGenerated}
        onPriceEstimated={handlePriceEstimated}
      />
    </div>
  )
}
