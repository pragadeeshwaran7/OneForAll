import { WalletDashboard } from "@/components/wallet-dashboard"

export default function WalletPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Your Wallet</h1>
      <WalletDashboard />
    </div>
  )
}

