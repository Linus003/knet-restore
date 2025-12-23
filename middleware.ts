import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === "/admin/login") {
    return NextResponse.next()
  }

  // Protect admin routes (except login)
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("adminToken")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    try {
      const decoded = JSON.parse(Buffer.from(token, "base64").toString())
      if (decoded.expires && decoded.expires < Date.now()) {
        // Token expired, redirect to login
        const response = NextResponse.redirect(new URL("/admin/login", request.url))
        response.cookies.delete("adminToken")
        return response
      }
    } catch {
      // Invalid token, redirect to login
      const response = NextResponse.redirect(new URL("/admin/login", request.url))
      response.cookies.delete("adminToken")
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
