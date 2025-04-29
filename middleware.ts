import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from "jsonwebtoken"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/register"

  // Get the token from the cookies
  const token = request.cookies.get("auth-token")?.value || ""

  // If the path is public and the user is logged in, redirect to dashboard
  if (isPublicPath && token) {
    try {
      // Verify the token
      verify(token, process.env.JWT_SECRET || "fallback_secret")
      return NextResponse.redirect(new URL("/dashboard", request.url))
    } catch (error) {
      // If token verification fails, continue to the public path
    }
  }

  // If the path is not public and the user is not logged in, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
}
