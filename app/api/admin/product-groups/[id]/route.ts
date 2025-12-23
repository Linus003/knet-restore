import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
      .update({
        ...groupData,
        slug,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ productGroup })
  } catch (error) {
    console.error("Error updating product group:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    // First, remove group_id from all products in this group
    await supabase
      .from("products")
      .update({ group_id: null, variant_type: null, variant_value: null })
      .eq("group_id", params.id)

    // Then delete the group
    const { error } = await supabase.from("product_groups").delete().eq("id", params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product group:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
