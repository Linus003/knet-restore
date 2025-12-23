import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    console.log("Login attempt for username:", username)

    // Validate credentials - knet/root
    if (username === "knet" && password === "root") {
      const token = Buffer.from(
        JSON.stringify({
          username,
          role: "admin",
          loginTime: Date.now(),
          expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        }),
      ).toString("base64")

      console.log("Successful login for admin user:", username)
      return NextResponse.json({
        token,
        success: true,
        message: "Login successful",
        user: { username, role: "admin" },
      })
    }

    console.log("Failed login attempt - Invalid credentials for:", username)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json(
      {
        error: "Login failed",
        message: "An error occurred during login",
        success: false,
      },
      { status: 500 },
    )
  }
}
