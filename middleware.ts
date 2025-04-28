import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from "jsonwebtoken"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/register" || path === "/"

  // Get the token from the cookies
  const token = request.cookies.get("auth-token")?.value || ""

  // If the path is public and the user is logged in, redirect to dashboard
  if (isPublicPath && token) {
    try {
      // Verify the token
      verify(token, process.env.JWT_SECRET || "fallback_secret")
      return NextResponse.redirect(new URL("/dashboard", request.url))
    } catch (error) {
      // If token verification fails, clear the invalid token
      const response = NextResponse.redirect(new URL(path, request.url))
      response.cookies.delete("auth-token")
      return response
    }
  }

  // If the path is not public and the user is not logged in, redirect to login
  if (!isPublicPath && !token) {
    // Store the original URL to redirect back after login
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.nextUrl.pathname))
    return NextResponse.redirect(url)
  }

  // If the path is not public and the user has a token, verify it
  if (!isPublicPath && token) {
    try {
      // Verify the token
      verify(token, process.env.JWT_SECRET || "fallback_secret")
      return NextResponse.next()
    } catch (error) {
      // If token verification fails, redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("auth-token")
      return response
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
