"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import type { Category } from "@/types"

interface ProductFiltersProps {
  categories: Category[]
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/products")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Categories */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Category</Label>
            <RadioGroup
              value={searchParams.get("category") || ""}
              onValueChange={(value) => updateFilter("category", value || null)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="all" />
                <Label htmlFor="all">All Categories</Label>
              </div>
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={category.slug} id={category.slug} />
                  <Label htmlFor={category.slug}>{category.name}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Sort */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Sort By</Label>
            <RadioGroup
              value={searchParams.get("sort") || ""}
              onValueChange={(value) => updateFilter("sort", value || null)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="newest" />
                <Label htmlFor="newest">Newest</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-asc" id="price-asc" />
                <Label htmlFor="price-asc">Price: Low to High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-desc" id="price-desc" />
                <Label htmlFor="price-desc">Price: High to Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="name" id="name" />
                <Label htmlFor="name">Name A-Z</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Featured */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={searchParams.get("featured") === "true"}
              onCheckedChange={(checked) => updateFilter("featured", checked ? "true" : null)}
            />
            <Label htmlFor="featured">Featured Products Only</Label>
          </div>

          <Button onClick={clearFilters} variant="outline" className="w-full">
            Clear Filters
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
