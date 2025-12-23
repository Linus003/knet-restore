import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("images") as File[]
    const productData = formData.get("productData") as string

    if (!files.length) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 })
    }

    const supabase = createServerClient()
    const uploadedProducts = []

    // Parse product data if provided
    let products = []
    if (productData) {
      try {
        products = JSON.parse(productData)
      } catch (error) {
        return NextResponse.json({ error: "Invalid product data format" }, { status: 400 })
      }
    }

    // Get categories for mapping
    const { data: categories } = await supabase.from("categories").select("id, slug, name")
    const categoryMap = new Map(categories?.map((cat) => [cat.slug, cat.id]) || [])

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileName = file.name.toLowerCase()

      // Convert file to base64 for storage (in a real app, you'd upload to a storage service)
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64 = buffer.toString("base64")
      const mimeType = file.type
      const dataUrl = `data:${mimeType};base64,${base64}`

      // Try to match with product data or create from filename
      const productInfo = products[i] || {}

      // Extract product name from filename if not provided
      const productName =
        productInfo.name ||
        fileName
          .replace(/\.(jpg|jpeg|png|gif|webp)$/i, "")
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase())

      // Create product with image
      const product = {
        name: productName,
        description: productInfo.description || `High-quality ${productName.toLowerCase()} for your home`,
        price: productInfo.price || 50000, // Default price in KES
        category_id: productInfo.category_id || categoryMap.get(productInfo.category_slug) || categories?.[0]?.id,
        stock_quantity: productInfo.stock_quantity || 10,
        featured: productInfo.featured || false,
        image_url: dataUrl,
        slug: productName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      }

      if (product.name && product.category_id) {
        const { data: createdProduct, error } = await supabase.from("products").insert(product).select().single()

        if (!error && createdProduct) {
          uploadedProducts.push(createdProduct)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${uploadedProducts.length} products with images`,
      products: uploadedProducts,
    })
  } catch (error) {
    console.error("Error uploading images:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
