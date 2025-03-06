import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/" || path === "/api/auth/login"

  // Get the session cookie
  const session = request.cookies.get("user_session")?.value

  // For development purposes, allow access to dashboard routes even without a session
  // In production, you would want to enforce authentication
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next()
  }

  // If the path is not public and there's no session, redirect to login
  if (!isPublicPath && !session) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // If the path is login and there's a session, redirect to dashboard
  if (isPublicPath && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/dashboard/:path*", "/api/auth/:path*"],
}

