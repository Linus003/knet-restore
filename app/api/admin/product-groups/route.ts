import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: productGroups, error } = await supabase
      .from("product_groups")
      .select(`
        *,
        category:categories(*),
        products(*)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ productGroups })
  } catch (error) {
    console.error("Error fetching product groups:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const groupData = await request.json()
    const supabase = createServerClient()

    // Generate slug from name
    const slug = groupData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const { data: productGroup, error } = await supabase
      .from("product_groups")
      .insert({
        ...groupData,
        slug,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ productGroup })
  } catch (error) {
    console.error("Error creating product group:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
