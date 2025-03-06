"use client"

import { useState, useEffect } from "react"
import { ArrowDownUp, Plus, Minus, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWeb3 } from "@/hooks/use-web3"
import { NetworkSelector } from "@/components/network-selector"
import { useDepositRefundContract } from "@/lib/contracts/DepositRefundContract"
import { useToast } from "@/components/ui/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"

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
  const { account, isConnected } = useWeb3()
  const depositRefundContract = useDepositRefundContract()
  const { toast } = useToast()

  const [balance, setBalance] = useState("₹2,231")
  const [ethBalance, setEthBalance] = useState("0.05 ETH")
  const [contractBalance, setContractBalance] = useState("0")
  const [showNetworkDialog, setShowNetworkDialog] = useState(false)
  const [showDepositDialog, setShowDepositDialog] = useState(false)
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false)
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const fetchContractBalance = async () => {
      if (isConnected) {
        setIsLoading(true)
        try {
          const balance = await depositRefundContract.getBalance()
          setContractBalance(balance)
        } catch (error) {
          console.error("Error fetching balance:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchContractBalance()
  }, [isConnected, depositRefundContract])

  const handleDeposit = async () => {
    if (!depositAmount) return

    setIsProcessing(true)
    try {
      await depositRefundContract.deposit(depositAmount)

      toast({
        title: "Deposit Successful",
        description: `Successfully deposited ${depositAmount} ETH to your wallet.`,
      })

      // Update balance
      const newBalance = await depositRefundContract.getBalance()
      setContractBalance(newBalance)

      setShowDepositDialog(false)
      setDepositAmount("")
    } catch (error) {
      console.error("Deposit error:", error)
      toast({
        title: "Deposit Failed",
        description: "There was an error processing your deposit. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount) return

    setIsProcessing(true)
    try {
      await depositRefundContract.withdraw(withdrawAmount)

      toast({
        title: "Withdrawal Successful",
        description: `Successfully withdrew ${withdrawAmount} ETH from your wallet.`,
      })

      // Update balance
      const newBalance = await depositRefundContract.getBalance()
      setContractBalance(newBalance)

      setShowWithdrawDialog(false)
      setWithdrawAmount("")
    } catch (error) {
      console.error("Withdrawal error:", error)
      toast({
        title: "Withdrawal Failed",
        description: "There was an error processing your withdrawal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <CardHeader className="relative gradient-bg text-white">
          <div className="absolute right-4 top-4">
            <ThemeToggle />
          </div>
          <CardTitle>Wallet Balance</CardTitle>
          <CardDescription className="text-white/80">Your current balance and wallet details</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-3xl font-bold">{balance}</span>
            {isConnected ? (
              <div className="flex flex-col items-center">
                <span className="text-lg font-medium">{ethBalance}</span>
                <span className="max-w-[250px] truncate text-xs text-muted-foreground">{account}</span>
                <div className="mt-2 rounded-lg bg-accent/10 p-3 text-center">
                  <p className="text-sm font-medium">Contract Balance</p>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-1">
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      <span className="text-xs">Loading...</span>
                    </div>
                  ) : (
                    <p className="text-lg font-bold text-accent">{contractBalance} ETH</p>
                  )}
                </div>
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
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowDepositDialog(true)}
            disabled={!isConnected}
          >
            <Plus className="h-4 w-4" />
            Add Funds
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowWithdrawDialog(true)}
            disabled={!isConnected || contractBalance === "0"}
          >
            <Minus className="h-4 w-4" />
            Withdraw
          </Button>
        </CardFooter>
      </Card>

      <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
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

      <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Deposit Funds</DialogTitle>
            <DialogDescription>Add funds to your ChargePay wallet</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deposit-amount">Amount (ETH)</Label>
              <Input
                id="deposit-amount"
                type="number"
                placeholder="0.01"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="bg-white dark:bg-gray-800"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleDeposit} className="w-full gradient-bg" disabled={isProcessing || !depositAmount}>
              {isProcessing ? "Processing..." : "Deposit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>Withdraw funds from your ChargePay wallet</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Amount (ETH)</Label>
              <Input
                id="withdraw-amount"
                type="number"
                placeholder="0.01"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                max={contractBalance}
                className="bg-white dark:bg-gray-800"
              />
              <p className="text-xs text-muted-foreground">Available balance: {contractBalance} ETH</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleWithdraw}
              className="w-full gradient-bg"
              disabled={
                isProcessing ||
                !withdrawAmount ||
                Number.parseFloat(withdrawAmount) > Number.parseFloat(contractBalance)
              }
            >
              {isProcessing ? "Processing..." : "Withdraw"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

