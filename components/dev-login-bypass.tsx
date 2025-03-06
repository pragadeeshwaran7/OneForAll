"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function DevLoginBypass() {
  const router = useRouter()

  const handleBypass = () => {
    // This is only for development purposes
    router.push("/dashboard")
  }

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="mt-4 text-center">
      <p className="text-xs text-muted-foreground mb-2">Development Mode</p>
      <Button variant="outline" size="sm" onClick={handleBypass} className="text-xs">
        Bypass Login (Dev Only)
      </Button>
    </div>
  )
}

