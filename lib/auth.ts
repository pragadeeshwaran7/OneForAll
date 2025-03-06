// This is a simplified auth implementation
// In a real app, you would use a proper auth provider like NextAuth.js

import { cookies } from "next/headers"

interface User {
  id: string
  name: string
  email: string
}

// Mock user database
const users: Record<string, User> = {
  "user@example.com": {
    id: "1",
    name: "Demo User",
    email: "user@example.com",
  },
}

export async function signIn(email: string, password: string): Promise<User> {
  // In a real app, you would verify the password
  // For demo purposes, we'll accept any credentials

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Create a mock user
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

      resolve(user)
    }, 500)
  })
}

export async function signOut() {
  cookies().delete("user_session")
}

export async function getUser(): Promise<User | null> {
  const session = cookies().get("user_session")
  if (!session) return null

  try {
    const { email } = JSON.parse(session.value)
    return users[email] || null
  } catch {
    return null
  }
}

