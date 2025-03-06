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
import { ThemeToggle } from "@/components/theme-toggle"
import { DevLoginBypass } from "@/components/dev-login-bypass"

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { connectWallet, isConnected } = useWeb3()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Try the API call first
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Login failed")
        }
      } catch (apiError) {
        console.warn("API login failed, using fallback:", apiError)
        // Fallback for development - simulate successful login
        if (process.env.NODE_ENV === "development") {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 1000))
        } else {
          throw apiError
        }
      }

      toast({
        title: "Login successful",
        description: "Welcome to ChargePay!",
      })
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate registration
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Registration successful",
        description: "Your account has been created. Please log in.",
      })
      setAuthMode("login")
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "There was an error creating your account. Please try again.",
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
    <Card className="w-full border-none bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
      <CardHeader className="relative">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
        <CardTitle>Welcome to ChargePay</CardTitle>
        <CardDescription>
          {authMode === "login"
            ? "Login to your account or connect your Web3 wallet"
            : "Create a new account to get started"}
        </CardDescription>
      </CardHeader>
      <Tabs defaultValue="email">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="wallet">Web3 Wallet</TabsTrigger>
        </TabsList>
        <TabsContent value="email">
          {authMode === "login" ? (
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
                    className="bg-white dark:bg-gray-800"
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
                    className="bg-white dark:bg-gray-800"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-2">
                <Button type="submit" className="w-full gradient-bg" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <p className="text-center text-sm">
                  Don't have an account?{" "}
                  <button type="button" className="text-accent underline" onClick={() => setAuthMode("register")}>
                    Sign up
                  </button>
                </p>
              </CardFooter>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-white dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white dark:bg-gray-800"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-2">
                <Button type="submit" className="w-full gradient-bg" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
                <p className="text-center text-sm">
                  Already have an account?{" "}
                  <button type="button" className="text-accent underline" onClick={() => setAuthMode("login")}>
                    Log in
                  </button>
                </p>
              </CardFooter>
            </form>
          )}
        </TabsContent>
        <TabsContent value="wallet">
          <CardContent className="pt-4">
            <div className="rounded-lg border border-dashed p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                </svg>
              </div>
              <h3 className="mb-1 text-lg font-semibold">Connect Your Wallet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Connect your Web3 wallet (like MetaMask) to login securely without a password.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleWalletLogin} className="w-full gradient-bg" disabled={isConnected}>
              {isConnected ? "Wallet Connected" : "Connect Wallet"}
            </Button>
          </CardFooter>
        </TabsContent>
      </Tabs>
      <DevLoginBypass />
    </Card>
  )
}

