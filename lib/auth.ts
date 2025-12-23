export interface AdminUser {
  username: string
  role: string
  loginTime?: number
  expires?: number
}

// Client-side authentication functions (no JWT verification in browser)
export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false

  const token = localStorage.getItem("adminToken")
  if (!token) return false

  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString())
    return decoded.expires > Date.now()
  } catch {
    return false
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("adminToken")
}

export function logoutAdmin(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("adminToken")
    document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    window.location.href = "/admin/login"
  }
}

export function verifyAdminTokenServer(token: string): AdminUser | null {
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString()) as AdminUser

    // Check if token is expired
    if (decoded.expires && decoded.expires < Date.now()) {
      return null
    }

    return decoded
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}
