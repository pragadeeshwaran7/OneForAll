"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Zap, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useWeb3 } from "@/hooks/use-web3"
import { usePayPerUseContract } from "@/lib/contracts/PayPerUseContract"
import { ThemeToggle } from "@/components/theme-toggle"

export function PaymentForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { isConnected } = useWeb3()
  const payPerUseContract = usePayPerUseContract()

  const [paymentMethod, setPaymentMethod] = useState("crypto")
  const [isProcessing, setIsProcessing] = useState(false)
  const [duration, setDuration] = useState("30")
  const [rate, setRate] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRate = async () => {
      try {
        if (isConnected) {
          const stationRate = await payPerUseContract.getRate(1) // Station ID 1
          setRate(stationRate)
        } else {
          // Mock rate for non-connected users
          setRate("0.00002")
        }
      } catch (error) {
        console.error("Error fetching rate:", error)
        // Fallback to mock rate
        setRate("0.00002")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRate()
  }, [isConnected, payPerUseContract])

  const calculateCost = () => {
    if (!rate) return { eth: "0", inr: "0" }

    const durationNum = Number.parseInt(duration)
    const ethCost = Number.parseFloat(rate) * durationNum
    const inrCost = durationNum * 12 // ₹12 per minute

    return {
      eth: ethCost.toFixed(6),
      inr: inrCost.toString(),
    }
  }

  const { eth: ethCost, inr: inrCost } = calculateCost()

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      if (paymentMethod === "crypto" && isConnected) {
        // Make blockchain payment
        await payPerUseContract.makePayment(
          1, // Station ID
          Number.parseInt(duration),
          ethCost,
        )
      } else {
        // Simulate card payment
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      toast({
        title: "Payment Successful",
        description: `Your payment for ${duration} minutes of charging has been processed.`,
      })

      router.push("/dashboard/plans")
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <CardHeader className="relative gradient-bg text-white">
          <div className="absolute right-4 top-4">
            <ThemeToggle />
          </div>
          <CardTitle>Charging Details</CardTitle>
          <CardDescription className="text-white/80">Chennai Central EV Hub - Station #3</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Loading rates...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span>Rate:</span>
                <span className="font-medium">₹12/min or {rate} ETH/min</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Charging Duration (minutes)</Label>
                <RadioGroup value={duration} onValueChange={setDuration} className="grid grid-cols-3 gap-2">
                  <div>
                    <RadioGroupItem value="30" id="30min" className="peer sr-only" />
                    <Label
                      htmlFor="30min"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span className="text-lg font-semibold">30</span>
                      <span className="text-xs">₹360</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="60" id="60min" className="peer sr-only" />
                    <Label
                      htmlFor="60min"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span className="text-lg font-semibold">60</span>
                      <span className="text-xs">₹720</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="120" id="120min" className="peer sr-only" />
                    <Label
                      htmlFor="120min"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span className="text-lg font-semibold">120</span>
                      <span className="text-xs">₹1440</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Choose how you want to pay</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={isConnected ? "crypto" : "card"} onValueChange={setPaymentMethod}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="crypto">Crypto</TabsTrigger>
              <TabsTrigger value="card">Card</TabsTrigger>
            </TabsList>
            <TabsContent value="crypto" className="space-y-4 pt-4">
              {isConnected ? (
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      <span className="font-medium">Pay with Crypto</span>
                    </div>
                    <span className="text-sm">{ethCost} ETH</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6">
                  <p className="mb-4 text-center text-sm text-muted-foreground">
                    Connect your wallet to pay with cryptocurrency
                  </p>
                  <Button variant="outline" onClick={() => router.push("/dashboard/wallet")}>
                    Connect Wallet
                  </Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="card" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="cardName">Name on Card</Label>
                <Input id="cardName" placeholder="Enter name on card" className="bg-white dark:bg-gray-800" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="bg-white dark:bg-gray-800" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" className="bg-white dark:bg-gray-800" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" className="bg-white dark:bg-gray-800" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handlePayment}
            className="w-full gradient-bg"
            disabled={isProcessing || (paymentMethod === "crypto" && !isConnected)}
          >
            {isProcessing ? "Processing..." : `Pay ₹${inrCost}`}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

