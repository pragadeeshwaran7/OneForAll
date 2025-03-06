import { BatteryCharging } from "lucide-react"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return <BatteryCharging className={className} />
}

