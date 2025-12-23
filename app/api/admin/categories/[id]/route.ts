import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()
    const { name, description } = await request.json()
    const { id } = params

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const { data: category, error } = await supabase
      .from("categories")
      .update({ name, slug, description, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        // Unique constraint violation
        return NextResponse.json({ error: "Category name already exists" }, { status: 400 })
      }
      throw error
    }

    return NextResponse.json({ category })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()
    const { id } = params

    // Check if category has products
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id")
      .eq("category_id", id)
      .limit(1)

    if (productsError) throw productsError

    if (products && products.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete category that has products. Please move or delete products first.",
        },
        { status: 400 },
      )
    }

    // Check if category has product groups
    const { data: productGroups, error: groupsError } = await supabase
      .from("product_groups")
      .select("id")
      .eq("category_id", id)
      .limit(1)

    if (groupsError) throw groupsError

    if (productGroups && productGroups.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete category that has product groups. Please move or delete product groups first.",
        },
        { status: 400 },
      )
    }

    const { error } = await supabase.from("categories").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
