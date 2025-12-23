import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// FIX: Update type definition for params to be a Promise
export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // FIX: Await the params before using them
    const { id } = await params
    
    const productData = await request.json()
    const supabase = createServerClient()

    // Generate slug from name
    const slug = productData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const { data: product, error } = await supabase
      .from("products")
      .update({
        ...productData,
        slug,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id) // Use the awaited 'id' variable
      .select()
      .single()

    if (error) throw error

    revalidatePath("/")
    revalidatePath("/products")
    revalidatePath(`/products/${slug}`)

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// FIX: Update type definition for params to be a Promise
export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // FIX: Await the params before using them
    const { id } = await params
    
    const supabase = createServerClient()

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id) // Use the awaited 'id' variable

    if (error) throw error

    revalidatePath("/")
    revalidatePath("/products")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
