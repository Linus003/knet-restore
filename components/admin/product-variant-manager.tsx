"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Edit } from "lucide-react"
import Image from "next/image"
import type { Product, ProductGroup } from "@/types"
import { formatKESSimple } from "@/lib/currency"

interface ProductVariantManagerProps {
  productGroup: ProductGroup
  products: Product[]
  onAddVariant: (variantData: any) => void
  onEditVariant: (product: Product) => void
  onDeleteVariant: (productId: string) => void
}

export function ProductVariantManager({
  productGroup,
  products,
  onAddVariant,
  onEditVariant,
  onDeleteVariant,
}: ProductVariantManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [variantData, setVariantData] = useState({
    variant_type: "",
    variant_value: "",
    price_adjustment: "0",
    stock_quantity: "10",
  })

  const handleAddVariant = (e: React.FormEvent) => {
    e.preventDefault()
    onAddVariant({
      ...variantData,
      group_id: productGroup.id,
      price_adjustment: Number.parseFloat(variantData.price_adjustment),
      stock_quantity: Number.parseInt(variantData.stock_quantity),
    })
    setVariantData({
      variant_type: "",
      variant_value: "",
      price_adjustment: "0",
      stock_quantity: "10",
    })
    setShowAddForm(false)
  }

  const groupedVariants = products.reduce(
    (acc, product) => {
      const type = product.variant_type || "default"
      if (!acc[type]) acc[type] = []
      acc[type].push(product)
      return acc
    },
    {} as Record<string, Product[]>,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Product Variants for "{productGroup.name}"
          <Button onClick={() => setShowAddForm(true)} size="sm" className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Variant
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {showAddForm && (
          <Card className="border-dashed">
            <CardContent className="p-4">
              <form onSubmit={handleAddVariant} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Variant Type</Label>
                    <Select
                      value={variantData.variant_type}
                      onValueChange={(value) => setVariantData({ ...variantData, variant_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="size">Size</SelectItem>
                        <SelectItem value="color">Color</SelectItem>
                        <SelectItem value="capacity">Capacity</SelectItem>
                        <SelectItem value="model">Model</SelectItem>
                        <SelectItem value="material">Material</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Variant Value</Label>
                    <Input
                      value={variantData.variant_value}
                      onChange={(e) => setVariantData({ ...variantData, variant_value: e.target.value })}
                      placeholder="e.g., Large, Red, 500L"
                      required
                    />
                  </div>

                  <div>
                    <Label>Price Adjustment (KES)</Label>
                    <Input
                      type="number"
                      value={variantData.price_adjustment}
                      onChange={(e) => setVariantData({ ...variantData, price_adjustment: e.target.value })}
                      placeholder="0 for base price"
                    />
                  </div>

                  <div>
                    <Label>Stock Quantity</Label>
                    <Input
                      type="number"
                      value={variantData.stock_quantity}
                      onChange={(e) => setVariantData({ ...variantData, stock_quantity: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" size="sm">
                    Add Variant
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {Object.entries(groupedVariants).map(([variantType, variants]) => (
          <div key={variantType}>
            <h4 className="font-semibold mb-3 capitalize">
              {variantType === "default" ? "Base Products" : `${variantType} Variants`}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {variants.map((product) => (
                <Card key={product.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={product.image_url || productGroup.main_image_url || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm truncate">{product.name}</h5>
                        {product.variant_value && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {product.variant_type}: {product.variant_value}
                          </Badge>
                        )}
                        <p className="text-sm font-semibold text-green-600 mt-1">{formatKESSimple(product.price)}</p>
                        <p className="text-xs text-muted-foreground">Stock: {product.stock_quantity}</p>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <Button variant="outline" size="sm" onClick={() => onEditVariant(product)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDeleteVariant(product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No variants added yet. Click "Add Variant" to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
