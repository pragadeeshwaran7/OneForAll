import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
// import { signIn } from "@/lib/auth" // Removed signIn import

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // For demo purposes, accept any credentials
    // In a real app, you would validate against a database
    const user = {
      id: "1",
      name: "Demo User",
      email: email,
    }

    // Set a cookie to maintain the session
    cookies().set("user_session", JSON.stringify({ id: user.id, email: user.email }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
  }
}

