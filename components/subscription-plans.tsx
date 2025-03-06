"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useWeb3 } from "@/hooks/use-web3"

const plans = [
  {
    id: "weekly",
    name: "Weekly",
    price: "₹499",
    priceInEth: "0.01",
    features: ["Access to all charging stations", "24/7 customer support", "Real-time availability updates"],
  },
  {
    id: "monthly",
    name: "Monthly",
    price: "₹1,499",
    priceInEth: "0.03",
    features: ["All Weekly plan features", "10% discount on charging fees", "Priority access during peak hours"],
  },
  {
    id: "yearly",
    name: "Yearly",
    price: "₹14,999",
    priceInEth: "0.25",
    features: [
      "All Monthly plan features",
      "20% discount on charging fees",
      "Free charging credits every month",
      "Exclusive access to premium stations",
    ],
  },
]

export function SubscriptionPlans() {
  const router = useRouter()
  const { toast } = useToast()
  const { isConnected } = useWeb3()
  const [selectedPlan, setSelectedPlan] = useState("monthly")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubscribe = async () => {
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Subscription Successful",
        description: `You have successfully subscribed to the ${plans.find((p) => p.id === selectedPlan)?.name} plan.`,
      })

      router.push("/dashboard/wallet")
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "There was an error processing your subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.id}>
            <RadioGroupItem value={plan.id} id={plan.id} className="peer sr-only" />
            <Label
              htmlFor={plan.id}
              className="flex flex-col rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span className="text-lg font-semibold">{plan.name}</span>
              <span className="mt-1 text-2xl font-bold">{plan.price}</span>
              <span className="mt-1 text-xs text-muted-foreground">
                {isConnected ? `or ${plan.priceInEth} ETH` : ""}
              </span>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
          <CardDescription>Review your subscription details before proceeding</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Plan:</span>
              <span className="font-medium">{plans.find((p) => p.id === selectedPlan)?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-medium">
                {plans.find((p) => p.id === selectedPlan)?.price}
                {isConnected ? ` or ${plans.find((p) => p.id === selectedPlan)?.priceInEth} ETH` : ""}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubscribe} className="w-full" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Subscribe Now"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

