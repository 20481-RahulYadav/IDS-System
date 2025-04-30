// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const secret = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login" || path === "/register";
  const token = request.cookies.get("auth-token")?.value;

  if (token) {
    try {
      await jwtVerify(token, secret);
      if (isPublicPath) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (e) {
      console.error("JWT verification failed:", e);
    }
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile", "/logs", "/settings", "/login", "/register"],
};
