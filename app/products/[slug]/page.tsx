import { notFound } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Truck, Shield, RotateCcw } from "lucide-react"
import { createServerClient } from "@/lib/supabase"
import type { Product, Category } from "@/types"
import { AddToCartButton } from "@/components/products/add-to-cart-button"
import { formatKESSimple } from "@/lib/currency"

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("slug", slug)
    .single()

  if (error) {
    console.error("Error fetching product:", error)
    return null
  }

  return data
}

async function getRelatedProducts(categoryId: string, currentProductId: string): Promise<Product[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("category_id", categoryId)
    .neq("id", currentProductId)
    .limit(4)

  if (error) {
    console.error("Error fetching related products:", error)
    return []
  }

  return data || []
}

// FIX: Updated type definition for Next.js 15+
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }> // Params is now a Promise
}) {
  // FIX: Await the params before using them
  const resolvedParams = await params
  const product = await getProduct(resolvedParams.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.category_id, product.id)

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <Image src={product.image_url || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            {product.featured && <Badge className="absolute top-4 left-4">Featured</Badge>}
            {product.stock_quantity < 10 && product.stock_quantity > 0 && (
              <Badge variant="destructive" className="absolute top-4 right-4">
                Low Stock
              </Badge>
            )}
            {product.stock_quantity === 0 && (
              <Badge variant="secondary" className="absolute top-4 right-4">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {product.category && (
              <Badge variant="outline" className="mb-4">
                {product.category.name}
              </Badge>
            )}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(4.8 out of 5)</span>
            </div>
            <p className="text-4xl font-bold text-green-600 mb-6">{formatKESSimple(product.price)}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Stock:</span>
              <span className={`text-sm ${product.stock_quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.stock_quantity > 0 ? `${product.stock_quantity} available` : "Out of stock"}
              </span>
            </div>

            <AddToCartButton product={product} />
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center space-x-3">
              <Truck className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders over KES 20,000</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-muted-foreground">100% secure</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <RotateCcw className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-muted-foreground">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="group hover:shadow-lg transition-shadow">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={relatedProduct.image_url || "/placeholder.svg"}
                    alt={relatedProduct.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{relatedProduct.name}</h3>
                  <p className="text-2xl font-bold text-green-600">{formatKESSimple(relatedProduct.price)}</p>
                  <Button className="w-full mt-4" asChild>
                    <a href={`/products/${relatedProduct.slug}`}>View Details</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
