"use client"

import { usePathname, useRouter } from "next/navigation"
import { MapPin, QrCode, Wallet, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    {
      icon: MapPin,
      label: "Stations",
      href: "/dashboard/stations",
      active: pathname === "/dashboard/stations",
    },
    {
      icon: QrCode,
      label: "Scan",
      href: "/dashboard",
      active: pathname === "/dashboard" || pathname === "/dashboard/payment",
    },
    {
      icon: Wallet,
      label: "Wallet",
      href: "/dashboard/wallet",
      active: pathname === "/dashboard/wallet",
    },
    {
      icon: User,
      label: "Profile",
      href: "/dashboard/profile",
      active: pathname === "/dashboard/profile",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around">
        {navItems.map((item) => (
          <button
            key={item.href}
            className={cn(
              "flex flex-col items-center justify-center px-3",
              item.active ? "text-primary" : "text-muted-foreground",
            )}
            onClick={() => router.push(item.href)}
          >
            <item.icon className="h-5 w-5" />
            <span className="mt-1 text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

