import { QrScanner } from "@/components/qr-scanner"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <QrScanner />
    </div>
  )
}

