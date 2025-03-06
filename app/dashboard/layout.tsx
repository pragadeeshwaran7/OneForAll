import type React from "react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-14 items-center justify-end">
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 pb-16">{children}</main>
      <BottomNavigation />
    </div>
  )
}

