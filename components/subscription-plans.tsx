"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useWeb3 } from "@/hooks/use-web3"
import { useSubscriptionContract, PlanType } from "@/lib/contracts/SubscriptionContract"
import { ThemeToggle } from "@/components/theme-toggle"

const plans = [
  {
    id: "weekly",
    name: "Weekly",
    price: "₹499",
    priceInEth: "0.01",
    planType: PlanType.Weekly,
    features: ["Access to all charging stations", "24/7 customer support", "Real-time availability updates"],
  },
  {
    id: "monthly",
    name: "Monthly",
    price: "₹1,499",
    priceInEth: "0.03",
    planType: PlanType.Monthly,
    features: ["All Weekly plan features", "10% discount on charging fees", "Priority access during peak hours"],
  },
  {
    id: "yearly",
    name: "Yearly",
    price: "₹14,999",
    priceInEth: "0.25",
    planType: PlanType.Yearly,
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
  const subscriptionContract = useSubscriptionContract()

  const [selectedPlan, setSelectedPlan] = useState("monthly")
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentSubscription, setCurrentSubscription] = useState<{
    isSubscribed: boolean
    planType?: number
    expiryDate?: Date
  } | null>(null)
  const [prices, setPrices] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (isConnected) {
        try {
          // Get current subscription
          const subscription = await subscriptionContract.checkSubscription()
          setCurrentSubscription(subscription)

          // Get plan prices
          const weeklyPrice = await subscriptionContract.getPlanPrice(PlanType.Weekly)
          const monthlyPrice = await subscriptionContract.getPlanPrice(PlanType.Monthly)
          const yearlyPrice = await subscriptionContract.getPlanPrice(PlanType.Yearly)

          setPrices({
            weekly: weeklyPrice,
            monthly: monthlyPrice,
            yearly: yearlyPrice,
          })
        } catch (error) {
          console.error("Error fetching subscription data:", error)
        }
      }
    }

    fetchSubscriptionData()
  }, [isConnected, subscriptionContract])

  const handleSubscribe = async () => {
    setIsProcessing(true)

    try {
      const plan = plans.find((p) => p.id === selectedPlan)
      if (!plan) throw new Error("Invalid plan selected")

      if (isConnected) {
        // Make blockchain subscription
        const price = prices[selectedPlan] || plan.priceInEth
        await subscriptionContract.subscribe(plan.planType, price)
      } else {
        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      toast({
        title: "Subscription Successful",
        description: `You have successfully subscribed to the ${plan.name} plan.`,
      })

      router.push("/dashboard/wallet")
    } catch (error) {
      console.error("Subscription error:", error)
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
      <div className="relative rounded-xl bg-gradient-to-r from-primary to-accent p-1">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
        <div className="rounded-lg bg-white p-4 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Choose Your Plan</h3>
              <p className="text-sm text-muted-foreground">Select a subscription plan that works for you</p>
            </div>
          </div>

          {currentSubscription?.isSubscribed && (
            <div className="mt-4 rounded-lg bg-accent/10 p-3 text-sm">
              <p className="font-medium text-accent">
                You are currently subscribed to the {plans[currentSubscription.planType || 0]?.name} plan.
              </p>
              <p className="mt-1 text-muted-foreground">
                Expires on: {currentSubscription.expiryDate?.toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.id}>
            <RadioGroupItem value={plan.id} id={plan.id} className="peer sr-only" />
            <Label
              htmlFor={plan.id}
              className="flex flex-col rounded-lg border-2 border-muted bg-white p-4 hover:bg-accent/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary dark:bg-gray-900"
            >
              <span className="text-lg font-semibold">{plan.name}</span>
              <span className="mt-1 text-2xl font-bold">{plan.price}</span>
              <span className="mt-1 text-xs text-muted-foreground">
                {isConnected ? `or ${prices[plan.id] || plan.priceInEth} ETH` : ""}
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

      <Card className="overflow-hidden border-none bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
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
                {isConnected
                  ? ` or ${prices[selectedPlan] || plans.find((p) => p.id === selectedPlan)?.priceInEth} ETH`
                  : ""}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubscribe} className="w-full gradient-bg" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Subscribe Now"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

