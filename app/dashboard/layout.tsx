import type React from "react"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 pb-16">{children}</main>
      <BottomNavigation />
    </div>
  )
}

