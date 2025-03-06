"use client"

import { useState } from "react"
import Image from "next/image"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWeb3 } from "@/hooks/use-web3"
import { useToast } from "@/components/ui/use-toast"

interface NetworkSelectorProps {
  onClose: () => void
}

const networks = [
  {
    id: "ethereum",
    name: "Ethereum",
    icon: "/placeholder.svg?height=40&width=40",
    chainId: 1,
  },
  {
    id: "polygon",
    name: "Polygon",
    icon: "/placeholder.svg?height=40&width=40",
    chainId: 137,
  },
  {
    id: "aptos",
    name: "Aptos",
    icon: "/placeholder.svg?height=40&width=40",
    chainId: null, // Not an EVM chain
  },
  {
    id: "binance",
    name: "BNB Chain",
    icon: "/placeholder.svg?height=40&width=40",
    chainId: 56,
  },
]

export function NetworkSelector({ onClose }: NetworkSelectorProps) {
  const { connectWallet, isConnected, account } = useWeb3()
  const { toast } = useToast()
  const [selectedNetwork, setSelectedNetwork] = useState("ethereum")
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await connectWallet()
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${networks.find((n) => n.id === selectedNetwork)?.name}`,
      })
      onClose()
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="space-y-4 py-2">
      <div className="grid grid-cols-2 gap-4">
        {networks.map((network) => (
          <div
            key={network.id}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent ${
              selectedNetwork === network.id ? "border-primary" : ""
            }`}
            onClick={() => setSelectedNetwork(network.id)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background">
              <Image src={network.icon || "/placeholder.svg"} alt={network.name} width={24} height={24} />
            </div>
            <div className="flex-1">
              <p className="font-medium">{network.name}</p>
            </div>
            {selectedNetwork === network.id && <Check className="h-5 w-5 text-primary" />}
          </div>
        ))}
      </div>

      <Button className="w-full" onClick={handleConnect} disabled={isConnecting}>
        {isConnecting ? "Connecting..." : isConnected ? "Switch Network" : "Connect Wallet"}
      </Button>
    </div>
  )
}

