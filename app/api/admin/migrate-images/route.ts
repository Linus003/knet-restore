import { put } from "@vercel/blob"
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// Create admin client for database operations
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
)

// Convert base64 to Blob
function base64ToBlob(base64String: string): { blob: Blob; mimeType: string } | null {
  try {
    // Check if it's a data URL
    const matches = base64String.match(/^data:([^;]+);base64,(.+)$/)
    if (!matches) return null

    const mimeType = matches[1]
    const base64Data = matches[2]

    // Decode base64
    const binaryString = atob(base64Data)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    return {
      blob: new Blob([bytes], { type: mimeType }),
      mimeType,
    }
  } catch (error) {
    console.error("Error converting base64:", error)
    return null
  }
}

// Get file extension from mime type
function getExtension(mimeType: string): string {
  const extensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
  }
  return extensions[mimeType] || "jpg"
}

export async function POST() {
  try {
    let migratedCount = 0
    let errorCount = 0
    const errors: string[] = []

    // 1. Migrate products table
    const { data: products, error: productsError } = await supabaseAdmin.from("products").select("id, name, image_url")

    if (productsError) {
      console.error("Error fetching products:", productsError)
    } else if (products) {
      for (const product of products) {
        if (product.image_url && product.image_url.startsWith("data:")) {
          const result = base64ToBlob(product.image_url)
          if (result) {
            try {
              const filename = `products/${product.id}-${Date.now()}.${getExtension(result.mimeType)}`
              const blob = await put(filename, result.blob, { access: "public" })

              // Update database with new URL
              const { error: updateError } = await supabaseAdmin
                .from("products")
                .update({ image_url: blob.url })
                .eq("id", product.id)

              if (updateError) {
                errors.push(`Failed to update product ${product.id}: ${updateError.message}`)
                errorCount++
              } else {
                migratedCount++
                console.log(`Migrated product: ${product.name}`)
              }
            } catch (uploadError) {
              errors.push(`Failed to upload image for product ${product.id}: ${uploadError}`)
              errorCount++
            }
          }
        }
      }
    }

    // 2. Migrate product_groups table
    const { data: productGroups, error: groupsError } = await supabaseAdmin
      .from("product_groups")
      .select("id, name, main_image_url")

    if (groupsError) {
      console.error("Error fetching product groups:", groupsError)
    } else if (productGroups) {
      for (const group of productGroups) {
        if (group.main_image_url && group.main_image_url.startsWith("data:")) {
          const result = base64ToBlob(group.main_image_url)
          if (result) {
            try {
              const filename = `product-groups/${group.id}-${Date.now()}.${getExtension(result.mimeType)}`
              const blob = await put(filename, result.blob, { access: "public" })

              const { error: updateError } = await supabaseAdmin
                .from("product_groups")
                .update({ main_image_url: blob.url })
                .eq("id", group.id)

              if (updateError) {
                errors.push(`Failed to update product group ${group.id}: ${updateError.message}`)
                errorCount++
              } else {
                migratedCount++
                console.log(`Migrated product group: ${group.name}`)
              }
            } catch (uploadError) {
              errors.push(`Failed to upload image for product group ${group.id}: ${uploadError}`)
              errorCount++
            }
          }
        }
      }
    }

    // 3. Migrate payment_methods table
    const { data: paymentMethods, error: paymentsError } = await supabaseAdmin
      .from("payment_methods")
      .select("id, name, image_url")

    if (paymentsError) {
      console.error("Error fetching payment methods:", paymentsError)
    } else if (paymentMethods) {
      for (const method of paymentMethods) {
        if (method.image_url && method.image_url.startsWith("data:")) {
          const result = base64ToBlob(method.image_url)
          if (result) {
            try {
              const filename = `payment-methods/${method.id}-${Date.now()}.${getExtension(result.mimeType)}`
              const blob = await put(filename, result.blob, { access: "public" })

              const { error: updateError } = await supabaseAdmin
                .from("payment_methods")
                .update({ image_url: blob.url })
                .eq("id", method.id)

              if (updateError) {
                errors.push(`Failed to update payment method ${method.id}: ${updateError.message}`)
                errorCount++
              } else {
                migratedCount++
                console.log(`Migrated payment method: ${method.name}`)
              }
            } catch (uploadError) {
              errors.push(`Failed to upload image for payment method ${method.id}: ${uploadError}`)
              errorCount++
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migration complete. Migrated ${migratedCount} images.`,
      migratedCount,
      errorCount,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error("Migration error:", error)
    return NextResponse.json({ success: false, error: "Migration failed: " + String(error) }, { status: 500 })
  }
}

// GET endpoint to check how many base64 images exist
export async function GET() {
  try {
    let base64Count = 0
    const tables: Record<string, number> = {}

    // Check products
    const { data: products } = await supabaseAdmin.from("products").select("id, image_url")

    if (products) {
      const count = products.filter((p) => p.image_url && p.image_url.startsWith("data:")).length
      tables.products = count
      base64Count += count
    }

    // Check product_groups
    const { data: productGroups } = await supabaseAdmin.from("product_groups").select("id, main_image_url")

    if (productGroups) {
      const count = productGroups.filter((p) => p.main_image_url && p.main_image_url.startsWith("data:")).length
      tables.product_groups = count
      base64Count += count
    }

    // Check payment_methods
    const { data: paymentMethods } = await supabaseAdmin.from("payment_methods").select("id, image_url")

    if (paymentMethods) {
      const count = paymentMethods.filter((p) => p.image_url && p.image_url.startsWith("data:")).length
      tables.payment_methods = count
      base64Count += count
    }

    return NextResponse.json({
      success: true,
      totalBase64Images: base64Count,
      byTable: tables,
      message:
        base64Count > 0
          ? `Found ${base64Count} base64 images that need migration.`
          : "No base64 images found. All images are already using URLs.",
    })
  } catch (error) {
    console.error("Check error:", error)
    return NextResponse.json({ success: false, error: "Check failed: " + String(error) }, { status: 500 })
  }
}
