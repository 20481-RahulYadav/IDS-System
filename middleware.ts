import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from "jsonwebtoken"

const JWT_SECRET = "a-string-secret-at-least-256-bits-long" // 🔐 Use exact value as used during signing

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === "/login" || path === "/register"
  const token = request.cookies.get("auth-token")?.value

  if (token) {
    try {
      verify(token, JWT_SECRET)
      if (isPublicPath) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    } catch (error) {
      console.warn("Token verification failed", error)
      if (!isPublicPath) {
        return NextResponse.redirect(new URL("/login", request.url))
      }
    }
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile", "/settings", "/logs", "/login", "/register"],
}
