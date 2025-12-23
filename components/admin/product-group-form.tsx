"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/admin/image-upload"
import type { ProductGroup, Category } from "@/types"

interface ProductGroupFormProps {
  productGroup?: ProductGroup
  categories: Category[]
  onSubmit: (data: any) => void
  onCancel: () => void
  isLoading?: boolean
}

export function ProductGroupForm({ productGroup, categories, onSubmit, onCancel, isLoading }: ProductGroupFormProps) {
  const [formData, setFormData] = useState({
    name: productGroup?.name || "",
    description: productGroup?.description || "",
    base_price: productGroup?.base_price?.toString() || "",
    category_id: productGroup?.category_id || "",
    featured: productGroup?.featured || false,
    main_image_url: productGroup?.main_image_url || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      base_price: Number.parseFloat(formData.base_price),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{productGroup ? "Edit Product Group" : "Create Product Group"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Samsung Refrigerator Series"
                  required
                />
              </div>

              <div>
                <Label htmlFor="base_price">Base Price (KES)</Label>
                <Input
                  id="base_price"
                  type="number"
                  value={formData.base_price}
                  onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                  placeholder="Starting price for this group"
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
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this product group"
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
                <Label htmlFor="featured">Featured Product Group</Label>
              </div>
            </div>

            <div>
              <ImageUpload
                value={formData.main_image_url}
                onChange={(imageUrl) => setFormData({ ...formData, main_image_url: imageUrl })}
                onRemove={() => setFormData({ ...formData, main_image_url: "" })}
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
              {isLoading ? "Saving..." : productGroup ? "Update Group" : "Create Group"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
