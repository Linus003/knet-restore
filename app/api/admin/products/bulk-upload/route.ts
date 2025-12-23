import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const text = await file.text()
    const lines = text.split("\n").filter((line) => line.trim())
    const headers = lines[0].split(",")

    const supabase = createServerClient()

    // Get categories for mapping
    const { data: categories } = await supabase.from("categories").select("id, slug")
    const categoryMap = new Map(categories?.map((cat) => [cat.slug, cat.id]) || [])

    const products = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",")
      if (values.length !== headers.length) continue

      const product = {
        name: values[0]?.trim(),
        description: values[1]?.trim(),
        price: Number.parseFloat(values[2]?.trim() || "0"),
        category_id: categoryMap.get(values[3]?.trim()),
        stock_quantity: Number.parseInt(values[4]?.trim() || "0"),
        featured: values[5]?.trim().toLowerCase() === "true",
        image_url: values[6]?.trim() || "/placeholder.svg?height=400&width=400",
        slug: values[0]
          ?.trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      }

      if (product.name && product.category_id) {
        products.push(product)
      }
    }

    if (products.length > 0) {
      const { error } = await supabase.from("products").insert(products)
      if (error) throw error
    }

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${products.length} products`,
    })
  } catch (error) {
    console.error("Error uploading products:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
