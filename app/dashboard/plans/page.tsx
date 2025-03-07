import { SubscriptionPlans } from "@/components/subscription-plans"
#1
export default function PlansPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Choose a Plan</h1>
      <SubscriptionPlans />
    </div>
  )
}

