import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminTokenServer } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ valid: false, error: "No token provided" }, { status: 401 })
    }

    const user = verifyAdminTokenServer(token)

    if (user) {
      return NextResponse.json({
        valid: true,
        user: { username: user.username, role: user.role },
      })
    } else {
      return NextResponse.json({ valid: false, error: "Invalid token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ valid: false, error: "Verification failed" }, { status: 500 })
  }
}
