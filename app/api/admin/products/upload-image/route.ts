import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"]

export async function POST(request: NextRequest) {
  try {
    // Check if BLOB_READ_WRITE_TOKEN is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("BLOB_READ_WRITE_TOKEN is not configured")
      return NextResponse.json(
        {
          error: "Image storage is not configured. Please contact the administrator.",
          code: "BLOB_NOT_CONFIGURED",
        },
        { status: 500 },
      )
    }

    let formData: FormData
    try {
      formData = await request.formData()
    } catch (e) {
      return NextResponse.json(
        {
          error: "Invalid form data. Please try again.",
          code: "INVALID_FORM_DATA",
        },
        { status: 400 },
      )
    }

    const file = formData.get("image") as File | null

    if (!file) {
      return NextResponse.json(
        {
          error: "No image file was provided. Please select an image to upload.",
          code: "NO_FILE",
        },
        { status: 400 },
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file type: ${file.type}. Allowed types are: JPEG, PNG, WebP, and GIF.`,
          code: "INVALID_TYPE",
          allowedTypes: ALLOWED_TYPES,
        },
        { status: 400 },
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
      return NextResponse.json(
        {
          error: `File is too large (${sizeMB}MB). Maximum size is 10MB.`,
          code: "FILE_TOO_LARGE",
          maxSize: MAX_FILE_SIZE,
          fileSize: file.size,
        },
        { status: 400 },
      )
    }

    // Validate file has content
    if (file.size === 0) {
      return NextResponse.json(
        {
          error: "The file appears to be empty. Please select a valid image.",
          code: "EMPTY_FILE",
        },
        { status: 400 },
      )
    }

    // Generate a unique filename with UUID to prevent any naming conflicts
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const safeExtension = ["jpg", "jpeg", "png", "webp", "gif"].includes(extension) ? extension : "jpg"
    const filename = `products/${timestamp}-${randomId}.${safeExtension}`

    // Upload to Vercel Blob
    let blob
    try {
      blob = await put(filename, file, {
        access: "public",
        addRandomSuffix: true, // This ensures unique names even if somehow duplicated
      })
    } catch (blobError: any) {
      console.error("Vercel Blob upload error:", blobError)

      // Handle specific Blob errors
      if (blobError.message?.includes("unauthorized") || blobError.message?.includes("token")) {
        return NextResponse.json(
          {
            error: "Storage authentication failed. Please contact the administrator.",
            code: "BLOB_AUTH_ERROR",
          },
          { status: 500 },
        )
      }

      if (blobError.message?.includes("quota") || blobError.message?.includes("limit")) {
        return NextResponse.json(
          {
            error: "Storage quota exceeded. Please contact the administrator.",
            code: "BLOB_QUOTA_ERROR",
          },
          { status: 500 },
        )
      }

      return NextResponse.json(
        {
          error: "Failed to upload to storage. Please try again.",
          code: "BLOB_UPLOAD_ERROR",
          details: blobError.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      imageUrl: blob.url,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      storedAs: filename,
    })
  } catch (error: any) {
    console.error("Unexpected error uploading image:", error)
    return NextResponse.json(
      {
        error: "An unexpected error occurred. Please try again.",
        code: "UNEXPECTED_ERROR",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
