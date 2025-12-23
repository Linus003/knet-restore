"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import type { Product } from "@/types"
import { useCart } from "@/contexts/cart-context"
import { formatKESSimple } from "@/lib/currency"

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const { dispatch } = useCart()

  const addToCart = (product: Product) => {
    dispatch({ type: "ADD_ITEM", payload: product })
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group hover:shadow-lg transition-shadow">
          <CardHeader className="p-0">
            <div className="relative overflow-hidden rounded-t-lg">
              <Link href={`/products/${product.slug}`}>
                <Image
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              {product.featured && <Badge className="absolute top-2 left-2">Featured</Badge>}
              {product.stock_quantity < 10 && product.stock_quantity > 0 && (
                <Badge variant="destructive" className="absolute top-2 right-2">
                  Low Stock
                </Badge>
              )}
              {product.stock_quantity === 0 && (
                <Badge variant="secondary" className="absolute top-2 right-2">
                  Out of Stock
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="text-lg mb-2">
              <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors">
                {product.name}
              </Link>
            </CardTitle>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-bold text-green-600">{formatKESSimple(product.price)}</span>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            {product.category && (
              <Badge variant="outline" className="text-xs">
                {product.category.name}
              </Badge>
            )}
          </CardContent>
          <CardFooter className="p-4 pt-0 space-y-2">
            <div className="flex gap-2 w-full">
              <Link href={`/products/${product.slug}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </Link>
              <Button onClick={() => addToCart(product)} disabled={product.stock_quantity === 0} className="flex-1">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
