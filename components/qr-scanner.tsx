"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

export function QrScanner() {
  const router = useRouter()
  const { toast } = useToast()
  const [isScanning, setIsScanning] = useState(false)
  const [showDialog, setShowDialog] = useState(true)
  const [scannedStation, setScannedStation] = useState<string | null>(null)

  const startScanning = () => {
    setIsScanning(true)

    // Simulate QR code scanning
    setTimeout(() => {
      setIsScanning(false)
      setScannedStation("Chennai Central EV Hub - Station #3")
      toast({
        title: "QR Code Scanned",
        description: "Charging station identified successfully!",
      })
    }, 2000)
  }

  const handlePayment = () => {
    router.push("/dashboard/payment")
  }

  return (
    <>
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Scan QR Code</CardTitle>
          <CardDescription>Scan the QR code at the charging station to begin</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="mb-4 flex h-48 w-48 items-center justify-center rounded-lg border-2 border-dashed">
            {isScanning ? (
              <div className="text-center">
                <div className="mb-2 h-24 w-24 animate-pulse rounded-md bg-primary/20"></div>
                <p className="text-sm text-muted-foreground">Scanning...</p>
              </div>
            ) : scannedStation ? (
              <div className="text-center">
                <QrCode className="mx-auto mb-2 h-16 w-16 text-primary" />
                <p className="font-medium">{scannedStation}</p>
                <p className="mt-2 text-sm text-muted-foreground">Ready to pay</p>
              </div>
            ) : (
              <QrCode className="h-16 w-16 text-muted-foreground" />
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {!scannedStation ? (
            <Button onClick={startScanning} disabled={isScanning} className="w-full">
              {isScanning ? "Scanning..." : "Scan QR Code"}
            </Button>
          ) : (
            <>
              <Button onClick={handlePayment} className="w-full" variant="default">
                Proceed to Payment
              </Button>
              <Button onClick={() => setScannedStation(null)} className="w-full" variant="outline">
                Scan Again
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome to ChargePay</DialogTitle>
            <DialogDescription>
              Ready to charge your vehicle? Scan the QR code at the charging station, then pay to begin charging.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-4">
            <QrCode className="h-16 w-16 text-primary" />
          </div>
          <DialogFooter>
            <Button onClick={() => setShowDialog(false)} className="w-full">
              Scan to Pay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

