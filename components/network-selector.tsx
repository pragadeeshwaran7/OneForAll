"use client"

import { useState } from "react"
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
    color: "#627EEA",
  },
  {
    id: "polygon",
    name: "Polygon",
    icon: "/placeholder.svg?height=40&width=40",
    chainId: 137,
    color: "#8247E5",
  },
  {
    id: "aptos",
    name: "Aptos",
    icon: "/placeholder.svg?height=40&width=40",
    chainId: null, // Not an EVM chain
    color: "#2DD8A7",
  },
  {
    id: "binance",
    name: "BNB Chain",
    icon: "/placeholder.svg?height=40&width=40",
    chainId: 56,
    color: "#F0B90B",
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
            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/10 ${
              selectedNetwork === network.id ? "border-primary" : ""
            }`}
            onClick={() => setSelectedNetwork(network.id)}
            style={{
              borderColor: selectedNetwork === network.id ? network.color : undefined,
              boxShadow: selectedNetwork === network.id ? `0 0 0 1px ${network.color}20` : undefined,
            }}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: `${network.color}20` }}
            >
              <div className="h-8 w-8 rounded-full" style={{ backgroundColor: network.color }}></div>
            </div>
            <div className="flex-1">
              <p className="font-medium">{network.name}</p>
            </div>
            {selectedNetwork === network.id && <Check className="h-5 w-5 text-primary" />}
          </div>
        ))}
      </div>

      <Button className="w-full gradient-bg" onClick={handleConnect} disabled={isConnecting}>
        {isConnecting ? "Connecting..." : isConnected ? "Switch Network" : "Connect Wallet"}
      </Button>
    </div>
  )
}

