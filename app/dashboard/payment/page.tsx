import { PaymentForm } from "@/components/payment-form"

export default function PaymentPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Payment</h1>
      <PaymentForm />
    </div>
  )
}

