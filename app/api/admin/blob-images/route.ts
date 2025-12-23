import { NextResponse } from "next/server"
import { list } from "@vercel/blob"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // List all blobs in the storage
    const { blobs } = await list()

    // Filter for image files and format the response
    const images = blobs
      .filter((blob) => {
        const ext = blob.pathname.toLowerCase()
        return (
          ext.endsWith(".jpg") ||
          ext.endsWith(".jpeg") ||
          ext.endsWith(".png") ||
          ext.endsWith(".gif") ||
          ext.endsWith(".webp")
        )
      })
      .map((blob) => ({
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
        // Generate smart description from filename
        suggestedName: generateProductName(blob.pathname),
        suggestedDescription: generateDescription(blob.pathname),
      }))

    return NextResponse.json({
      success: true,
      images,
      total: images.length,
    })
  } catch (error: any) {
    console.error("Error listing blob images:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to list images",
        details: "Make sure BLOB_READ_WRITE_TOKEN is configured",
      },
      { status: 500 },
    )
  }
}

// Generate a product name from the filename
function generateProductName(pathname: string): string {
  // Extract filename without extension
  const filename = pathname.split("/").pop() || pathname
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "")

  // Clean up the name
  const cleaned = nameWithoutExt
    .replace(/[-_]/g, " ") // Replace dashes and underscores with spaces
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between camelCase
    .replace(/\d+/g, " ") // Remove numbers
    .replace(/\s+/g, " ") // Normalize spaces
    .trim()

  // Capitalize each word
  return cleaned
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

// Generate a description based on the filename
function generateDescription(pathname: string): string {
  const name = generateProductName(pathname)

  // Detect product type from name keywords
  const keywords = name.toLowerCase()

  if (keywords.includes("blender") || keywords.includes("mixer")) {
    return `High-quality ${name} for your kitchen. Perfect for smoothies, soups, and food preparation. Durable motor and easy-to-clean design.`
  } else if (keywords.includes("kettle")) {
    return `Premium ${name} with rapid boil technology. Energy efficient with automatic shut-off safety feature. Perfect for tea, coffee, and instant beverages.`
  } else if (keywords.includes("microwave")) {
    return `Versatile ${name} with multiple power levels. Quick and convenient cooking, reheating, and defrosting. Easy to use digital controls.`
  } else if (keywords.includes("fridge") || keywords.includes("refrigerator")) {
    return `Spacious ${name} with energy-efficient cooling. Multiple compartments for organized storage. Modern design that complements any kitchen.`
  } else if (keywords.includes("wash") || keywords.includes("washer")) {
    return `Efficient ${name} with multiple wash programs. Gentle on fabrics while providing thorough cleaning. Water and energy saving features.`
  } else if (keywords.includes("iron") || keywords.includes("press")) {
    return `Professional ${name} with adjustable temperature settings. Steam feature for wrinkle-free results. Safe and easy to use.`
  } else if (keywords.includes("cooker") || keywords.includes("stove")) {
    return `Reliable ${name} for all your cooking needs. Even heat distribution for perfect results. Durable construction for long-lasting use.`
  } else if (keywords.includes("fan") || keywords.includes("air")) {
    return `Powerful ${name} for comfortable air circulation. Quiet operation with multiple speed settings. Energy efficient design.`
  } else if (keywords.includes("heater")) {
    return `Efficient ${name} for cozy warmth. Safety features including overheat protection. Compact design suitable for any room.`
  } else if (keywords.includes("tv") || keywords.includes("television")) {
    return `Stunning ${name} with crystal clear display. Smart features for streaming your favorite content. Immersive viewing experience.`
  } else if (keywords.includes("speaker") || keywords.includes("sound")) {
    return `Premium ${name} with rich, powerful audio. Wireless connectivity for easy use. Compact design with impressive sound quality.`
  } else {
    return `Quality ${name} from Knet Appliances. Built for durability and performance. Excellent value for your home.`
  }
}
