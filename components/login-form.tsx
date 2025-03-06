"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useWeb3 } from "@/hooks/use-web3"

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { connectWallet, isConnected } = useWeb3()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate login
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Login successful",
        description: "Welcome to ChargePay!",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleWalletLogin = async () => {
    try {
      await connectWallet()
      toast({
        title: "Wallet connected",
        description: "Your Web3 wallet has been connected successfully!",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Failed to connect your wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Login to ChargePay</CardTitle>
        <CardDescription>Login with your email or connect your Web3 wallet</CardDescription>
      </CardHeader>
      <Tabs defaultValue="email">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="wallet">Web3 Wallet</TabsTrigger>
        </TabsList>
        <TabsContent value="email">
          <form onSubmit={handleEmailLogin}>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login with Email"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
        <TabsContent value="wallet">
          <CardContent className="pt-4">
            <p className="mb-4 text-sm text-muted-foreground">
              Connect your Web3 wallet (like MetaMask) to login securely without a password.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleWalletLogin} className="w-full" disabled={isConnected}>
              {isConnected ? "Wallet Connected" : "Connect Wallet"}
            </Button>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

