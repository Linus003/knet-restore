import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: products, error } = await supabase
      .from("products")
      .select(`
        *,
        category:categories(*),
        product_group:product_groups(*)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error fetching products:", error)
      throw error
    }

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()

    if (!productData.name || !productData.price || !productData.category_id) {
      return NextResponse.json(
        {
          error: "Missing required fields: name, price, and category_id are required",
        },
        { status: 400 },
      )
    }

    const supabase = createServerClient()

    // Generate slug from name
    const slug = productData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const { data: product, error } = await supabase
      .from("products")
      .insert({
        ...productData,
        slug,
        stock_quantity: productData.stock_quantity || 0,
        featured: productData.featured || false,
        image_url: productData.image_url || "/placeholder.svg?height=400&width=400",
      })
      .select()
      .single()

    if (error) {
      console.error("Database error creating product:", error)
      throw error
    }

    revalidatePath("/")
    revalidatePath("/products")

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
