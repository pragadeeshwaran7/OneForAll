"use client"

import { useState } from "react"
import { ArrowDownUp, Plus, Minus, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useWeb3 } from "@/hooks/use-web3"
import { NetworkSelector } from "@/components/network-selector"

// Mock transaction data
const transactions = [
  {
    id: "tx1",
    type: "charge",
    amount: "₹150",
    date: "2023-03-01",
    status: "completed",
    location: "Chennai Central Station",
  },
  {
    id: "tx2",
    type: "deposit",
    amount: "₹1000",
    date: "2023-02-28",
    status: "completed",
  },
  {
    id: "tx3",
    type: "subscription",
    amount: "₹1,499",
    date: "2023-02-25",
    status: "completed",
    plan: "Monthly",
  },
  {
    id: "tx4",
    type: "charge",
    amount: "₹120",
    date: "2023-02-20",
    status: "completed",
    location: "T Nagar Charging Hub",
  },
]

export function WalletDashboard() {
  const { account, isConnected, connectWallet } = useWeb3()
  const [balance, setBalance] = useState("₹2,231")
  const [ethBalance, setEthBalance] = useState("0.05 ETH")
  const [showNetworkDialog, setShowNetworkDialog] = useState(false)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wallet Balance</CardTitle>
          <CardDescription>Your current balance and wallet details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-3xl font-bold">{balance}</span>
            {isConnected ? (
              <div className="flex flex-col items-center">
                <span className="text-lg font-medium">{ethBalance}</span>
                <span className="max-w-[250px] truncate text-xs text-muted-foreground">{account}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 flex items-center gap-1"
                  onClick={() => setShowNetworkDialog(true)}
                >
                  <span>Ethereum</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowNetworkDialog(true)}>
                Connect Wallet
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Funds
          </Button>
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <Minus className="h-4 w-4" />
            Withdraw
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent transactions and charging history</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="charges">Charges</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <ArrowDownUp className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {tx.type === "charge"
                            ? `Charging at ${tx.location}`
                            : tx.type === "subscription"
                              ? `${tx.plan} Subscription`
                              : "Wallet Deposit"}
                        </p>
                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                      </div>
                    </div>
                    <span className={`font-medium ${tx.type === "deposit" ? "text-green-600" : ""}`}>
                      {tx.type === "deposit" ? "+" : "-"}
                      {tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="charges" className="mt-4">
              <div className="space-y-4">
                {transactions
                  .filter((tx) => tx.type === "charge")
                  .map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <ArrowDownUp className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Charging at {tx.location}</p>
                          <p className="text-xs text-muted-foreground">{tx.date}</p>
                        </div>
                      </div>
                      <span className="font-medium">-{tx.amount}</span>
                    </div>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="payments" className="mt-4">
              <div className="space-y-4">
                {transactions
                  .filter((tx) => tx.type === "deposit" || tx.type === "subscription")
                  .map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <ArrowDownUp className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {tx.type === "subscription" ? `${tx.plan} Subscription` : "Wallet Deposit"}
                          </p>
                          <p className="text-xs text-muted-foreground">{tx.date}</p>
                        </div>
                      </div>
                      <span className={`font-medium ${tx.type === "deposit" ? "text-green-600" : ""}`}>
                        {tx.type === "deposit" ? "+" : "-"}
                        {tx.amount}
                      </span>
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={showNetworkDialog} onOpenChange={setShowNetworkDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
            <DialogDescription>Choose a blockchain network to connect your wallet</DialogDescription>
          </DialogHeader>
          <NetworkSelector onClose={() => setShowNetworkDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

